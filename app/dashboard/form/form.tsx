// app/dashboard/form/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SaveLoading from "@/app/_components/SaveLoading";
import SuccessPopup from "@/app/_components/SuccessPopup";
import { useAlert } from "@/app/_contexts/AlertContext";
import "../globals.css";

interface FormData {
  namaproyek: string;
  nomorkontrak: string;
  kodeproyek: string;
  tanggalkontrak: string;
  tanggalakhirkontrak: string | null;
  password: string;
}

export const FormPage: React.FC = () => {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState<FormData>({
    namaproyek: "",
    nomorkontrak: "",
    kodeproyek: "",
    tanggalkontrak: "",
    tanggalakhirkontrak: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    namaproyek: "",
    nomorkontrak: "",
    kodeproyek: "",
    tanggalkontrak: "",
    password: "",
  });

  // Fungsi untuk menyimpan data ke localStorage
  const saveToLocalStorage = (data: typeof form) => {
    try {
      localStorage.setItem("projectFormData", JSON.stringify(data));
    } catch (error) {
      console.error("Gagal menyimpan data ke localStorage:", error);
    }
  };

  // Fungsi untuk memuat data dari localStorage
  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem("projectFormData");
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error("Gagal memuat data dari localStorage:", error);
    }
    return null;
  };

  // Efek untuk memuat data tersimpan saat komponen dimuat
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      setForm(savedData);
    }
  }, []);

  // Perbarui localStorage setiap kali form berubah
  useEffect(() => {
    saveToLocalStorage(form);
  }, [form]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({
      namaproyek: "",
      nomorkontrak: "",
      kodeproyek: "",
      tanggalkontrak: "",
      password: "",
    });

    // Validasi form
    let hasError = false;
    const newErrors = {
      namaproyek: "",
      nomorkontrak: "",
      kodeproyek: "",
      tanggalkontrak: "",
      password: "",
    };

    if (!form.namaproyek) {
      newErrors.namaproyek = "Nama proyek wajib diisi!";
      hasError = true;
    }

    if (!form.nomorkontrak) {
      newErrors.nomorkontrak = "Nomor kontrak wajib diisi!";
      hasError = true;
    }

    if (!form.kodeproyek) {
      newErrors.kodeproyek = "Kode proyek wajib diisi!";
      hasError = true;
    }

    if (!form.tanggalkontrak) {
      newErrors.tanggalkontrak = "Tanggal kontrak wajib diisi!";
      hasError = true;
    }

    if (!form.password) {
      newErrors.password = "Password proyek wajib diisi!";
      hasError = true;
    }

    if (hasError) {
      setFormErrors(newErrors);
      showAlert("Mohon mengisi data yang wajib diisi!", "error");
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData(e.currentTarget);

      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      

      // Hapus data dari localStorage setelah berhasil submit
      localStorage.removeItem("projectFormData");

      setShowSuccessPopup(true);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error adding item:", error);
      showAlert("Gagal menyimpan data. Silakan coba lagi.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-10">
      {isLoading && <SaveLoading />}
      <SuccessPopup
        message="Data berhasil disimpan"
        isVisible={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
      />

      <div className="p-4 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="bg-transparent border-2 border-gray-400 rounded-md">
            <div className="flex items-center justify-between m-4">
              <h2 className="text-xl font-bold">Form Proyek ROW</h2>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="w-32 px-4 py-2 font-semibold text-gray-500 transition duration-200 ease-in-out bg-white border-2 border-gray-500 rounded-lg hover:-translate-1 hover:scale-110 hover:bg-gray-200"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-32 px-4 py-2 font-semibold text-white transition duration-200 ease-in-out rounded-lg bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3"
                >
                  {isSubmitting ? "MENYIMPAN..." : "SIMPAN"}
                </button>
              </div>
            </div>
            <hr />
            {/* Form inputs */}
            <div>
              <div className="flex items-center justify-between row-container ">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Nama Proyek
                </label>
                <div className="w-8/12 mr-3">
                  <input
                    type="text"
                    name="namaproyek"
                    value={form.namaproyek}
                    onChange={(e) =>
                      setForm({ ...form, namaproyek: e.target.value })
                    }
                    className={`w-full p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400 ${
                      formErrors.namaproyek
                        ? "border-red-500"
                        : "border-gray-400"
                    }`}
                    placeholder="Masukkan nama proyek"
                  />
                  {formErrors.namaproyek && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.namaproyek}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between row-container">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Nomor Kontrak
                </label>
                <div className="w-8/12 mr-3">
                  <input
                    type="text"
                    name="nomorkontrak"
                    value={form.nomorkontrak}
                    onChange={(e) =>
                      setForm({ ...form, nomorkontrak: e.target.value })
                    }
                    className={`w-full p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400 ${
                      formErrors.nomorkontrak
                        ? "border-red-500"
                        : "border-gray-400"
                    }`}
                    placeholder="Masukkan nomor kontrak"
                  />
                  {formErrors.nomorkontrak && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.nomorkontrak}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between row-container">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Kode Proyek
                </label>
                <div className="w-8/12 mr-3">
                  <input
                    type="text"
                    name="kodeproyek"
                    value={form.kodeproyek}
                    onChange={(e) =>
                      setForm({ ...form, kodeproyek: e.target.value })
                    }
                    className={`w-full p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400 ${
                      formErrors.kodeproyek
                        ? "border-red-500"
                        : "border-gray-400"
                    }`}
                    placeholder="Masukkan kode proyek"
                  />
                  {formErrors.kodeproyek && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.kodeproyek}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between row-container">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Tanggal Kontrak
                </label>
                <div className="w-8/12 mr-3">
                  <input
                    type="date"
                    name="tanggalkontrak"
                    value={form.tanggalkontrak}
                    onChange={(e) =>
                      setForm({ ...form, tanggalkontrak: e.target.value })
                    }
                    className={`w-full p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400 ${
                      formErrors.tanggalkontrak
                        ? "border-red-500"
                        : "border-gray-400"
                    }`}
                  />
                  {formErrors.tanggalkontrak && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.tanggalkontrak}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between rounded-b row-container">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Tanggal Berakhir Kontrak
                </label>
                <div className="w-8/12 mr-3">
                  <input
                    type="date"
                    value={form.tanggalakhirkontrak || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tanggalakhirkontrak: e.target.value || null,
                      })
                    }
                    className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-b row-container">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Password Proyek
                </label>
                <div className="w-8/12 mr-3">
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className={`w-full p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400 ${
                      formErrors.password ? "border-red-500" : "border-gray-400"
                    }`}
                    placeholder="Masukkan password proyek"
                  />
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.password}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
