"use client";

import { AlertProvider } from "@/app/_contexts/AlertContext";

export default function ClientLayout({ children }) {
  return <AlertProvider>{children}</AlertProvider>;
} 