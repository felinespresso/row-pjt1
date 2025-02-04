"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdAddCircleOutline, MdOutlineEdit } from "react-icons/md";
import { FaRegTrashAlt, FaFileImage } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAlert } from "@/app/_context/AlertContext";
import LoadingIndicator from "@/app/_components/LoadingIndicator";

interface SosialisasiData {
  id: string;
  namaDesa: string;
  spanTower: string;
  tanggalPelaksanaan: string;
  keterangan: string;
  beritaAcara: string | null;
  daftarHadir: string | null;
  evidence: EvidenceSosialisasi[];
}

interface EvidenceSosialisasi {
  id: string;
  file: string;
}

const TabelSosialisasi = () => {
  const [sosialisasiData, setSosialisasiData] = useState<SosialisasiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/sosialisasi");
        const data = await response.json();
        console.log(data);
        setSosialisasiData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFileView = async (id: string, type: string) => {
    try {
      const response = await fetch(
        `/api/sosialisasi/${id}/formulir?type=${type}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mengambil file");
      }

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const errorData = await response.json();
        alert(errorData.error || "File tidak tersedia");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "Gagal mengambil file");
    }
  };

  // Fungsi untuk menangani klik tombol hapus
  const handleDelete = (id: string) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  // Fungsi untuk membatalkan penghapusan
  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  // Fungsi untuk mengkonfirmasi dan melakukan penghapusan
  const confirmDelete = async () => {
    if (deleteId) {
      try {
        const response = await fetch(`/api/sosialisasi/${deleteId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Update data setelah berhasil menghapus
          setSosialisasiData((prevData) =>
            prevData.filter((item) => item.id !== deleteId)
          );
          setShowConfirmDelete(false);
          setDeleteId(null);
          showAlert("Data berhasil dihapus!", "success");
        } else {
          showAlert("Gagal menghapus data", "error");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        showAlert("Terjadi kesalahan saat menghapus data", "error");
      }
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Tabel Sosialisasi
          </h1>
          <div className="flex space-x-4">
            <button className="transition ease-in-out duration-200 bg-green-600 hover:-translate-1 hover:scale-110 hover:bg-green-700 text-white px-4 py-2 rounded-xl">
              <div className="flex items-center ml-auto space-x-3 text-sm font-semibold uppercase">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="22px"
                  height="22px"
                  fill="white"
                >
                  <path d="M 24.607422 4.0429688 C 24.347041 4.0335549 24.0813 4.0541387 23.814453 4.1074219 L 8.6171875 7.1464844 C 6.5228355 7.5659519 5 9.4229991 5 11.558594 L 5 36.441406 C 5 38.576376 6.5230144 40.434668 8.6171875 40.853516 L 23.814453 43.892578 C 25.758786 44.281191 27.556602 42.890921 27.875 41 L 37.5 41 C 40.519774 41 43 38.519774 43 35.5 L 43 13.5 C 43 10.480226 40.519774 8 37.5 8 L 28 8 L 28 7.5390625 C 28 5.6340003 26.430086 4.1088659 24.607422 4.0429688 z M 24.402344 7.0488281 C 24.741566 6.9810934 25 7.1922764 25 7.5390625 L 25 40.460938 C 25 40.807724 24.741273 41.019122 24.402344 40.951172 A 1.50015 1.50015 0 0 0 24.402344 40.949219 L 9.2070312 37.910156 A 1.50015 1.50015 0 0 0 9.2050781 37.910156 C 8.4941947 37.768284 8 37.165812 8 36.441406 L 8 11.558594 C 8 10.834188 8.4953832 10.230423 9.2070312 10.087891 L 24.402344 7.0488281 z M 28 11 L 37.5 11 C 38.898226 11 40 12.101774 40 13.5 L 40 35.5 C 40 36.898226 38.898226 38 37.5 38 L 28 38 L 28 11 z M 31.5 15 A 1.50015 1.50015 0 1 0 31.5 18 L 35.5 18 A 1.50015 1.50015 0 1 0 35.5 15 L 31.5 15 z M 12.998047 17.158203 C 12.709209 17.150498 12.414094 17.226453 12.152344 17.392578 C 11.454344 17.837578 11.249359 18.763891 11.693359 19.462891 L 14.681641 24.158203 L 11.693359 28.853516 C 11.249359 29.552516 11.454344 30.478828 12.152344 30.923828 C 12.402344 31.081828 12.681031 31.158203 12.957031 31.158203 C 13.452031 31.158203 13.938609 30.913844 14.224609 30.464844 L 16.458984 26.953125 L 18.693359 30.462891 C 18.980359 30.911891 19.465937 31.158203 19.960938 31.158203 C 20.236938 31.158203 20.513672 31.083828 20.763672 30.923828 C 21.461672 30.478828 21.668609 29.550563 21.224609 28.851562 L 18.238281 24.158203 L 21.224609 19.464844 C 21.668609 18.765844 21.461672 17.837578 20.763672 17.392578 C 20.066672 16.948578 19.139359 17.153516 18.693359 17.853516 L 16.458984 21.363281 L 14.224609 17.851562 C 13.946484 17.414062 13.479443 17.171045 12.998047 17.158203 z M 31.5 23 A 1.50015 1.50015 0 1 0 31.5 26 L 35.5 26 A 1.50015 1.50015 0 1 0 35.5 23 L 31.5 23 z M 31.5 31 A 1.50015 1.50015 0 1 0 31.5 34 L 35.5 34 A 1.50015 1.50015 0 1 0 35.5 31 L 31.5 31 z" />
                </svg>
                <span>EXPORT</span>
              </div>
            </button>
            <Link
              href="/sosialisasi/form"
              className="transition ease-in-out duration-200 bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3 text-white px-4 py-2 rounded-xl"
            >
              <div className="flex items-center ml-auto space-x-3 text-sm font-semibold uppercase">
                <MdAddCircleOutline className="text-xl" />
                <span>ADD DATA</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-transparent rounded-md border-2 border-gray-400 overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-gray-400">
            <thead className="bg-blue-5">
              <tr className="text-xs divide-x-2 divide-gray-400">
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  No.
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  Nama Desa
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  Span Tower
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  Tanggal Pelaksanaan
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  Keterangan
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  Berita Acara
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  Daftar Hadir
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  Evidence
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold right-0 bg-gray-50">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-400">
              {sosialisasiData.map((item, index) => (
                <tr
                  key={item.id}
                  className={`text-sm divide-x-2 divide-gray-400 ${
                    index % 2 === 0 ? "bg-gray-200" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-center">
                    {item.namaDesa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {item.spanTower}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {new Date(item.tanggalPelaksanaan).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {item.keterangan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
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
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {item.daftarHadir ? (
                      <button
                        onClick={() => handleFileView(item.id, "daftarHadir")}
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
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {item.evidence && item.evidence.length > 0 ? (
                      <Link href={`/sosialisasi/evidence/${item.id}`}>
                        <button className="px-4 py-2 text-white transition duration-200 ease-in-out rounded-lg bg-color3 hover:bg-color8">
                          <div className="flex items-center space-x-3 text-sm font-semibold uppercase">
                            <FaFileImage className="text-xl" />
                            <span className="text-sm">Lihat File</span>
                          </div>
                        </button>
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-3">
                      <Link
                        href={`/sosialisasi/edit/${item.id}`}
                        className="flex px-[6px] py-1 transition duration-100 ease-in-out rounded-md bg-color5 hover:-translate-1 hover:scale-110 hover:shadow-lg"
                      >
                        <MdOutlineEdit className="text-xl text-white" />
                      </Link>
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
      </motion.div>

      {/* Modal Konfirmasi Hapus */}
      {showConfirmDelete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white p-6 rounded-md shadow-lg"
          >
            <h2 className="text-lg font-semibold mb-4 text-red-500">
              KONFIRMASI HAPUS
            </h2>
            <p>Apakah Anda yakin ingin menghapus data ini?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={cancelDelete}
                className="mt-2 mr-4 transition ease-in-out duration-200 bg-white border-2 border-gray-500 hover:-translate-1 hover:scale-110 hover:bg-gray-300 text-gray-500 px-4 py-2 rounded-xl font-semibold"
              >
                Tidak
              </button>
              <button
                onClick={confirmDelete}
                className="mt-2 transition ease-in-out duration-200 bg-red-500 hover:-translate-1 hover:scale-110 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold"
              >
                Ya
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TabelSosialisasi;
