"use client";
import { MdExitToApp } from "react-icons/md";
import { FaRunning } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function LogoutContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut({
        redirect: false,
        callbackUrl: "/",
      });
      router.push("/login-signup");
    } catch (error) {
      console.error("Logout error:", error.message || error);
      alert('Sign Out gagal, mohon coba lagi"');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300 font-montserrat">
      <div className="p-6 bg-white rounded-lg w-96 ring-2 ring-gray-700 ring-opacity-5">
        <div className="flex items-center justify-center gap-1">
          <FaRunning className="text-color3" style={{ fontSize: "86px" }} />
          <MdExitToApp className="text-red-500 text-8xl" />
        </div>
        <p className="mt-4 text-lg font-bold text-center text-black">
          Sign Out?
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="px-8 py-1 text-white transition-transform duration-300 rounded-lg bg-color3 hover:bg-blue-800 hover:scale-105"
          >
            {isLoading ? "Signing Out..." : "Ya"}
          </button>
          <button
            className="px-5 py-1 text-red-500 border-red-500 rounded-lg border-[3px] hover:bg-red-500 hover:text-white hover:scale-105 transition-transform duration-300"
            onClick={() => router.back()}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
