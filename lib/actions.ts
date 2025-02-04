"use server";
import { redirect } from "next/navigation";
import { RegisterSchema, LoginSchema } from "./zod";
import { hashSync } from "bcrypt-ts";
import prisma from "./prisma";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

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
  const hashedPassword = hashSync(password, 10);

  try {
    await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });
    return { success: true };
  } catch (error) {
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

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
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
};
