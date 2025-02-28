"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FaEdit,
  FaFileAlt,
  FaFileImage,
  FaRegTrashAlt,
  FaTrash,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { MdOutlineEdit } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useAlert } from "@/app/_context/AlertContext";
// import LoadingIndicator from "@/app/_components/LoadingIndicator";
import SuccessPopup from "@/app/_components/SuccessPopup";
import Link from "next/link";
import { MdAddCircleOutline } from "react-icons/md";
import Pagination from "@/app/_components/pagination";
import ExportButtonInventarisasi from "@/app/_components/export/ExportButtonInventarisasi";
import { format } from "date-fns";

// Definisikan tipe data sesuai schema.prisma
type jenisbangunan = {
  id: number;
  namabangunan: string;
  luasbangunan: string;
  invent: inventarisasi[];
};

type jenistanaman = {
  id: number;
  namatanaman: string;
  produktif: string;
  besar: string;
  kecil: string;
  invent: inventarisasi[];
};

type inventbangunan = {
  inventId: number;
  bangunanId: number;
  invent: inventarisasi[];
  jnsbangunan: jenisbangunan;
};

type inventtanaman = {
  inventId: number;
  tanamanId: number;
  invent: inventarisasi[];
  jnstanaman: jenistanaman;
};

type inventarisasi = {
  id: number;
  span: string;
  bidanglahan: string;
  formulir: string | null;
  pelaksanaan: string;
  namapemilik: string;
  nik: string;
  ttl: string;
  desakelurahan: string;
  kecamatan: string;
  kabupatenkota: string;
  alashak: string;
  luastanah: string;
  pekerjaan: string;
  jnsbangunan: inventbangunan[];
  jnstanaman: inventtanaman[];
};

const TabelInventarisasi = ({ session }: { session: any }) => {
  const router = useRouter();
  const [items, setItems] = useState<inventarisasi[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const params = useParams();
  const id = params.id;
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "yyyy-MM-dd");
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(`/api/invents?itemId=${id}`);
      const data = await response.json();

      // Urutkan berdasarkan ID secara descending
      const sortedItems = data.sort(
        (a: inventarisasi, b: inventarisasi) => b.id - a.id
      );
      setItems(sortedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) {
      console.error("❌ Tidak ada ID yang dipilih untuk dihapus!");
      return;
    }

    try {
      const response = await fetch(`/api/invents`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteId }), // Kirim ID dalam body
      });

      if (response.ok) {
        console.log("✅ Data berhasil dihapus, memperbarui daftar...");
        await fetchItems(); // Pastikan fetchItems() didefinisikan dengan benar
        setShowConfirmDelete(false);
        setDeleteId(null);
        setSuccessMessage("Data berhasil dihapus!");
        setShowSuccessPopup(true);
      } else {
        console.error("❌ Gagal menghapus data:", await response.text());
        showAlert("Gagal menghapus data", "error");
      }
    } catch (error) {
      console.error("❌ Terjadi kesalahan saat menghapus data:", error);
      showAlert("Terjadi kesalahan saat menghapus data", "error");
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  // Fungsi baru untuk membuka formulir
  const handleViewFormulir = async (id: number) => {
    try {
      const response = await fetch(`/api/invents/${id}/formulir`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mengambil formulir");
      }

      // Cek apakah response adalah JSON (error) atau PDF
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const errorData = await response.json();
        alert(errorData.error || "Formulir tidak tersedia");
        return;
      }

      // Jika PDF, buka di tab baru
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error:", error);
      alert(
        error instanceof Error ? error.message : "Gagal mengambil formulir"
      );
    }
  };

  // Hitung total halaman
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items
    .sort((a, b) => b.id - a.id)
    .slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderTableRow = (item: inventarisasi, index: number) => {
    const maxRows = Math.max(
      item.jnsbangunan.length || 1,
      item.jnstanaman.length || 1
    );
    const isEvenItem = (indexOfFirstItem + index) % 2 === 0;
    const isLastRow = index === currentItems.length - 1;

    return Array.from({ length: maxRows }).map((_, rowIndex) => (
      <tr
        key={`${item.id}-${rowIndex}`}
        className={`text-sm divide-x-2 divide-gray-400 ${
          isEvenItem ? "bg-gray-200" : "bg-white"
        } ${isLastRow && rowIndex === maxRows - 1 ? "rounded-b" : ""}`}
      >
        {/* Kolom dengan rowSpan untuk data yang sama */}
        {rowIndex === 0 && (
          <>
            <td
              className="px-6 py-4 text-center whitespace-nowrap"
              rowSpan={maxRows}
            >
              {indexOfFirstItem + index + 1}
            </td>
            <td
              className="px-6 py-4 text-center whitespace-nowrap"
              rowSpan={maxRows}
            >
              {item.span || "-"}
            </td>
            <td
              className="px-6 py-4 text-center whitespace-nowrap"
              rowSpan={maxRows}
            >
              {item.bidanglahan || "-"}
            </td>
            <td
              className="px-6 py-4 text-center whitespace-nowrap"
              rowSpan={maxRows}
            >
              {item.formulir ? (
                <button
                  onClick={() => handleViewFormulir(item.id)}
                  className="px-4 py-2 text-white transition duration-200 ease-in-out rounded-lg bg-color3 hover:bg-color8"
                >
                  <div className="flex items-center space-x-3 text-sm font-semibold uppercase">
                    <FaFileAlt className="text-xl" />
                    <span className="text-sm">Lihat File</span>
                  </div>
                </button>
              ) : (
                "-"
              )}
            </td>
            <td
              className="px-6 py-4 text-center whitespace-nowrap"
              rowSpan={maxRows}
            >
              {formatDate(item.pelaksanaan)}
            </td>
            <td
              className="px-6 py-4 text-center whitespace-nowrap"
              rowSpan={maxRows}
            >
              {item.namapemilik || "-"}
            </td>
            <td
              className="px-6 py-4 text-center whitespace-nowrap"
              rowSpan={maxRows}
            >
              {item.nik || "-"}
            </td>
            <td
              className="px-6 py-4 text-center whitespace-nowrap"
              rowSpan={maxRows}
            >
              {item.ttl || "-"}
            </td>
            <td
              className="px-6 py-4 text-center whitespace-nowrap"
              rowSpan={maxRows}
            >
              {item.desakelurahan || "-"}
            </td>
            <td
              className="px-6 py-4 text-center whitespace-nowrap"
              rowSpan={maxRows}
            >
              {item.kecamatan || "-"}
            </td>
            <td
              className="px-6 py-4 text-center whitespace-nowrap"
              rowSpan={maxRows}
            >
              {item.kabupatenkota || "-"}
            </td>
            <td
              className="px-6 py-4 text-center whitespace-nowrap"
              rowSpan={maxRows}
            >
              {item.pekerjaan || "-"}
            </td>
            <td
              className="px-6 py-4 text-center whitespace-nowrap"
              rowSpan={maxRows}
            >
              {item.luastanah || "-"}
            </td>
            <td
              className="px-6 py-4 text-center whitespace-nowrap"
              rowSpan={maxRows}
            >
              {item.alashak || "-"}
            </td>
          </>
        )}

        {/* Kolom Jenis Bangunan */}
        <td className="px-6 py-4 text-center border-l-2 border-gray-400 whitespace-nowrap">
          {item.jnsbangunan[rowIndex]?.jnsbangunan.namabangunan || "-"}
        </td>
        <td className="px-6 py-4 text-center whitespace-nowrap">
          {item.jnsbangunan[rowIndex]?.jnsbangunan.luasbangunan || "-"}
        </td>

        {/* Kolom Jenis Tanaman */}
        <td className="px-6 py-4 text-center whitespace-nowrap">
          {item.jnstanaman[rowIndex]?.jnstanaman.namatanaman || "-"}
        </td>
        <td className="px-6 py-4 text-center whitespace-nowrap">
          {item.jnstanaman[rowIndex]?.jnstanaman.produktif || "-"}
        </td>
        <td className="px-6 py-4 text-center whitespace-nowrap">
          {item.jnstanaman[rowIndex]?.jnstanaman.besar || "-"}
        </td>
        <td className="px-6 py-4 text-center whitespace-nowrap">
          {item.jnstanaman[rowIndex]?.jnstanaman.kecil || "-"}
        </td>

        {/* Kolom Aksi */}
        {rowIndex === 0 &&
          (session.user.role === "admin" ? (
            <td
              className="px-6 py-4 text-center whitespace-nowrap"
              rowSpan={maxRows}
            >
              <div className="flex justify-center space-x-3">
                {/* <button
                  onClick={() => router.push(`/inventarisasi/${id}/edit/${item.id}`)}
                  className="flex px-[6px] py-1 transition duration-100 ease-in-out rounded-md bg-color5 hover:-translate-1 hover:scale-110 hover:shadow-lg"
                >
                  <MdOutlineEdit className="text-xl text-white" />
                </button> */}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex  px-[6px] py-1 transition duration-100 ease-in-out bg-red-500 rounded-md hover:-translate-1 hover:scale-110 hover:shadow-lg"
                >
                  <FaRegTrashAlt className="text-lg text-white" />
                </button>
              </div>
            </td>
          ) : null)}
      </tr>
    ));
  };

  const exportToExcel = () => {
    // Header untuk Excel dengan nama kolom yang sesuai
    const headers = {
      "NO.": "NO.",
      SPAN: "SPAN",
      "BIDANG LAHAN": "BIDANG LAHAN",
      "TANGGAL PELAKSANAAN": "TANGGAL PELAKSANAAN",
      "NAMA PEMILIK": "NAMA PEMILIK",
      NIK: "NIK",
      TTL: "TTL",
      "DESA/KELURAHAN": "DESA/KELURAHAN",
      KECAMATAN: "KECAMATAN",
      "KABUPATEN/KOTA": "KABUPATEN/KOTA",
      PEKERJAAN: "PEKERJAAN",
      "ALAS HAK": "ALAS HAK",
      "LUAS TANAH": "LUAS TANAH",
      "NAMA BANGUNAN": "NAMA BANGUNAN",
      "LUAS BANGUNAN": "LUAS BANGUNAN",
      "NAMA TANAMAN": "NAMA TANAMAN",
      PRODUKTIF: "PRODUKTIF",
      BESAR: "BESAR",
      KECIL: "KECIL",
    };

    // Mengolah data untuk Excel
    const processedData = items.flatMap((item, index) => {
      const maxRows = Math.max(
        item.jnsbangunan.length || 1,
        item.jnstanaman.length || 1
      );

      return Array.from({ length: maxRows }).map((_, rowIndex) => ({
        "NO.": index + 1,
        SPAN: item.span || "-",
        "BIDANG LAHAN": item.bidanglahan || "-",
        "TANGGAL PELAKSANAAN": item.pelaksanaan
          ? new Date(item.pelaksanaan).toLocaleDateString()
          : "-",
        "NAMA PEMILIK": item.namapemilik || "-",
        NIK: item.nik || "-",
        TTL: item.ttl || "-",
        "DESA/KELURAHAN": item.desakelurahan || "-",
        KECAMATAN: item.kecamatan || "-",
        "KABUPATEN/KOTA": item.kabupatenkota || "-",
        PEKERJAAN: item.pekerjaan || "-",
        "ALAS HAK": item.alashak || "-",
        "LUAS TANAH": item.luastanah || "-",
        "NAMA BANGUNAN":
          item.jnsbangunan[rowIndex]?.jnsbangunan.namabangunan || "-",
        "LUAS BANGUNAN":
          item.jnsbangunan[rowIndex]?.jnsbangunan.luasbangunan || "-",
        "NAMA TANAMAN":
          item.jnstanaman[rowIndex]?.jnstanaman.namatanaman || "-",
        PRODUKTIF: item.jnstanaman[rowIndex]?.jnstanaman.produktif || "-",
        BESAR: item.jnstanaman[rowIndex]?.jnstanaman.besar || "-",
        KECIL: item.jnstanaman[rowIndex]?.jnstanaman.kecil || "-",
      }));
    });

    const excelData = [headers, ...processedData];

    // Membuat workbook baru
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData, { skipHeader: true });

    // Mengatur lebar kolom
    const columnWidths = {
      A: 5, // NO.
      B: 15, // SPAN
      C: 15, // BIDANG LAHAN
      D: 20, // TANGGAL PELAKSANAAN
      E: 25, // NAMA PEMILIK
      F: 20, // NIK
      G: 20, // TTL
      H: 20, // DESA/KELURAHAN
      I: 20, // KECAMATAN
      J: 20, // KABUPATEN/KOTA
      T: 15, // PEKERJAAN
      K: 15, // ALAS HAK
      L: 15, // LUAS TANAH
      M: 25, // NAMA BANGUNAN
      N: 15, // LUAS BANGUNAN
      O: 25, // NAMA TANAMAN
      P: 15, // PRODUKTIF
      Q: 15, // BESAR
      R: 15, // KECIL
    };

    worksheet["!cols"] = Object.keys(columnWidths).map((key) => ({
      wch: columnWidths[key as keyof typeof columnWidths],
    }));

    // Style untuk header
    const headerStyle = {
      font: { bold: true, sz: 12, color: { rgb: "000000" } },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      fill: { fgColor: { rgb: "B8CCE4" } },
      border: {
        top: { style: "medium", color: { rgb: "000000" } },
        bottom: { style: "medium", color: { rgb: "000000" } },
        left: { style: "medium", color: { rgb: "000000" } },
        right: { style: "medium", color: { rgb: "000000" } },
      },
    };

    // Style untuk data
    const dataStyle = {
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };

    // Menerapkan style
    Object.keys(worksheet).forEach((cell) => {
      if (cell[0] === "!") return;

      if (cell.endsWith("1")) {
        worksheet[cell].s = headerStyle;
      } else {
        worksheet[cell].s = dataStyle;
      }
    });

    // Atur lebar kolom
    worksheet["!cols"] = Array.from({
      length: Object.keys(headers).length,
    }).map(() => ({ wch: 15 }));

    // Menambahkan worksheet ke workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Inventarisasi");

    // Menyimpan file
    XLSX.writeFile(workbook, "Data Inventarisasi.xlsx");
  };

  return (
    <div className="relative px-6 pt-32 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto"
      >
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Tabel Inventarisasi
            </h1>
            {session.user.role === "admin" ? (
              <div className="flex gap-4">
                <ExportButtonInventarisasi inventarisasiData={items} />
                <Link
                  href={`${id}/form`}
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
          <div className="overflow-x-auto bg-transparent border-2 border-gray-400 rounded-md">
            <table className="min-w-full divide-y-2 divide-gray-400">
              <thead className="bg-blue-5">
                <tr className="text-xs divide-x-2 divide-gray-400">
                  <th
                    className="left-0 px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase"
                    rowSpan={2}
                  >
                    No.
                  </th>
                  <th
                    className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase"
                    rowSpan={2}
                  >
                    Span Tower
                  </th>
                  <th
                    className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase"
                    rowSpan={2}
                  >
                    No. Bidang Lahan
                  </th>
                  <th
                    className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase"
                    rowSpan={2}
                  >
                    Formulir
                  </th>
                  <th
                    className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase"
                    rowSpan={2}
                  >
                    Tanggal Pelaksanaan
                  </th>
                  <th
                    className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase"
                    colSpan={7}
                  >
                    Rincian Pemilik
                  </th>
                  <th
                    className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase"
                    colSpan={2}
                  >
                    Rincian Tanah
                  </th>
                  <th
                    className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase"
                    colSpan={2}
                  >
                    Rincian Bangunan
                  </th>
                  <th
                    className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase"
                    colSpan={4}
                  >
                    Rincian Tanaman
                  </th>
                  {session.user.role === "admin" ? (
                    <th
                      className="right-0 px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase bg-gray-50"
                      rowSpan={2}
                    >
                      Aksi
                    </th>
                  ) : null}
                </tr>
                <tr className="text-xs border-t-2 border-gray-400 divide-x-2 divide-gray-400">
                  <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase border-l-2 border-gray-400">
                    Nama Pemilik
                  </th>
                  <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                    NIK
                  </th>
                  <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                    TTL
                  </th>
                  <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                    Desa/Kelurahan
                  </th>
                  <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                    Kecamatan
                  </th>
                  <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                    Kabupaten/Kota
                  </th>
                  <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                    Pekerjaan
                  </th>
                  <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                    Luas Tanah
                  </th>
                  <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                    Alas Hak
                  </th>
                  <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                    Jenis Bangunan
                  </th>
                  <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                    Luas Bangunan
                  </th>
                  <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                    Jenis Tanaman
                  </th>
                  <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                    Produktif
                  </th>
                  <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                    Besar
                  </th>
                  <th className="px-6 py-3 font-semibold tracking-wider text-center text-gray-700 uppercase">
                    Kecil
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-400">
                {currentItems.map((item, index) => renderTableRow(item, index))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mx-8 mt-8">
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </motion.div>

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
              HAPUS DATA?
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

export default TabelInventarisasi;
