import { auth } from "@/auth";
import Profile from "./profile";

const profilPage = async() => {
  const session = await auth();
  // const user = await prisma.user.findUnique({
  //   where: {
  //     email: session.user.email,
  //   }
  // });

  return (
    <Profile session={session}/>
  )
}

export default profilPage;