"use client";

import { BsPencilSquare } from "react-icons/bs";
import Image from "next/image";
import React, { useRef, useState, useTransition, useActionState } from "react";
import {
  uploadProfilePicture,
  removeProfilePicture,
  updateUserProfile,
} from "@/lib/users/actions";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import "./globals.css";
import { redirect, useRouter } from "next/navigation";

const Profile = ({ session }: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(session.user.username);
  const [password, setPassword] = useState("");
  const [initialUsername, setInitialUsername] = useState(session.user.username);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [imageUrl, setImageUrl] = useState(session.user.image || "/avatar.png");
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setIsPasswordChanged(false);
    setInitialUsername(username);
  };

  const handleCancel = () => {
    setUsername(initialUsername);
    setPassword("");
    setIsPasswordChanged(false);
    setIsEditing(false);
  };

  const handleSave = async () => {
    startTransition(async () => {
      const updateData: { username: string; password?: string } = { username };
      if (isPasswordChanged) {
        updateData.password = password;
      }
      const result = await updateUserProfile(session.user.id, updateData);
      if (result.success) {
        router.refresh();
        setIsEditing(false);
      } else {
        alert(`Failed to edit user profile: ${result.error}`);
      }
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    if (name === "password") {
      setPassword(value);
      setIsPasswordChanged(true);
    }
  };

  const handleOutsideClick = (e: any) => {
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

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    startTransition(async () => {
      const result = await uploadProfilePicture(null, formData);
      if (result.success) {
        setImageUrl(result.imageUrl);
        setIsMenuOpen(false);
        router.refresh();
      } else {
        alert(`Failed to upload new profile picture: ${result.error}`);
      }
      setIsUploading(false);
    });
  };

  const handleRemovePhoto = async () => {
    setIsRemoving(true);
    startTransition(async () => {
      const result = await removeProfilePicture(session.user.id);
      if (result.success) {
        setImageUrl("/avatar.jpg");
        setIsMenuOpen(false);
        router.refresh();
      } else {
        alert(`Failed to remove profile picture: ${result.error}`);
      }
      setIsRemoving(false);
    });
  };

  return (
    <div>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet"
      />
      <main className="p-12 font-montserrat">
        <div className="h-full px-8 bg-white rounded-lg shadow-lg mx-7 py-7">
          <h1 className="flex items-center text-xl font-bold text-gray-800">
            {isEditing ? "Edit Profile" : "Profile"}
          </h1>
          <div className="flex items-center gap-10 ">
            <div className="relative flex flex-col items-center w-1/2 px-6 pb-20 border-r-2 border-r-gray-300">
              <p className="mb-10 text-xl font-semibold text-center mt-14">
                Profile Picture
              </p>
              <Image
                src={imageUrl}
                alt="Profile Picture"
                width={250}
                height={250}
                className="object-cover rounded-full aspect-square"
              />
              <button
                ref={buttonRef}
                onClick={toggleMenu}
                title="upload & remove photo"
                className={`absolute bottom-0 w-12 h-12 mb-20 items-center rounded-full left-[187px] bg-color3 hover:shadow-custom
                            ${
                              isMenuOpen
                                ? "bg-color8 shadow-custom"
                                : "bg-color3 focus:bg-color8"
                            }`}
              >
                <Image
                  src="image-edit.svg"
                  alt=""
                  width={30}
                  height={30}
                  className="self-center ml-[9px] text-white"
                />
              </button>
              {isMenuOpen && (
                <div className="absolute w-48 mt-2 transform -translate-x-1/2 bg-white rounded-md shadow-xl top-96 ring-1 ring-color3 left-64">
                  <ul className="py-1">
                    <li
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex items-center px-4 py-1 border-b border-b-gray-300 cursor-pointer hover:border-b-color3 hover:text-white text-color3 hover:bg-color3 hover:opacity-80 focus:bg-color3 focus:text-white focus:opacity-80 ${
                        isUploading &&
                        "bg-color3 text-white border-b-color3 opacity-80"
                      }`}
                    >
                      <span className="text-base">
                        {isUploading ? "Uploading..." : "Upload new photo"}{" "}
                      </span>
                    </li>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <li
                      onClick={handleRemovePhoto}
                      className={`flex items-center px-4 py-1 border-t border-t-gray-300 cursor-pointer hover:border-t-color3 hover:text-white text-color3 hover:bg-color3 hover:opacity-80 focus:bg-color3 focus:text-white focus:opacity-80 ${
                        isRemoving &&
                        "bg-color3 text-white border-t-color3 opacity-80"
                      }`}
                    >
                      <span className="text-base" id="open">
                        {isRemoving ? "Removing..." : "Remove a photo"}
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="w-1/2 ml-6 mr-12">
              {/* Email Input */}
              <div className="mb-6">
                <label className="block mb-1 font-semibold">Email :</label>
                <input
                  type="email"
                  name="email"
                  value={session.user.email}
                  className="w-full px-4 py-2 font-medium text-gray-500 bg-gray-200 border border-gray-500 rounded-md focus:outline-none"
                  readOnly
                />
              </div>

              {/* Username Input */}
              <div className="mb-6">
                <label className="block mb-1 font-semibold">Username :</label>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={handleChange}
                  placeholder="Input new username"
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2 font-medium border rounded-md focus:outline-none placeholder:font-normal ${
                    isEditing
                      ? "border-blue-500 border-2 focus:ring-blue-500 focus:ring-1 bg-gray-100 text-gray-700"
                      : "bg-gray-200 border-gray-500 text-gray-500"
                  }`}
                />
              </div>

              {/* Password Input */}
              <div className="mb-6">
                <label className="block mb-1 font-semibold">Password :</label>
                <input
                  type="password"
                  name="password"
                  value={
                    isEditing ? (isPasswordChanged ? password : "") : "********"
                  }
                  onChange={handleChange}
                  placeholder="Input new password"
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none placeholder:font-normal ${
                    isEditing
                      ? "border-blue-500 border-2 focus:ring-blue-500 focus:ring-1 bg-gray-100 text-gray-700"
                      : "bg-gray-200 border-gray-500 text-gray-500 font-bold"
                  }`}
                />
              </div>
              <div className="flex flex-row gap-6 mt-14">
                <button
                  onClick={isEditing ? handleCancel : handleEdit}
                  className="flex flex-row gap-2 px-4 py-2 font-medium transition duration-300 border-2 rounded-xl text-color3 border-color3 hover:bg-color3 hover:text-white"
                >
                  {!isEditing ? (
                    <MdOutlineDriveFileRenameOutline className="text-2xl" />
                  ) : null}
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
                {isEditing && (
                  <button
                    type="submit"
                    onClick={handleSave}
                    className="flex flex-row px-6 py-2 font-medium text-white transition duration-300 border-2 rounded-xl bg-color3 hover:bg-color8 border-color3 hover:shadow-xl"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
