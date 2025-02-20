"use client";
// import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import { FaSearch, FaEllipsisV } from "react-icons/fa";
import { MdLogout, MdAccountCircle, MdGroupAdd } from "react-icons/md";
import React, { useRef, useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Pastikan NextAuth digunakan

export default function Navbar({ session }) {
  // const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (!e.target.closest(".relative")) {
      setIsMenuOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => {
      if (prev && buttonRef.current) {
        buttonRef.current.blur();
      }
      return !prev;
    });
  };

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
      <nav className="fixed top-0 z-50 flex items-center w-full p-2 bg-white shadow-lg font-montserrat">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Link href="/dashboard" className="mx-3">
              <Image
                src="/surveyor.png"
                alt="Logo PT Surveyor Indonesia"
                width={65}
                height={65}
              ></Image>
            </Link>
            <div className="ml-2">
              <h5 className="text-base font-bold text-color7">
                Aplikasi SIROW
              </h5>
              <p className="text-sm font-semibold text-color7">Right of Way</p>
            </div>
          </div>
          <div className="flex items-center">
            {session.user.role === "admin" ? (
              <button
                title="Add Admin"
                className="relative flex items-center justify-center p-2 mr-2 rounded-full hover:bg-gray-100 focus:bg-gray-200 focus:bg-opacity-85 focus:outline-none"
              >
                <MdGroupAdd className="text-[35px] text-gray-400" />
              </button>
            ) : null}
            <div className="flex items-center px-2 py-[2px] bg-gray-300 rounded-full w-80 mx-4">
              <FaSearch className="m-2 text-base text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                className="flex-1 ml-1 text-sm font-medium placeholder-gray-500 bg-gray-300 outline-none"
              />
            </div>
            <div className="relative ">
              <button
                ref={buttonRef}
                title="Profile and Logout"
                className="relative flex items-center justify-center p-3 rounded-full hover:bg-gray-100 focus:bg-gray-200 focus:bg-opacity-85 focus:outline-none"
                onClick={toggleMenu}
              >
                <FaEllipsisV className="text-lg text-gray-400" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 w-48 bg-white rounded-md shadow-xl mt-[14px] ring-1 ring-black ring-opacity-5">
                  <ul className="py-1">
                    <Link href="">
                      <li
                        className="flex items-center px-4 py-2 text-gray-500 hover:text-white hover:bg-color3 hover:opacity-80 focus:bg-color3 focus:text-white focus:opacity-80"
                        tabIndex=""
                      >
                        <MdAccountCircle className="mr-3 text-2xl" />
                        <span className="text-base">Profile</span>
                      </li>
                    </Link>
                    <Link href="/logout">
                      <li
                        className="flex items-center px-4 py-2 text-gray-500 cursor-pointer hover:text-white hover:bg-color3 hover:opacity-80 focus:bg-color3 focus:text-white focus:opacity-80"
                        tabIndex="0"
                      >
                        <MdLogout className="mr-3 text-2xl" />
                        <span className="text-base" id="open">
                          Logout
                        </span>
                      </li>
                    </Link>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
