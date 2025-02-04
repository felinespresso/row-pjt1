"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import "./globals.css";

interface Identifikasi {
  id: string;
  namadesa: string;
  spantower: string;
}

interface FormData {
  identifikasiId: string;
  tanggalPelaksanaan: string;
  keterangan: string;
  beritaAcara: File | null;
  evidence: File[];
}

const FormPengumuman = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    identifikasiId: "",
    tanggalPelaksanaan: "",
    keterangan: "",
    beritaAcara: null,
    evidence: [],
  });
  const [identifikasiList, setIdentifikasiList] = useState<Identifikasi[]>([]);

  useEffect(() => {
    const fetchIdentifikasi = async () => {
      try {
        const response = await fetch("/api/identifikasi");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setIdentifikasiList(data);
      } catch (error) {
        console.error("Error fetching identifikasi:", error);
      }
    };

    fetchIdentifikasi();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("identifikasiId", formData.identifikasiId);
      formDataToSend.append("tanggalPelaksanaan", formData.tanggalPelaksanaan);
      formDataToSend.append("keterangan", formData.keterangan);

      if (formData.beritaAcara) {
        formDataToSend.append("beritaAcara", formData.beritaAcara);
      }

      formData.evidence.forEach((file) => {
        formDataToSend.append("evidence", file);
      });

      const response = await fetch("/api/sosialisasi", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      router.push("/sosialisasi");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <form onSubmit={handleSubmit}>
        <div className="bg-transparent rounded-md border-2 border-gray-400">
          <div className="flex justify-between items-center m-4">
            <h2 className="text-xl font-bold">Form Pengumuman Hasil Inventarisasi</h2>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push("/sosialisasi")}
                className="transition ease-in-out duration-200 bg-white hover:-translate-1 hover:scale-110 hover:bg-gray-200 duration-300 px-4 py-2 text-gray-500 border-2 border-gray-500 rounded-lg font-semibold w-32"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="transition ease-in-out duration-200 bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3 px-4 py-2 text-white rounded-lg font-semibold w-32"
              >
                {isSubmitting ? "SAVING..." : "SAVE"}
              </button>
            </div>
          </div>

          <div>
            <div className="row flex justify-between items-center">
              <label className="block text-sm font-semibold text-black ml-3">
                Nama Desa
              </label>
              <div className="w-8/12 mr-3 flex items-center">
                <select
                  className="flex-1 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  value={formData.identifikasiId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      identifikasiId: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Pilih Nama Desa</option>
                  {identifikasiList.map((identifikasi) => (
                    <option key={identifikasi.id} value={identifikasi.id}>
                      {identifikasi.namadesa}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row flex justify-between items-center">
              <label className="block text-sm font-semibold text-black ml-3">
                Span Tower
              </label>
              <div className="w-8/12 mr-3 flex items-center">
                <input
                  type="text"
                  className="flex-1 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  value={
                    identifikasiList.find(
                      (i) => i.id === formData.identifikasiId
                    )?.spantower || ""
                  }
                  readOnly
                  placeholder="Span tower akan muncul di sini"
                />
              </div>
            </div>

            <div className="row flex justify-between items-center">
              <label className="block text-sm font-semibold text-black ml-3">
                Tanggal Pelaksanaan
              </label>
              <div className="w-8/12 mr-3 flex items-center">
                <input
                  type="date"
                  value={formData.tanggalPelaksanaan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tanggalPelaksanaan: e.target.value,
                    })
                  }
                  className="flex-1 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  required
                />
              </div>
            </div>

            <div className="row flex justify-between items-center">
              <label className="block text-sm font-semibold text-black ml-3">
                Keterangan
              </label>
              <div className="w-8/12 mr-3 flex items-center">
                <input
                  type="text"
                  value={formData.keterangan}
                  onChange={(e) =>
                    setFormData({ ...formData, keterangan: e.target.value })
                  }
                  className="flex-1 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  placeholder="Masukkan keterangan"
                />
              </div>
            </div>

            <div className="row flex justify-between items-center">
              <label className="block text-sm font-semibold text-black ml-3">
                Berita Acara
              </label>
              <div className="w-8/12 mr-3 flex items-center">
                <input
                  type="file"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      beritaAcara: e.target.files?.[0] || null,
                    })
                  }
                  className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  accept=".pdf"
                />
              </div>
            </div>
            <div className="row flex justify-between items-center rounded-b">
              <label className="block text-sm font-semibold text-black ml-3">
                Evidence
              </label>
              <div className="w-8/12 mr-3 flex items-center">
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      evidence: Array.from(e.target.files || []),
                    })
                  }
                  className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  accept="image/*"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default FormPengumuman;
