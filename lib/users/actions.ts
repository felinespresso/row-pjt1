"use server";
import { redirect } from "next/navigation";
import { RegisterSchema, LoginSchema, ProfileSchema } from "./zod";
import { hashSync } from "bcrypt-ts";
import prisma from "../prisma";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { auth } from "@/auth";
import { put, del } from "@vercel/blob";
import { getUserByEmail, getUserByUsername } from "./user";

export const signUpCredentials = async (
  prevState: unknown,
  formData: FormData
) => {
  const validatedFields = RegisterSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }
  const { email, username, password } = validatedFields.data;
  console.log(validatedFields.data);
  const hashedPassword = hashSync(password, 10);
  const existingUserByEmail = await getUserByEmail(email);
  const existingUserByUsername = await getUserByUsername(username);

  try {
    if (existingUserByEmail) {
      return { message: "User with this email already exists." };
    }
    if (existingUserByUsername) {
      return { message: "User with this username already exists." };
    }
    await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { message: "Sign up failed, please try again" };
  }
  // redirect("/login");
};

//Sign-in Credential-action
export const signInCredentials = async (
  prevState: unknown,
  formData: FormData
) => {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { email, password } = validatedFields.data;

  const userExists = await getUserByEmail(email);
  if (!userExists || !userExists.email || !userExists.password) {
    return { message: "User does not exist" };
  }

  try {
    await signIn("credentials", {
      email: userExists.email,
      password: password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Login failed, please try again." };
        default:
          return { message: "Something went wrong, please try again." };
      }
    }
    throw error;
  }
  return { success: "User logged in successfully!" };
};

export const updateUserProfile = async (userId:any, { username, password }: { username: string; password?: string }) => {
  const validatedFields = ProfileSchema.safeParse({ username, password });

  if(!validatedFields.success){
      return {
          error: JSON.stringify(validatedFields.error.flatten().fieldErrors),
          success: false
      }
  }
  

  const updateData: Partial<{ username: string; password: string }> = { username };
  if (password) {
      updateData.password = hashSync(password, 10);
  }

  try {
      await prisma.user.update({
          where: { id: userId },
          data: updateData
      });
      return { success: true };
  } catch (error) {
      return { success: false, error: 'Failed to update profile' };
  }
};

export const uploadProfilePicture = async (prevState: any, formData: FormData) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "User is not authenticated" };

  const id = session.user.id;
  const file = formData.get("image") as File | null;

  if (!file || !file.type.startsWith("image/")) {
      return { error: "Only image files are allowed" };
  }
  if (file.size > 8_000_000) {
      return { error: "File size must be less than 8MB" };
  }

  try {
      const user = await prisma.user.findUnique({ where: { id }, select: { image: true } });
      if (user?.image && !user.image.includes("/avatar.jpg")) {
          await del(user.image);
      }
      const { url } = await put(file.name, file, { access: "public", multipart: true });

      await prisma.user.update({
          where: { id },
          data: { image: url },
      });
      const updatedUser = await prisma.user.findUnique({
          where: { id },
          select: { image: true }
      });
      return { success: true, imageUrl: updatedUser?.image || "/avatar.jpg" };
  } catch (error) {
      console.error("Upload failed:", error);
      return { error: "Failed to upload profile picture" };
  }
};

export const removeProfilePicture = async (userId:any) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "User is not authenticated" };

  const id = session.user.id;
  const user = await prisma.user.findUnique({ where: { id }, select: { image: true } });
  if (user?.image) {
      await del(user.image);
  }
  
  try {
      await prisma.user.update({
          where: { id: userId },
          data: { image: null },
      });
      return { success: true };
  } catch (error) {
      return { success: false, error: "Failed to remove profile picture" };
  }
};
