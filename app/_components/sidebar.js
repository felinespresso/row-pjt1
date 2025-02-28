"use client";
import { usePathname, useRouter } from "next/navigation";
<<<<<<< HEAD
import { useEffect, useState, useRef } from "react";
=======
import { useEffect, useState } from "react";
>>>>>>> 186443b (oiia)
import Link from "next/link";
import Image from "next/image";
import {
  FaSearch,
  FaArrowRight,
  FaFolderOpen,
  FaFileInvoiceDollar,
  FaPen,
  FaFileAlt,
} from "react-icons/fa";
import {
  MdEditDocument,
  MdGroups,
  MdLogout,
  MdGroupAdd,
  MdLocalAtm,
  MdPlagiarism,
  MdHome,
} from "react-icons/md";
// import { library } from "@fortawesome/fontawesome-svg-core";
// import { faFileCircleCheck } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// library.add(faFileCircleCheck);
import { useProject } from "../_context/ProjectContext";
import AddAdminsModal from "./admin";

export default function NavSidebar({ session }) {
  const pathname = usePathname();
  const { projectId } = useProject();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const buttonRef = useRef(null);

  // useEffect(() => {
  //   const segments = pathname.split("/");
  //   const idFromUrl = segments.length > 2 ? segments[2] : null;
  //   setProjectId(idFromUrl);
  //   console.log("Detected Project ID:", idFromUrl); // Debugging projectId
  // }, [pathname]);

  return (
    <>
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
      <nav className="flex fixed top-0 items-center p-2 bg-white shadow-lg font-montserrat left-[300px] right-0 z-10 ">
        <div className="flex items-center justify-between w-full px-6">
          <div className="flex items-center">
            <Image
              src="/surveyor.png"
              alt="Logo PT Surveyor Indonesia"
              width={65}
              height={65}
            ></Image>
            <div className="ml-2">
              <h5 className="text-base font-bold text-color7">
                Aplikasi SIROW
              </h5>
              <p className="text-sm font-semibold text-color7">Right of Way</p>
            </div>
          </div>
          <div className="flex items-center">
            {session.user.role === "admin" && (
              <div className="relative">
                <button
                  ref={buttonRef}
                  title="Add Admin"
                  onClick={() => setIsModalOpen((prev) => !prev)}
                  className={`relative flex items-center justify-center p-2 mr-2 rounded-full hover:bg-gray-100
                                ${
                                  isModalOpen
                                    ? "bg-gray-200"
                                    : "focus:bg-gray-200"
                                } focus:outline-none`}
                >
                  <MdGroupAdd className="text-[35px] text-gray-400" />
                </button>
                {isModalOpen && (
                  <AddAdminsModal
                    onClose={() => setIsModalOpen(false)}
                    buttonRef={buttonRef}
                  />
                )}
              </div>
            )}
            <div className="flex items-center px-2 py-[2px] bg-gray-300 rounded-full w-80 mx-8">
              <FaSearch className="m-2 text-base text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                className="flex-1 ml-1 text-sm font-medium placeholder-gray-500 bg-gray-300 outline-none"
              />
            </div>
            <button>
              <Link href="/dashboard" className="mx-3">
                <FaArrowRight className="mr-6 text-base text-gray-500" />
              </Link>
            </button>
          </div>
        </div>
      </nav>
      <nav className="sidebar">
        <div className="sidebar_inner">
          {session && (
            <div className="profile justify-center h-[165px] py-2 text-white bg-color5">
              <Link href="/profile">
                <FaPen className="mt-1 text-lg transition-transform duration-200 justify-self-end hover:scale-110 filter hover:drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] icon mx-4 text-white" />
              </Link>
              <Image
                src={session.user.image || "/avatar.png"}
                alt="My Icon"
                width={60}
                height={60}
                className={`my-3 rounded-full justify-self-center photo ${
                  pathname.startsWith("/profile")
                    ? "border-2 rounded-full border-color8"
                    : ""
                }`}
              />
              <p className="mt-2 text-[17px] font-semibold text-center">
                {session.user.username || session.user.name || "User"}
              </p>
            </div>
          )}
          <ul className="uppercase">
            <li>
              <Link
                href={projectId ? `/home/${projectId}` : "#"}
                className={`flex items-center px-3 py-2 text-white border-b transition duration-200 ease-in-out border-color5 hover:bg-color8 ${
                  pathname.startsWith("/home") ? "bg-color8" : ""
                }`}
              >
                <MdHome className="mx-4 text-3xl align-middle" />
                <span className="flex-1 mt-1 text-base font-bold">Home</span>
              </Link>
            </li>
            <li>
              <Link
                href={projectId ? `/identifikasi-awal/${projectId}` : "#"}
                className={`flex items-center px-3 py-2 text-white border-b transition duration-200 ease-in-out border-color5 hover:bg-color8 ${
                  pathname.startsWith("/identifikasi-awal") ? "bg-color8" : ""
                }`}
              >
                <MdPlagiarism className="mx-4 text-3xl align-middle" />
                <span className="flex-1 mt-1 text-base font-bold">
                  Identifikasi
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={projectId ? `/sosialisasi/${projectId}` : "#"}
                className={`flex items-center px-3 py-2 text-white border-b transition duration-200 ease-in-out border-color5 hover:bg-color8 ${
                  pathname.startsWith("/sosialisasi") ? "bg-color8" : ""
                }`}
              >
                <MdGroups className="mx-4 text-3xl align-middle" />
                <span className="flex-1 mt-1 text-base font-bold">
                  Sosialisasi
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={projectId ? `/inventarisasi/${projectId}` : "#"}
                className={`flex items-center px-3 py-2 text-white border-b transition duration-200 ease-in-out border-color5 hover:bg-color8 ${
                  pathname.startsWith("/inventarisasi") ? "bg-color8" : ""
                }`}
              >
                <Image
                  src="/Plant.svg"
                  alt="My Icon"
                  width={30}
                  height={30}
                  className="mx-4 text-3xl align-middle"
                />
                <span className="flex-1 mt-1 text-base font-bold">
                  Inventarisasi
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={
                  projectId
                    ? `/pengumuman-hasil-inventarisasi/${projectId}`
                    : "#"
                }
                className={`flex items-center px-3 py-2 text-white border-b transition duration-200 ease-in-out border-color5 hover:bg-color8 ${
                  pathname.startsWith("/pengumuman-hasil-inventarisasi")
                    ? "bg-color8"
                    : ""
                }`}
              >
                <Image
                  src="/document-checkmark.svg"
                  alt="My Icon"
                  width={30}
                  height={30}
                  className="mx-4 text-3xl align-middle"
                />
                <div className="flex flex-col leading-none text-left">
                  <span className="p-0 m-0 text-base font-bold leading-none">
                    Pengumuman
                  </span>
                  <div className="flex m-[-1px] transition duration-75">
                    <span className="text-base font-bold leading-none">
                      Hasil
                    </span>
                    <span className="ml-1 text-base font-bold leading-none">
                      Inventarisasi
                    </span>
                  </div>
                </div>
              </Link>
            </li>
            <li>
              <Link
                href={projectId ? `/musyawarah/${projectId}` : "#"}
                className={`flex items-center px-3 py-2 text-white border-b transition duration-200 ease-in-out border-color5 hover:bg-color8 ${
                  pathname.startsWith("/musyawarah") ? "bg-color8" : ""
                }`}
              >
                <Image
                  src="/People Working Together.svg"
                  alt="My Icon"
                  width={30}
                  height={30}
                  className="mx-4 text-3xl align-middle"
                />
                <span className="flex-1 mt-1 text-base font-bold">
                  Musyawarah
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={projectId ? `/pemberkasan/${projectId}` : "#"}
                className={`flex items-center px-3 py-2 text-white border-b transition duration-200 ease-in-out border-color5 hover:bg-color8 ${
                  pathname.startsWith("/pemberkasan") ? "bg-color8" : ""
                }`}
              >
                <FaFolderOpen className="mx-4 text-3xl align-middle" />
                <span className="flex-1 mt-1 text-base font-bold">
                  Pemberkasan
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={projectId ? `/pembayaran/${projectId}` : "#"}
                className={`flex items-center px-3 py-2 text-white border-b transition duration-200 ease-in-out border-color5 hover:bg-color8 ${
                  pathname.startsWith("/pembayaran") ? "bg-color8" : ""
                }`}
              >
                <FaFileInvoiceDollar className="mx-4 text-3xl align-middle" />
                <span className="flex-1 mt-1 text-base font-bold">
                  Pembayaran
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={projectId ? `/penebangan/${projectId}` : "#"}
                className={`flex items-center px-3 py-2 text-white border-b transition duration-200 ease-in-out border-color5 hover:bg-color8 ${
                  pathname.startsWith("/penebangan") ? "bg-color8" : ""
                }`}
              >
                <Image
                  src="/Tree.svg"
                  alt="My Icon"
                  width={30}
                  height={30}
                  className="mx-4 text-3xl align-middle"
                />
                <span className="flex-1 mt-1 text-base font-bold">
                  Penebangan
                </span>
              </Link>
            </li>
            <li className="absolute bottom-0 w-full transition-all duration-200 ease-in border-t border-color5">
              <Link
                href="/logout"
                className={`flex items-center px-3 py-2 text-white transition duration-200 ease-in-out hover:bg-color8 ${
                  pathname.startsWith("/logout") ? "bg-color8" : ""
                }`}
              >
                <MdLogout className="mx-4 text-3xl align-middle" />
                <span className="flex-1 mt-1 text-base font-bold whitespace-nowrap">
                  Sign Out
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
