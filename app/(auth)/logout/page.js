import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import LogoutContent from "./LogoutContent";

export default async function LogOut() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return <LogoutContent />;
}
