"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import "./globals.css";
import { item } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useAlert } from "@/app/_contexts/AlertContext";
import { MdAddCircleOutline, MdOutlineEdit } from "react-icons/md";
import SuccessPopup from "@/app/_components/SuccessPopup";
import Link from "next/link";
import { FaRegTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
import Pagination from "@/app/_components/pagination";
import ExportButtonDashboard from "@/app/_components/export/ExportButtonDashboard";

export const Dashboard = ({ session }: { session: any }) => {
  const [items, setItems] = useState<item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    namaproyek: "",
    nomorkontrak: "",
    kodeproyek: "",
    tanggalkontrak: "",
    tanggalakhirkontrak: "",
  });
  const router = useRouter();
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const { showAlert } = useAlert();
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      // Tambahkan timestamp untuk menghindari cache
      const response = await fetch("/api/items?" + new Date().getTime(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Tambahkan header Cache-Control
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        console.error("Data is not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return "-"; // Jika tanggal kosong, kembalikan "-"
    return format(new Date(date), "yyyy-MM-dd"); // Format tanggal menggunakan date-fns
  };

  const exportToExcel = () => {
    const formatNamaProyek = (namaproyek: string) => {
      return namaproyek
        .split(" ")
        .reduce((acc: string[], word, i) => {
          if (i % 4 === 0) {
            acc.push(word);
          } else {
            acc[acc.length - 1] += " " + word;
          }
          return acc;
        }, [])
        .join("\n");
    };

    // Mengubah semua header menjadi uppercase
    const headers = {
      "NO.": "NO.",
      "NAMA PROYEK": "NAMA PROYEK",
      "NOMOR KONTRAK": "NOMOR KONTRAK",
      "KODE PROYEK": "KODE PROYEK",
      "TANGGAL KONTRAK": "TANGGAL KONTRAK",
      "TANGGAL BERAKHIR KONTRAK": "TANGGAL BERAKHIR KONTRAK",
    };

    const excelData = [
      headers, // Menambahkan header sebagai baris pertama
      ...items.map((item, index) => ({
        "NO.": index + 1,
        "NAMA PROYEK": formatNamaProyek(item.namaproyek),
        "NOMOR KONTRAK": item.nomorkontrak || "-",
        "KODE PROYEK": item.kodeproyek || "-",
        "TANGGAL KONTRAK": item.tanggalkontrak
          ? new Date(item.tanggalkontrak).toLocaleDateString()
          : "-",
        "TANGGAL BERAKHIR KONTRAK": item.tanggalakhirkontrak
          ? new Date(item.tanggalakhirkontrak).toLocaleDateString()
          : "-",
      })),
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData, { skipHeader: true });

    // Style untuk header
    const headerStyle = {
      font: {
        bold: true,
        sz: 12,
        color: { rgb: "000000" }, // Ubah warna teks menjadi hitam
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
        wrapText: true,
      },
      fill: {
        fgColor: { rgb: "B8CCE4" }, // Steelblue light color 40%
      },
      border: {
        top: { style: "medium", color: { rgb: "000000" } }, // Border hitam tebal
        bottom: { style: "medium", color: { rgb: "000000" } }, // Border hitam tebal
        left: { style: "medium", color: { rgb: "000000" } }, // Border hitam tebal
        right: { style: "medium", color: { rgb: "000000" } }, // Border hitam tebal
      },
    };

    // Style untuk data
    const dataStyle = {
      alignment: {
        horizontal: "center",
        vertical: "center",
        wrapText: true,
      },
      border: {
        top: { style: "thin", color: { rgb: "000000" } }, // Border hitam tipis
        bottom: { style: "thin", color: { rgb: "000000" } }, // Border hitam tipis
        left: { style: "thin", color: { rgb: "000000" } }, // Border hitam tipis
        right: { style: "thin", color: { rgb: "000000" } }, // Border hitam tipis
      },
    };

    // Style untuk highlight baris pertama data
    const highlightStyle = {
      fill: {
        fgColor: { rgb: "FFFF00" }, // Latar kuning
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    };

    // Mendapatkan range sel yang digunakan
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");

    // Mengatur style untuk setiap sel
    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) continue;

        // Terapkan style header
        if (R === range.s.r) {
          worksheet[cellAddress].s = headerStyle;
        }
        // Terapkan style highlight pada baris pertama data
        else if (R === range.s.r + 1) {
          worksheet[cellAddress].s = highlightStyle;
        }
        // Terapkan style untuk data lainnya
        else {
          worksheet[cellAddress].s = dataStyle;
        }
      }
    }

    // Mengatur auto-width untuk setiap kolom
    const colWidths = [];
    for (let C = range.s.c; C <= range.e.c; C++) {
      let maxLength = 0;
      for (let R = range.s.r; R <= range.e.r; R++) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (worksheet[cellAddress]) {
          const cellValue = String(worksheet[cellAddress].v);
          maxLength = Math.max(maxLength, cellValue.length);
        }
      }
      colWidths[C] = { wch: maxLength + 2 }; // Tambah padding
    }
    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Proyek");

    // Mengatur properti workbook
    workbook.Workbook = {
      Views: [
        {
          RTL: false, // Memastikan arah teks dari kiri ke kanan
        },
      ],
    };

    XLSX.writeFile(workbook, "Daftar Proyek ROW.xlsx");
  };

  // Hitung total halaman
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // const session = async () =>{
  //   try{
  //     const session = await auth();
  //   } catch(eror){
  //   }
  // }

  const handleProjectClick = (itemId: number) => {
    setSelectedItemId(itemId);
    setIsPasswordModalOpen(true);
    setPassword("");
    setPasswordError("");
  };

  const handlePasswordSubmit = async () => {
    try {
      const response = await fetch("/api/items/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: selectedItemId,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.isValid) {
        setIsPasswordModalOpen(false);
        // Redirect ke halaman inventarisasi
        router.push("/home");
      } else {
        setPasswordError("Password salah!");
      }
    } catch (error) {
      setPasswordError("Terjadi kesalahan!");
    }
  };

  const handleDeleteClick = (itemId: number) => {
    setItemToDelete(itemId);
    setShowConfirmDelete(true);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setItemToDelete(null);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const response = await fetch(`/api/items?id=${itemToDelete}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setItems(items.filter((item) => item.id !== itemToDelete));
          setShowConfirmDelete(false);
          setItemToDelete(null);
          // setShowSuccessPopup(true);
          showAlert("Data proyek telah berhasil dihapus!", "success");

          setTimeout(() => {
            setShowSuccessPopup(false);
          }, 3000);
        } else {
          showAlert("Gagal menghapus data proyek. Silakan coba lagi.", "error");
        }
      } catch (error) {
        console.error("Error:", error);
        showAlert("Terjadi kesalahan saat menghapus data proyek.", "error");
      }
    }
  };

  return (
    <div className="p-8">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 ">
          <h1 className="text-2xl font-bold text-gray-800">
            Daftar Proyek ROW
          </h1>
          {session.user.role === "admin" ? (
            <div className="flex space-x-4">
              <ExportButtonDashboard currentItems={currentItems} />
              <Link
                href="dashboard/form"
                className="px-4 py-2 text-white transition duration-200 ease-in-out bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3 rounded-xl"
              >
                <div className="flex items-center ml-auto space-x-3 text-sm font-semibold uppercase">
                  <MdAddCircleOutline className="text-xl" />
                  <span>TAMBAH DATA</span>
                </div>
              </Link>
            </div>
          ) : null}
        </div>

        {/* Table */}
        <div className="bg-transparent border-2 border-gray-400 rounded-md">
          <div className="overflow-x-auto rounded">
            <table className="min-w-full divide-y-2 divide-gray-400">
              <thead className="bg-gray-50">
                <tr className="text-xs divide-x-2 divide-gray-400">
                  <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-500 uppercase">
                    No.
                  </th>
                  <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-500 uppercase">
                    Nama Proyek
                  </th>
                  <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-500 uppercase">
                    Nomor Kontrak
                  </th>
                  <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-500 uppercase">
                    Kode Proyek
                  </th>
                  <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-500 uppercase">
                    Tanggal Kontrak
                  </th>
                  <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-500 uppercase">
                    Tanggal Berakhir Kontrak
                  </th>
                  {session.user.role === "admin" ? (
                    <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-500 uppercase">
                      Aksi
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-400">
                {currentItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`text-sm divide-x-2 divide-gray-400 ${
                      index % 2 === 0 ? "bg-gray-200" : "bg-white"
                    } h-16`}
                  >
                    <td className="px-6 py-4 text-center align-middle whitespace-nowrap">
                      {indexOfFirstItem + index + 1}
                    </td>

                    <td className="px-6 py-4 text-center whitespace-normal">
                      <button
                        onClick={() => {
                          // handleProjectClick(item.id); // Panggil fungsi handleProjectClick
                          router.push(`/home/${item.id}`); // Navigasi ke halaman proyek
                        }}
                        className="text-blue-2 hover:text-blue-3 active:text-blue-4"
                      >
                        {item.namaproyek
                          .split(" ")
                          .reduce((acc: string[], word, i) => {
                            if (i % 4 === 0) {
                              acc.push(word);
                            } else {
                              acc[acc.length - 1] += " " + word;
                            }
                            return acc;
                          }, [])
                          .join("\n")}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {item.nomorkontrak || "-"}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {item.kodeproyek || "-"}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {item.tanggalkontrak
                        ? formatDate(new Date(item.tanggalkontrak))
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {item.tanggalakhirkontrak
                        ? formatDate(new Date(item.tanggalakhirkontrak))
                        : "-"}
                    </td>
                    {session.user.role === "admin" ? (
                      <td className="px-2 py-4 text-center whitespace-nowrap">
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() =>
                              router.push(`/dashboard/edit/${item.id}`)
                            }
                            className="flex px-[6px] py-1 transition duration-100 ease-in-out rounded-md bg-color5 hover:-translate-1 hover:scale-110 hover:shadow-lg"
                          >
                            <MdOutlineEdit className="text-xl text-white" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            className="flex px-[6px] py-1 transition duration-100 ease-in-out bg-red-500 rounded-md hover:-translate-1 hover:scale-110 hover:shadow-lg"
                          >
                            <FaRegTrashAlt className="text-xl text-white" />
                          </button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mx-8 mt-8">
          <Pagination totalPages={totalPages} />
        </div>
      </div>

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg w-96">
            <h2 className="mb-4 text-xl font-bold">Masukkan Password Proyek</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mr-3 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
              placeholder="Password"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handlePasswordSubmit();
                }
              }}
            />
            {passwordError && (
              <p className="mb-4 text-sm text-red-500">{passwordError}</p>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2 mt-2 font-semibold text-gray-500 transition duration-200 ease-in-out bg-white border-2 border-gray-500 hover:-translate-1 hover:scale-110 hover:bg-gray-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="px-4 py-2 mt-2 font-semibold text-white transition duration-200 ease-in-out bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3 rounded-xl"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
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
      <SuccessPopup
        message={successMessage}
        isVisible={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
      />
    </div>
  );
};
