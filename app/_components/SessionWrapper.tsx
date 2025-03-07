'use client';

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import Card from "./card";

export default function SessionWrapper({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
} 