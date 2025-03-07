import { auth } from "@/auth";
import Profile from "./profile";
import Navbar from "../_components/navbar";

const profilPage = async() => {
  const session = await auth();
  // const user = await prisma.user.findUnique({
  //   where: {
  //     email: session.user.email,
  //   }
  // });

  return (
    <div className="max-h-full min-h-screen bg-gray-200">
      <Navbar session={session}/>
      <Profile session={session}/>
    </div>
    
  )
}

export default profilPage;