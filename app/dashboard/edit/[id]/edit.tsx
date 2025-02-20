"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import SaveLoading from "@/app/_components/SaveLoading";
import SuccessPopup from "@/app/_components/SuccessPopup";
// import { useAlert } from "@/app/_contexts/AlertContext";
import { use } from "react";
import "./globals.css";

interface FormData {
  namaproyek: string;
  nomorkontrak: string;
  kodeproyek: string;
  tanggalkontrak: string;
  tanggalakhirkontrak: string | null;
  password: string;
};

export default function EditPage() {
  const router = useRouter();
  const { id, editId } = useParams();
  const [data, setData] = useState<FormData | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const { showAlert } = useAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    namaproyek: "",
    nomorkontrak: "",
    kodeproyek: "",
    tanggalkontrak: "",
    tanggalakhirkontrak: null,
    password: "",
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/items/${id}`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        // Memformat tanggal untuk input date
        const formatDate = (dateString: string) => {
          if (!dateString) return null;
          const date = new Date(dateString);
          return date.toISOString().split("T")[0];
        };

        setForm({
          namaproyek: data.namaproyek || "",
          nomorkontrak: data.nomorkontrak || "",
          kodeproyek: data.kodeproyek || "",
          tanggalkontrak: formatDate(data.tanggalkontrak) || "",
          tanggalakhirkontrak: formatDate(data.tanggalakhirkontrak),
          password: data.password || "",
        });
      } catch (error) {
        console.error("Error fetching item:", error);
        alert("Gagal memuat data. Silakan coba lagi.");
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/items`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          id: parseInt(Array.isArray(id) ? id[0] : id ?? "0")
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error("Gagal mengedit data.");

      localStorage.removeItem("projectEditFormData");
      setShowSuccessPopup(true); // Tampilkan pop-up sukses

      setTimeout(() => {
        router.push("/dashboard"); // Redirect otomatis setelah pop-up menghilang
      }, 2500);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-6 pb-14 pt-28">
    <div className="max-h-full min-h-screen p-6 bg-gray-200">
      <div className="p-4 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="bg-transparent border-2 border-gray-400 rounded-md">
            <div className="flex items-center justify-between m-4">
              <h2 className="text-xl font-bold">Edit Proyek ROW</h2>
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
                  className={`transition ease-in-out duration-200 ${
                    isSubmitting
                      ? "bg-gray-400"
                      : "bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3"
                  } px-4 py-2 text-white rounded-lg font-semibold w-32`}
                >
                  {isSubmitting ? "MENYIMPAN..." : "SIMPAN"}
                </button>
              </div>
            </div>
            <hr />
            <div>
              <div className="flex items-center justify-between row-container">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Nama Proyek
                </label>
                <input
                  type="text"
                  value={form.namaproyek}
                  onChange={(e) =>
                    setForm({ ...form, namaproyek: e.target.value })
                  }
                  className="w-8/12 p-2 mr-3 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  required
                  placeholder="Masukkan nama proyek"
                />
              </div>
              <div className="flex items-center justify-between row-container">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Nomor Kontrak
                </label>
                <input
                  type="text"
                  value={form.nomorkontrak}
                  onChange={(e) =>
                    setForm({ ...form, nomorkontrak: e.target.value })
                  }
                  className="w-8/12 p-2 mr-3 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  required
                  placeholder="Masukkan nomor kontrak"
                />
              </div>
              <div className="flex items-center justify-between row-container">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Kode Proyek
                </label>
                <input
                  type="text"
                  value={form.kodeproyek}
                  onChange={(e) =>
                    setForm({ ...form, kodeproyek: e.target.value })
                  }
                  className="w-8/12 p-2 mr-3 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  placeholder="Masukkan kode proyek"
                />
              </div>
              <div className="flex items-center justify-between row-container">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Tanggal Kontrak
                </label>
                <input
                  type="date"
                  value={form.tanggalkontrak}
                  onChange={(e) =>
                    setForm({ ...form, tanggalkontrak: e.target.value })
                  }
                  className="w-8/12 p-2 mr-3 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  required
                />
              </div>
              <div className="flex items-center justify-between rounded-b row-container">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Tanggal Berakhir Kontrak
                </label>
                <input
                  type="date"
                  value={form.tanggalakhirkontrak || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tanggalakhirkontrak: e.target.value || null,
                    })
                  }
                  className="w-8/12 p-2 mr-3 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                />
              </div>
              <div className="flex items-center justify-between rounded-b row-container">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Password Proyek
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-8/12 p-2 mr-3 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  required
                  placeholder="Masukkan password proyek"
                />
              </div>
            </div>
            {/* Tampilkan pop-up jika berhasil */}
            {showSuccessPopup && (
              <SuccessPopup
                isVisible
                message="Data berhasil diedit!"
                onClose={() => setShowSuccessPopup(false)}
              />
            )}
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}
