import Navbar from "../_components/navbar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Dashboard } from "./dashboard";

export default async function DashBoard() {
    const session = await auth();

    if (!session){
        redirect("/")
    }

    return (
        <div className="max-h-full min-h-screen bg-gray-200">
            <Navbar session={session}/>
            <Dashboard/>
        </div>
    )
}