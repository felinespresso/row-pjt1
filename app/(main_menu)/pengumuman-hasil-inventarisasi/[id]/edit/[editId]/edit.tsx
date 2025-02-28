"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { useAlert } from "@/app/_context/AlertContext";
import SaveLoading from "@/app/_components/SaveLoading";
import SuccessPopup from "@/app/_components/SuccessPopup";
import "./globals.css";

interface PengumumanData {
  id: string;
  identifikasiId: string;
  namaDesa: string;
  spanTower: string;
  beritaAcara: string | null;
  tanggalPelaksanaan: string;
  keterangan: string;
}

export default function EditPengumuman({ session }: { session: any }) {
  const { id, editId } = useParams();
  const router = useRouter();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<PengumumanData | null>(null);
  const [formData, setFormData] = useState({
    tanggalPelaksanaan: "",
    keterangan: "",
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/pengumuman/${editId}`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const pengumumanData = await response.json();
        setData(pengumumanData);
        setFormData({
          tanggalPelaksanaan: pengumumanData.tanggalPelaksanaan.split("T")[0],
          keterangan: pengumumanData.keterangan,
        });
      } catch (error) {
        console.error("Error:", error);
        showAlert("Gagal mengambil data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Update data umum
      const formDataToSend = new FormData();
      formDataToSend.append("tanggalPelaksanaan", formData.tanggalPelaksanaan);
      formDataToSend.append("keterangan", formData.keterangan);

      await fetch(`/api/pengumuman/${editId}`, {
        method: "PUT",
        body: formDataToSend,
      });

      // Update file jika ada
      const beritaAcaraInput = document.getElementById(
        "beritaAcara"
      ) as HTMLInputElement;
      if (beritaAcaraInput?.files?.[0]) {
        const fileFormData = new FormData();
        fileFormData.append("beritaAcara", beritaAcaraInput.files[0]);

        await fetch(`/api/pengumuman/${editId}/update-file`, {
          method: "PUT",
          body: fileFormData,
        });
      }

      setShowSuccessPopup(true);
      setTimeout(() => {
        router.push(`/pengumuman-hasil-inventarisasi/${id}`);
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      showAlert("Gagal mengupdate data", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-32 pb-20">
      {session.user.role === "admin" ? (
      <div>
      {submitting && <SaveLoading />}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="p-6 bg-white rounded-lg shadow-lg"
      >
          <form onSubmit={handleSubmit}>
            <div className="bg-transparent border-2 border-gray-400 rounded-md">
              <div className="flex items-center justify-between m-4">
                <h2 className="text-xl font-bold">
                  Edit Pengumuman <br />{" "}
                  <span className="text-base text-blue-3">
                    {data?.namaDesa} {data?.spanTower}
                  </span>
                </h2>
                <div className="flex justify-end space-x-4">
                  <Link href={`/pengumuman-hasil-inventarisasi/${id}`}>
                    <button
                      type="button"
                      className="w-32 px-4 py-2 font-semibold text-gray-500 transition duration-200 ease-in-out bg-white border-2 border-gray-500 rounded-lg hover:-translate-1 hover:scale-110 hover:bg-gray-200"
                    >
                      BATAL
                    </button>
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-32 px-4 py-2 font-semibold text-white transition duration-200 ease-in-out rounded-lg bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3"
                  >
                    {submitting ? "MENYIMPAN..." : "SIMPAN"}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 row">
                  <label className="block ml-3 text-sm font-semibold text-black">
                    Nama Desa
                  </label>
                  <div className="w-8/12 mr-3">
                    <input
                      type="text"
                      value={data?.namaDesa || ""}
                      disabled
                      className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2 row">
                  <label className="block ml-3 text-sm font-semibold text-black">
                    Span Tower
                  </label>
                  <div className="w-8/12 mr-3">
                    <input
                      type="text"
                      value={data?.spanTower || ""}
                      disabled
                      className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2 row">
                  <label className="block ml-3 text-sm font-semibold text-black">
                    Tanggal Pelaksanaan
                  </label>
                  <div className="w-8/12 mr-3">
                    <input
                      type="date"
                      value={formData.tanggalPelaksanaan}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tanggalPelaksanaan: e.target.value,
                        })
                      }
                      className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2 row">
                  <label className="block ml-3 text-sm font-semibold text-black">
                    Keterangan
                  </label>
                  <div className="w-8/12 mr-3">
                    <input
                      value={formData.keterangan}
                      onChange={(e) =>
                        setFormData({ ...formData, keterangan: e.target.value })
                      }
                      className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-b row">
                  <label className="block ml-3 text-sm font-semibold text-black">
                    Berita Acara
                  </label>
                  <div className="w-8/12 mr-3">
                    <input
                      id="beritaAcara"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>
            </div>
            </form>
          </motion.div>
          <SuccessPopup
            message="Data berhasil disimpan"
            isVisible={showSuccessPopup}
            onClose={() => setShowSuccessPopup(false)}
          />
        </div>
      ) : (
        <div>
          <Link href={`/pengumuman-hasil-inventarisasi/${id}`}>
            <button className="flex items-center gap-2 text-blue-3 hover:text-blue-4">
              <FaArrowLeft /> Kembali
            </button>
          </Link>
          <p className="flex items-center justify-center m-4 text-gray-500 text-2xl font-bold text-center py-48">
            404 | HALAMAN TIDAK DITEMUKAN
          </p>
        </div>
      )}
    </div>
  );
}
