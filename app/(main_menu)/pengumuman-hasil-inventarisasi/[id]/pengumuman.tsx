"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdAddCircleOutline, MdOutlineEdit } from "react-icons/md";
import { FaRegTrashAlt, FaFileImage } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAlert } from "@/app/_context/AlertContext";
import SuccessPopup from "@/app/_components/SuccessPopup";
import ExportButtonPengumuman from "@/app/_components/export/ExportButtonPengumuman";
import { useParams, useRouter } from "next/navigation";
import Pagination from "@/app/_components/pagination";
import { format } from "date-fns";

interface PengumumanData {
  id: string;
  namaDesa: string;
  spanTower: string;
  tanggalPelaksanaan: string;
  keterangan: string;
  beritaAcara: string | null;
  evidence: EvidencePengumuman[];
  createdAt: string;
  updatedAt: string;
}

interface EvidencePengumuman {
  id: string;
  file: string;
  fileName?: string;
}

const TabelPengumuman = () => {
  const [pengumumanData, setPengumumanData] = useState<PengumumanData[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { showAlert } = useAlert();
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/pengumuman?itemId=${id}`, {
          cache: "no-store",
        });
        const data = await response.json();
        setPengumumanData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        showAlert("Gagal mengambil data", "error");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };
    fetchData();
  }, [showAlert]);

  const totalPages = Math.ceil(pengumumanData.length / itemsPerPage);

  const handleFileView = async (id: string, type: string) => {
    try {
      const response = await fetch(
        `/api/pengumuman/${id}/formulir?type=${type}`
      );
      if (!response.ok) {
        alert(
          "Gagal membuka file: File tidak ditemukan atau terjadi kesalahan."
        );
        return;
      }

      const { url } = await response.json();
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error membuka file:", error);
      alert("Terjadi kesalahan saat membuka file.");
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        const response = await fetch(`/api/pengumuman/${deleteId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setPengumumanData((prevData) =>
            prevData.filter((item) => item.id !== deleteId)
          );
          setShowConfirmDelete(false);
          setDeleteId(null);
          setSuccessMessage("Data berhasil dihapus!");
          setShowSuccessPopup(true);
        } else {
          showAlert("Gagal menghapus data", "error");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        showAlert("Terjadi kesalahan saat menghapus data", "error");
      }
    }
  };

  const exportToExcel = () => {
    const headers = {
      "NO.": "NO.",
      "NAMA DESA": "NAMA DESA",
      "SPAN TOWER": "SPAN TOWER",
      "TANGGAL PELAKSANAAN": "TANGGAL PELAKSANAAN",
      KETERANGAN: "KETERANGAN",
    };

    const processedData = pengumumanData.map((item, index) => ({
      "NO.": index + 1,
      "NAMA DESA": item.namaDesa || "-",
      "SPAN TOWER": item.spanTower || "-",
      "TANGGAL PELAKSANAAN": item.tanggalPelaksanaan
        ? new Date(item.tanggalPelaksanaan).toLocaleDateString()
        : "-",
      KETERANGAN: item.keterangan || "-",
    }));

    // ... (kode export Excel sama seperti sosialisasi)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "yyyy-MM-dd");
  };

  return (
    <div className="px-6 pt-32 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="p-6 bg-white rounded-lg shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Tabel Pengumuman Hasil Inventarisasi
            </h1>
          </div>
          <div className="flex space-x-4">
            <ExportButtonPengumuman pengumumanData={pengumumanData} />
            <Link
              href={`/pengumuman-hasil-inventarisasi/${id}/form`}
              className="px-4 py-2 text-white transition duration-200 ease-in-out bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3 rounded-xl"
            >
              <div className="flex items-center ml-auto space-x-3 text-sm font-semibold uppercase">
                <MdAddCircleOutline className="text-xl" />
                <span>TAMBAH DATA</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto bg-transparent border-2 border-gray-400 rounded-md">
          <table className="min-w-full divide-y-2 divide-gray-400">
            <thead className="bg-blue-5">
              <tr className="text-xs divide-x-2 divide-gray-400">
                <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                  No.
                </th>
                <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                  Nama Desa
                </th>
                <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                  Span Tower
                </th>
                <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                  Tanggal Pelaksanaan
                </th>
                <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                  Keterangan
                </th>
                <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                  Berita Acara
                </th>
                <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                  Evidence
                </th>
                <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-400">
              {pengumumanData.map((item, index) => (
                <tr
                  key={item.id}
                  className={`text-sm divide-x-2 divide-gray-400 ${
                    index % 2 === 0 ? "bg-gray-200" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-normal">
                    {item.namaDesa}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    {item.spanTower}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    {formatDate(item.tanggalPelaksanaan)}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    {item.keterangan}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    {item.beritaAcara ? (
                      <button
                        onClick={() => handleFileView(item.id, "beritaAcara")}
                        className="px-4 py-2 text-white transition duration-200 ease-in-out rounded-lg bg-color3 hover:bg-color8"
                      >
                        <div className="flex items-center space-x-3 text-sm font-semibold uppercase">
                          <FaFileImage className="text-xl" />
                          <span className="text-sm">Lihat File</span>
                        </div>
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <button
                      onClick={() =>
                        router.push(
                          `/pengumuman-hasil-inventarisasi/${id}/evidence/${item.id}`
                        )
                      }
                      className="px-4 py-2 text-white transition duration-200 ease-in-out rounded-lg bg-color3 hover:bg-color8"
                      title={`Lihat Evidence (${item.evidence?.length || 0})`}
                    >
                      <div className="flex items-center space-x-3 text-sm font-semibold uppercase">
                        <FaFileImage className="text-xl" />
                        <span className="text-sm">
                          Lihat Evidence ({item.evidence?.length || 0})
                        </span>
                      </div>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() =>
                          router.push(
                            `/pengumuman-hasil-inventarisasi/${id}/edit/${item.id}`
                          )
                        }
                        className="flex px-[6px] py-1 transition duration-100 ease-in-out rounded-md bg-color5 hover:-translate-1 hover:scale-110 hover:shadow-lg"
                      >
                        <MdOutlineEdit className="text-xl text-white" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex px-[6px] py-1 transition duration-100 ease-in-out bg-red-500 rounded-md hover:-translate-1 hover:scale-110 hover:shadow-lg"
                      >
                        <FaRegTrashAlt className="text-lg text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mx-8 mt-8">
          <Pagination totalPages={totalPages} />
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="p-6 bg-white rounded-md shadow-lg"
            >
              <h2 className="mb-4 text-lg font-semibold text-red-500">
                KONFIRMASI HAPUS
              </h2>
              <p>Apakah Anda yakin ingin menghapus data ini?</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 mt-2 mr-4 font-semibold text-gray-500 transition duration-200 ease-in-out bg-white border-2 border-gray-500 hover:-translate-1 hover:scale-110 hover:bg-gray-300 rounded-xl"
                >
                  Tidak
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 mt-2 font-semibold text-white transition duration-200 ease-in-out bg-red-500 hover:-translate-1 hover:scale-110 hover:bg-red-600 rounded-xl"
                >
                  Ya
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SuccessPopup
        message={successMessage}
        isVisible={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
      />
    </div>
  );
};

export default TabelPengumuman;
