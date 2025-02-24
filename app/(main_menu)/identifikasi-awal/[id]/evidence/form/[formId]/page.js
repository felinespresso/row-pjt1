import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FormEvidence from "./form";
import Link from "next/link";
import { AlertProvider } from "@/app/_contexts/AlertContext";

export default async function page(params, searchParams) {
  const session = await auth();
  const { id } = params;

  if (!session) {
    redirect("/");
  }

  return (
    <AlertProvider>
      <div className="max-h-full min-h-screen bg-gray-200">
        <FormEvidence session={session} />
      </div>
    </AlertProvider>
  );
}
