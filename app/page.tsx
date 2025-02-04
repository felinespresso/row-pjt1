"use client";

// import "@/app/globals.css";
// import Dashboard from "./dashboard/page";
import Login_SignUp from "./(auth)/login-signup/page";

export default function Home() {
  return (
    <section>
      <div>
        <Login_SignUp />
      </div>
    </section>
  );
}
