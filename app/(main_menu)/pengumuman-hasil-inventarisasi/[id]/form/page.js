import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AlertProvider } from "@/app/_contexts/AlertContext";
import FormPengumuman from "./form";
import Link from "next/link";

export default async function page() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <AlertProvider>
      <div className="max-h-full min-h-screen bg-gray-200">
        <FormPengumuman session={session} />
      </div>
    </AlertProvider>
  );
}
