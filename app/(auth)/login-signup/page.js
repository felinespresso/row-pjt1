"use client";
// import { Html, Head, Main, NextScript } from 'next/document';
// import { useRouter } from "next/navigation";
import Image from "next/image";
import "./globals.css";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaArrowLeft,
  FaInfoCircle,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import { MdVisibility, MdVisibilityOff, MdVpnKey } from "react-icons/md";
import React, { useEffect, useActionState, useState } from "react";
import { signUpCredentials, signInCredentials } from "@/lib/actions";
import { SignupButton, LoginButton } from "@/app/_components/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Login_SignUp() {
  const [signUpState, signUpAction] = useActionState(signUpCredentials, null);
  const [signInState, signInAction] = useActionState(signInCredentials, null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (signUpState?.success) {
      setShowPopup(true);
    }
  }, [signUpState]);

  useEffect(() => {
    const container = document.getElementById("container");
    const registerLink = document.getElementById("sign-up");
    const loginLink = document.getElementById("login");
    const forgotPassword = document.getElementById("forgotyourpassword");
    const toLogin = document.getElementById("back-login");
    // const signIn = document.getElementById("log-in");

    registerLink.addEventListener("click", () => {
      container.classList.add("active");
    });
    loginLink.addEventListener("click", () => {
      container.classList.remove("active");
    });

    forgotPassword.addEventListener("click", () => {
      container.classList.add("action");
    });
    toLogin.addEventListener("click", () => {
      container.classList.remove("action");
    });

    // registerLink.addEventListener('click', () => {
    //   container.classList.add("back");
    // });
    // signIn.addEventListener('click', () => {
    //   container.classList.remove("back");
    // });
  }, []);

  return (
    <div>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet"
      />
      <main className="flex flex-col items-center justify-center h-screen bg-color1 font-montserrat">
        <div className="container max-h-screen overflow-y-auto" id="container">
          <div className="form-container login">
            <form
              action={signInAction}
              className="flex flex-col items-center h-full px-10 py-8 rounded-lg bg-color3"
            >
              <h1 className="text-3xl font-bold text-center text-white">
                WELCOME TO APLIKASI SIROW
              </h1>
              <div className="w-24 my-2 border-2 border-white rounded "></div>
              <h2 className="mt-1 text-2xl font-bold text-center text-white">
                LOGIN
              </h2>
              {signInState?.message ? (
                <div
                  className="flex text-sm text-red-500 bg-red-200 rounded-lg w-full max-w-[364px] py-2 mt-2"
                  role="alert"
                >
                  <FaInfoCircle className="self-center mx-4 text-xl text-red-400 opacity-85" />
                  <span className="font-medium text-center">
                    {signInState?.message}
                  </span>
                </div>
              ) : null}
              <div className="flex items-center px-2 py-[2px] bg-gray-100 rounded-full w-full max-w-[364px] mt-6">
                <FaEnvelope className="m-2 text-sm text-color5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Input your email address"
                  className="flex-1 w-0 min-w-0 text-sm bg-gray-100 outline-none placeholder-color5"
                />
              </div>
              <div
                aria-live="polite"
                aria-atomic="true"
                className="self-start pl-4"
              >
                <span className="text-[12px] leading-tight text-justify text-red-400">
                  {signInState?.error?.email}
                </span>
              </div>
              <div className="flex items-center px-2 py-[2px] bg-gray-100 rounded-full w-full max-w-[364px] mt-6">
                <FaLock className="m-2 text-sm text-color5" />
                <input
                  type="password"
                  name="password"
                  placeholder="Input your password"
                  className="flex-1 w-0 min-w-0 text-sm bg-gray-100 outline-none placeholder-color5"
                />
              </div>
              <div
                aria-live="polite"
                aria-atomic="true"
                className="self-start pl-4"
              >
                <span className="leading-tight text-justify text-red-400 text-[12px]">
                  {signInState?.error?.password}
                </span>
              </div>
              <a
                href="#"
                className="self-end mt-3 mr-3 text-xs font-bold text-right cursor-pointer text-color4 active:text-shadow-custom"
                id="forgotyourpassword"
              >
                Forgot your password?
              </a>
              <LoginButton />
              <span className="text-xs text-white">
                Don't have an account?
                <a
                  className="font-bold cursor-pointer text-color4 active:text-shadow-custom"
                  id="sign-up"
                >
                  {" "}
                  Sign up here
                </a>
              </span>
            </form>
          </div>
          <div className="form-container forgot-password">
            <form className="flex flex-col h-full px-10 py-8 rounded-tl-lg rounded-bl-lg bg-color3">
              <h1 className="mt-8 mb-2 text-2xl font-bold text-left text-white">
                Forgot your password?
              </h1>
              <p className="mb-12 text-sm text-white opacity-70">
                Please input your email to reset your password.
              </p>
              <p className="mb-2 ml-3 text-base font-semibold text-white">
                Email
              </p>
              <div className="flex items-center px-2 py-[2px] bg-gray-100 rounded-full w-full max-w-[364px]">
                <FaEnvelope className="m-2 text-sm text-color5" />
                <input
                  type="email"
                  placeholder="Input your email address"
                  className="flex-1 w-0 min-w-0 text-sm bg-gray-100 outline-none placeholder-color5"
                />
              </div>
              <button className="py-2 font-bold text-white border border-transparent rounded-full bg-color2 tracking-[0.5px] cursor-pointer w-full max-w-[364px] text-sm mt-11 hover:bg-color6 transition duration-200 ease-in-out hover:shadow-custom">
                Submit
              </button>
              <div className="flex items-center justify-center my-4 text-color4 hover:text-white hover:text-shadow-lg">
                <FaArrowLeft className="m-2" />
                <a
                  href="#"
                  className="text-base font-bold cursor-pointer"
                  id="back-login"
                >
                  Back to Login Page
                </a>
              </div>
            </form>
          </div>
          <div className="form-container sign-up">
            <form
              action={signUpAction}
              className="flex flex-col items-center justify-center h-full px-10 py-0 rounded-tr-lg rounded-br-lg bg-color3"
            >
              <h1 className="mt-1 mb-6 text-2xl font-bold text-center text-white">
                SIGN UP
              </h1>
              {signUpState?.message ? (
                <div
                  className="flex mb-4 text-sm text-red-500 bg-red-200 rounded-lg w-full max-w-[364px] py-2"
                  role="alert"
                >
                  <FaInfoCircle className="self-center mx-5 text-lg text-red-400 opacity-85" />
                  <span className="font-medium">{signUpState?.message}</span>
                </div>
              ) : null}
              <div className="flex items-center px-2 py-[2px] bg-gray-100 rounded-full w-full max-w-[364px]">
                <FaEnvelope className="m-2 text-sm text-color5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Input your email address"
                  className="flex-1 w-0 min-w-0 text-sm bg-gray-100 outline-none placeholder-color5"
                />
              </div>
              <div
                aria-live="polite"
                aria-atomic="true"
                className="self-start pl-4"
              >
                <span className="text-[12px] leading-tight text-justify text-red-400">
                  {signUpState?.error?.email}
                </span>
              </div>
              <div className="flex items-center px-2 py-[2px] bg-gray-100 rounded-full w-full max-w-[364px] mt-4">
                <FaUser className="m-2 text-sm text-color5" />
                <input
                  type="text"
                  name="username"
                  placeholder="Create your username"
                  className="flex-1 w-0 min-w-0 text-sm bg-gray-100 outline-none placeholder-color5"
                />
              </div>
              <div
                aria-live="polite"
                aria-atomic="true"
                className="self-start pl-4"
              >
                <span className="text-[12px] leading-tight text-justify text-red-400">
                  {signUpState?.error?.username}
                </span>
              </div>
              <div className="flex items-center px-2 py-[2px] bg-gray-100 rounded-full w-full max-w-[364px] mt-4">
                <FaLock className="m-2 text-sm text-color5" />
                <input
                  type="password"
                  name="password"
                  placeholder="Set a password"
                  className="flex-1 w-0 min-w-0 text-sm bg-gray-100 outline-none placeholder-color5"
                />
              </div>
              <div
                aria-live="polite"
                aria-atomic="true"
                className="self-start pl-4"
              >
                <span className="leading-tight text-justify text-red-400 text-[12px]">
                  {signUpState?.error?.password}
                </span>
              </div>
              <div className="flex items-center px-2 py-[2px] bg-gray-100 rounded-full w-full max-w-[364px] mt-4">
                <MdVpnKey className="m-2 text-sm text-color5" />
                <input
                  type="password"
                  name="confirmpassword"
                  placeholder="Re-enter password"
                  className="flex-1 w-0 min-w-0 text-sm bg-gray-100 outline-none placeholder-color5"
                />
              </div>
              <div
                aria-live="polite"
                aria-atomic="true"
                className="self-start pl-4"
              >
                <span className="text-[12px] leading-tight text-justify text-red-400">
                  {signUpState?.error?.confirmpassword}
                </span>
              </div>
              <SignupButton />
              <span className="text-xs text-white">
                Already have an account?
                <a
                  className="font-bold cursor-pointer text-color4 active:text-shadow-custom active:text-white"
                  id="login"
                >
                  {" "}
                  Login here
                </a>
              </span>
            </form>
          </div>
          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
                <Image
                  src="/logo-id-survey.png"
                  alt="Logo ID Survey"
                  width={130}
                  height={120}
                  className="flex-row flex-shrink-0"
                />
                <Image
                  src="/surveyor.png"
                  alt="Logo PT Surveyor Indonesia"
                  width={65}
                  height={65}
                  className="flex-row flex-shrink-0"
                />
                <div className="absolute flex items-center justify-center h-full px-10">
                  <Image
                    src="/design_picture.png"
                    alt="Gambar Desain"
                    width={320}
                    height={200}
                    className="flex-shrink-0"
                  />
                </div>
              </div>
              {/* <div className="toggle-panel toggle-right"> 
                  <Image src="/logo-id-survey.png" alt="Logo ID Survey" width={50} height={50} /> 
                  <Image src="/Logo_PT_Surveyor.png" alt="Logo PT Surveyor Indonesia" width={50} height={50}/> 
                  <Image src="/design_picture.png" alt="Gambar Desain" width={50} height={50}/> 
                </div> */}
            </div>
          </div>
        </div>
      </main>

      {showPopup && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setShowPopup(false)}
        >
          {/* Card yang dianimasikan secara terpisah */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative p-10 text-center bg-white rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Mencegah klik luar menutup pop-up
          >
            {/* Tombol close "X" */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPopup(false)}
            >
              <FaTimes className="text-2xl" />
            </button>

            {/* Ikon centang */}
            <div className="flex items-center justify-center">
              <FaCheckCircle className="text-blue-500 text-7xl" />
            </div>

            {/* Pesan pop-up */}
            <h2 className="mt-4 text-xl font-bold text-gray-700">
              Sign up berhasil!
            </h2>
            <p className="mt-6 mb-2 text-gray-700">
              Akun Anda telah berhasil dibuat.
              <br />
              Email verifikasi telah terkirim, <br />
              silakan periksa email Anda!
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
