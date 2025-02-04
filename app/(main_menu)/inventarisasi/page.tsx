"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaRegTrashAlt, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";
import { MdOutlineEdit } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useAlert } from "@/app/_context/AlertContext";
import LoadingIndicator from "@/app/_components/LoadingIndicator";

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
  bibit: string;
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
  jnsbangunan: inventbangunan[];
  jnstanaman: inventtanaman[];
};

export default function Invent() {
  const router = useRouter();
  const [items, setItems] = useState<inventarisasi[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/invents");
      const data = await response.json();
      
      // Urutkan berdasarkan ID secara descending
      const sortedItems = data.sort((a: inventarisasi, b: inventarisasi) => b.id - a.id);
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
    if (deleteId) {
      try {
        const response = await fetch(`/api/invents/${deleteId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await fetchItems();
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
  const totalPages = Math.ceil(items.length / itemsPerPage);

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
              className="px-6 py-4 whitespace-nowrap text-center"
              rowSpan={maxRows}
            >
              {indexOfFirstItem + index + 1}
            </td>
            <td
              className="px-6 py-4 whitespace-nowrap text-center"
              rowSpan={maxRows}
            >
              {item.span || "-"}
            </td>
            <td
              className="px-6 py-4 whitespace-nowrap text-center"
              rowSpan={maxRows}
            >
              {item.bidanglahan || "-"}
            </td>
            <td
              className="px-6 py-4 whitespace-nowrap text-center"
              rowSpan={maxRows}
            >
              {item.formulir ? (
                <button
                  onClick={() => handleViewFormulir(item.id)}
                  className="px-3 py-1 bg-blue-2 text-white rounded-md hover:bg-blue-3 transition-colors duration-200"
                >
                  Lihat Formulir
                </button>
              ) : (
                "-"
              )}
            </td>
            <td
              className="px-6 py-4 whitespace-nowrap text-center"
              rowSpan={maxRows}
            >
              {item.pelaksanaan
                ? new Date(item.pelaksanaan).toLocaleDateString()
                : "-"}
            </td>
            <td
              className="px-6 py-4 whitespace-nowrap text-center"
              rowSpan={maxRows}
            >
              {item.namapemilik || "-"}
            </td>
            <td
              className="px-6 py-4 whitespace-nowrap text-center"
              rowSpan={maxRows}
            >
              {item.nik || "-"}
            </td>
            <td
              className="px-6 py-4 whitespace-nowrap text-center"
              rowSpan={maxRows}
            >
              {item.ttl || "-"}
            </td>
            <td
              className="px-6 py-4 whitespace-nowrap text-center"
              rowSpan={maxRows}
            >
              {item.desakelurahan || "-"}
            </td>
            <td
              className="px-6 py-4 whitespace-nowrap text-center"
              rowSpan={maxRows}
            >
              {item.kecamatan || "-"}
            </td>
            <td
              className="px-6 py-4 whitespace-nowrap text-center"
              rowSpan={maxRows}
            >
              {item.kabupatenkota || "-"}
            </td>
            <td
              className="px-6 py-4 whitespace-nowrap text-center"
              rowSpan={maxRows}
            >
              {item.alashak || "-"}
            </td>
            <td
              className="px-6 py-4 whitespace-nowrap text-center"
              rowSpan={maxRows}
            >
              {item.luastanah || "-"}
            </td>
          </>
        )}

        {/* Kolom Jenis Bangunan */}
        <td className="px-6 py-4 whitespace-nowrap text-center border-l-2 border-gray-400">
          {item.jnsbangunan[rowIndex]?.jnsbangunan.namabangunan || "-"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-center">
          {item.jnsbangunan[rowIndex]?.jnsbangunan.luasbangunan || "-"}
        </td>

        {/* Kolom Jenis Tanaman */}
        <td className="px-6 py-4 whitespace-nowrap text-center">
          {item.jnstanaman[rowIndex]?.jnstanaman.namatanaman || "-"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-center">
          {item.jnstanaman[rowIndex]?.jnstanaman.produktif || "-"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-center">
          {item.jnstanaman[rowIndex]?.jnstanaman.besar || "-"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-center">
          {item.jnstanaman[rowIndex]?.jnstanaman.kecil || "-"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-center">
          {item.jnstanaman[rowIndex]?.jnstanaman.bibit || "-"}
        </td>

        {/* Kolom Aksi */}
        {rowIndex === 0 && (
          <td
            className="px-6 py-4 whitespace-nowrap text-center"
            rowSpan={maxRows}
          >
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => router.push(`/inventarisasi/edit/${item.id}`)}
                className="flex px-[6px] py-1 transition duration-100 ease-in-out rounded-md bg-color5 hover:-translate-1 hover:scale-110 hover:shadow-lg"
              >
                <MdOutlineEdit className="text-xl text-white" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="flex  px-[6px] py-1 transition duration-100 ease-in-out bg-red-500 rounded-md hover:-translate-1 hover:scale-110 hover:shadow-lg"
              >
                <FaRegTrashAlt className="text-lg text-white" />
              </button>
            </div>
          </td>
        )}
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
      "ALAS HAK": "ALAS HAK",
      "LUAS TANAH": "LUAS TANAH",
      "NAMA BANGUNAN": "NAMA BANGUNAN",
      "LUAS BANGUNAN": "LUAS BANGUNAN",
      "NAMA TANAMAN": "NAMA TANAMAN",
      PRODUKTIF: "PRODUKTIF",
      BESAR: "BESAR",
      KECIL: "KECIL",
      BIBIT: "BIBIT",
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
        BIBIT: item.jnstanaman[rowIndex]?.jnstanaman.bibit || "-",
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
      K: 15, // ALAS HAK
      L: 15, // LUAS TANAH
      M: 25, // NAMA BANGUNAN
      N: 15, // LUAS BANGUNAN
      O: 25, // NAMA TANAMAN
      P: 15, // PRODUKTIF
      Q: 15, // BESAR
      R: 15, // KECIL
      S: 15, // BIBIT
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
        {/* Header dengan tombol Export dan Add Project */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Tabel Inventarisasi
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={exportToExcel}
              className="transition ease-in-out duration-200 bg-green-600 hover:-translate-1 hover:scale-110 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
            >
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
                <span>Export</span>
              </div>
            </button>
            <button
              onClick={() => router.push("/inventarisasi/form")}
              className="transition ease-in-out duration-200 bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3 text-white px-4 py-2 rounded-xl"
            >
              <div className="flex items-center ml-auto space-x-3 text-sm font-semibold uppercase">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="22px"
                  viewBox="0 -960 960 960"
                  width="22px"
                  fill="white"
                >
                  <path d="M444-288h72v-156h156v-72H516v-156h-72v156H288v72h156v156Zm36.28 192Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Zm0-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z" />
                </svg>
                <span>Add Data</span>
              </div>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-transparent rounded-md border-2 border-gray-400 overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-gray-400">
            <thead className="bg-blue-5">
              <tr className="divide-x-2 divide-gray-400 text-xs">
                <th
                  className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold left-0"
                  rowSpan={2}
                >
                  No.
                </th>
                <th
                  className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold"
                  rowSpan={2}
                >
                  Span Tower
                </th>
                <th
                  className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold"
                  rowSpan={2}
                >
                  No. Bidang Lahan
                </th>
                <th
                  className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold"
                  rowSpan={2}
                >
                  Formulir
                </th>
                <th
                  className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold"
                  rowSpan={2}
                >
                  Tanggal Pelaksanaan
                </th>
                <th
                  className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold"
                  colSpan={6}
                >
                  Rincian Pemilik
                </th>
                <th
                  className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold"
                  colSpan={2}
                >
                  Rincian Tanah
                </th>
                <th
                  className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold"
                  colSpan={2}
                >
                  Rincian Bangunan
                </th>
                <th
                  className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold"
                  colSpan={5}
                >
                  Rincian Tanaman
                </th>

                <th
                  className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold right-0 bg-gray-50"
                  rowSpan={2}
                >
                  Aksi
                </th>
              </tr>
              <tr className="divide-x-2 divide-gray-400 text-xs border-t-2 border-gray-400">
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold border-l-2 border-gray-400">
                  Nama Pemilik
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  NIK
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  TTL
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  Desa/Kelurahan
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  Kecamatan
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  Kabupaten/Kota
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  Alas Hak
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  Luas Tanah
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  Jenis Bangunan
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  Luas Bangunan
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  Jenis Tanaman
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  Produktif
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  Besar
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  Kecil
                </th>
                <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider font-semibold">
                  Bibit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-400">
              {currentItems.map((item, index) => renderTableRow(item, index))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-2 text-white hover:bg-blue-3"
            }`}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-3 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-2 text-white hover:bg-blue-3"
            }`}
          >
            Next
          </button>
        </div>
      </motion.div>

      {/* Pop-up Konfirmasi Hapus */}
      {showConfirmDelete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
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
}
