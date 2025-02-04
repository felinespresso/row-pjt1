"use client";

import styles from "./profilePage.module.css";
<link
  href="https://fonts.googleapis.com/css?family=Montserrat"
  rel="stylesheet"
/>;
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userAgent } from "next/server";

export default function Profile() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(
    "/images/foto_orang.png"
  ); // Default profile picture

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePicture(event.target.result); // Update profile picture preview
      };
      reader.readAsDataURL(file);
    }
  };

  const [formData, setFormData] = useState({
    username: "Raden Patih Cipto Mangunkusumo",
    email: "user@gmail.com",
    password: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);
  const handleSave = () => {
    setIsEditing(false);
    console.log("Data saved:", formData);
  };

  const router = useRouter();

  const navigateToPage = (path) => {
    router.push(path);
  };

  return (
    <div className={styles.pf_base}>
      <div className={styles.pf_base_content}>
        <div className={styles.container}>
          <form>
            {/* Username */}
            <div className={styles.inputGroup}>
              <label>Username :</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
                className={`${styles.input} ${
                  !isEditing ? styles.disabled : ""
                }`}
              />
                        
            </div>

            {/* Email */}
            <div className={styles.inputGroup}>
              <label>Email :</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className={`${styles.input} ${styles.disabled}`}
              />
            </div>

            {/* Password */}
            <div className={styles.inputGroup}>
              <label>Password :</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={!isEditing}
                className={`${styles.input} ${
                  !isEditing ? styles.disabled : ""
                }`}
              />
            </div>

            {/* Buttons */}
            <div className={styles.buttonGroup}>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleEdit}
                  className={styles.editButton}
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className={styles.saveButton}
                  >
                    Save
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        <h1 className={styles.pf_word}>Profile</h1>
        <h1 className={styles.pf_word2}>Profile Picture</h1>
        <img className={styles.foto_orang} src={profilePicture} alt="Profile" />
        <img className={styles.garis_pf} src="/images/garis.jpg" />
        <button className={styles.edit_button} onClick={toggleMenu}>
          <img
            className={styles.edit_img}
            src="/images/pf_edit.png"
            alt="Edit"
          />
        </button>

        {isMenuVisible && (
          <div className="absolute mt-[375px] ml-[125px] bg-white border border-[#2D3CE8] rounded shadow-lg w-[150px]">
            <label className="w-40 text-blue-700 text-left px-4 py-[3px] hover:bg-gray-100 cursor-pointer">
              Upload a photo
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </label>
            <button
              className="w-full text-blue-700 text-left px-4 py-1 hover:bg-gray-100"
              onClick={() => setProfilePicture("/images/foto_orang2.png")}
            >
              Remove photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
