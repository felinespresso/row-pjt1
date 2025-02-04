// "use client";
import { auth } from "@/auth";
import HoverHandler from "./script";
import NavSidebar from "../_components/sidebar";
import "./globals.css";
import { redirect } from "next/navigation";

export default async function MenuLayout({ children }) {
  const session = await auth();
  console.log("Session:", session);
  if (!session) {
    redirect("/");
  }

  return (
    <div className="wrapper hover_collapse">
       <HoverHandler />
       <NavSidebar session={session} />
      <div className="max-h-full min-h-screen px-10 bg-gray-200 main_container">
        {children}
      </div>
    </div>
  );
}
