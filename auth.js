//auth.js
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./lib/users/zod";
import { compareSync } from "bcrypt-ts";
import { getUserById } from "./lib/users/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {strategy: "jwt"},
  pages: {
    signIn: "/login-signup",
  },
  providers: [
    Credentials({
      credentials:{
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials);

        if(!validatedFields.success){
          return null;
        }

        const {email, password} = validatedFields.data;
        const user = await prisma.user.findUnique({
          where: {email}
        })

        if(!user || !user.password) {
          throw new Error("No user found");
        }

        const passwordMatch = compareSync(password, user.password);

        if(!passwordMatch) return null;
        return user;
      },
    }),
  ],
  // callback
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const ProtectedRoutes = ["/dashboard", "/logout"];

      if (!isLoggedIn && ProtectedRoutes.includes(nextUrl.pathname)) {
        return Response.redirect(new URL("/", nextUrl));
      }

      // if(isLoggedIn && nextUrl.pathname.startsWith("/")){
      //   return Response.redirect(new URL("/dashboard", nextUrl));
      // }

      if (isLoggedIn && nextUrl.pathname.startsWith("/login-signup")) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.role = user.role;
        token.image = user.image;
      } else {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { username: true, role: true, image: true },
        });
        if (dbUser) {
          token.username = dbUser.username;
          token.role = dbUser.role;
          token.image = dbUser.image;
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.username = token.username || session.user.username;
      session.user.image = token.image;
      return session;
    },
  },
});

// export const runtime = "nodejs";
