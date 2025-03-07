import { auth } from "@/auth";
import HoverHandler from "./script";
import NavSidebar from "../_components/sidebar";
import ClientLayout from "./_components/ClientLayout";
import "./globals.css";
import { redirect } from "next/navigation";

export default async function MenuLayout({ children, modal }) {
  const session = await auth();
  console.log("Session:", session);
  if (!session) {
    redirect("/");
  }

  return (
      <ClientLayout>
        <div className="wrapper hover_collapse"> 
            <HoverHandler/> 
            <NavSidebar session={session}/> 
            <div className="max-h-full min-h-screen pl-[330px] bg-gray-200 main_container pr-8 transition-[padding] duration-200 ease-in-out"> 
                { children } 
            </div> 
            { modal } 
        </div> 
      </ClientLayout>
  );
}
