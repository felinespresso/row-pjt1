import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TabelPenebangan from "./penebangan";
import { AlertProvider } from "@/app/_contexts/AlertContext";

export default async function page() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (  
    <AlertProvider>
      <div className="max-h-full min-h-screen bg-gray-200">
        <TabelPenebangan session={session}/>
      </div>
    </AlertProvider>
  );
}
