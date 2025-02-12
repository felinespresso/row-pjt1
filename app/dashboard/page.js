import Navbar from "../_components/navbar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Dashboard } from "./dashboard";
import { AlertProvider } from "@/app/_contexts/AlertContext";

export default async function DashBoard() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (  
    <AlertProvider>
      <div className="max-h-full min-h-screen bg-gray-200">
        <Navbar session={session} />
        <Dashboard session={session}/>
      </div>
    </AlertProvider>
  );
}
