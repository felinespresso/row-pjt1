import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TabelPembayaran from "../pembayaran";
import { AlertProvider } from "@/app/_contexts/AlertContext";

export default async function page() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (  
    <AlertProvider>
      <div className="max-h-full min-h-screen bg-gray-200">
        <TabelPembayaran session={session}/>
      </div>
    </AlertProvider>
  );
}
