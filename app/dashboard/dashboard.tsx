"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import * as XLSX from "xlsx";
import "./globals.css";
import { item } from "@prisma/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";

export const Dashboard = () => {
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
  const [passwordError, setPasswordError] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

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
  const totalPages = Math.ceil(items.length / itemsPerPage);

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
          setItems(items.filter(item => item.id !== itemToDelete));
          setShowConfirmDelete(false);
          setItemToDelete(null);
        } else {
          alert("Gagal menghapus data");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Gagal menghapus data");
      }
    }
  };

  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 ">
          <h1 className="text-2xl font-bold text-gray-800">
            Daftar Proyek ROW
          </h1>
          <div className="space-x-4">
            <button
              onClick={exportToExcel}
              className="transition ease-in-out duration-200 bg-green-1 hover:-translate-1 hover:scale-110 hover:bg-green-2 text-white px-4 py-2 rounded-xl"
            >
              <div className="ml-auto flex items-center space-x-4 font-semibold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="20px"
                  height="20px"
                  fill="white"
                >
                  <path d="M 24.607422 4.0429688 C 24.347041 4.0335549 24.0813 4.0541387 23.814453 4.1074219 L 8.6171875 7.1464844 C 6.5228355 7.5659519 5 9.4229991 5 11.558594 L 5 36.441406 C 5 38.576376 6.5230144 40.434668 8.6171875 40.853516 L 23.814453 43.892578 C 25.758786 44.281191 27.556602 42.890921 27.875 41 L 37.5 41 C 40.519774 41 43 38.519774 43 35.5 L 43 13.5 C 43 10.480226 40.519774 8 37.5 8 L 28 8 L 28 7.5390625 C 28 5.6340003 26.430086 4.1088659 24.607422 4.0429688 z M 24.402344 7.0488281 C 24.741566 6.9810934 25 7.1922764 25 7.5390625 L 25 40.460938 C 25 40.807724 24.741273 41.019122 24.402344 40.951172 A 1.50015 1.50015 0 0 0 24.402344 40.949219 L 9.2070312 37.910156 A 1.50015 1.50015 0 0 0 9.2050781 37.910156 C 8.4941947 37.768284 8 37.165812 8 36.441406 L 8 11.558594 C 8 10.834188 8.4953832 10.230423 9.2070312 10.087891 L 24.402344 7.0488281 z M 28 11 L 37.5 11 C 38.898226 11 40 12.101774 40 13.5 L 40 35.5 C 40 36.898226 38.898226 38 37.5 38 L 28 38 L 28 11 z M 31.5 15 A 1.50015 1.50015 0 1 0 31.5 18 L 35.5 18 A 1.50015 1.50015 0 1 0 35.5 15 L 31.5 15 z M 12.998047 17.158203 C 12.709209 17.150498 12.414094 17.226453 12.152344 17.392578 C 11.454344 17.837578 11.249359 18.763891 11.693359 19.462891 L 14.681641 24.158203 L 11.693359 28.853516 C 11.249359 29.552516 11.454344 30.478828 12.152344 30.923828 C 12.402344 31.081828 12.681031 31.158203 12.957031 31.158203 C 13.452031 31.158203 13.938609 30.913844 14.224609 30.464844 L 16.458984 26.953125 L 18.693359 30.462891 C 18.980359 30.911891 19.465937 31.158203 19.960938 31.158203 C 20.236938 31.158203 20.513672 31.083828 20.763672 30.923828 C 21.461672 30.478828 21.668609 29.550563 21.224609 28.851562 L 18.238281 24.158203 L 21.224609 19.464844 C 21.668609 18.765844 21.461672 17.837578 20.763672 17.392578 C 20.066672 16.948578 19.139359 17.153516 18.693359 17.853516 L 16.458984 21.363281 L 14.224609 17.851562 C 13.946484 17.414062 13.479443 17.171045 12.998047 17.158203 z M 31.5 23 A 1.50015 1.50015 0 1 0 31.5 26 L 35.5 26 A 1.50015 1.50015 0 1 0 35.5 23 L 31.5 23 z M 31.5 31 A 1.50015 1.50015 0 1 0 31.5 34 L 35.5 34 A 1.50015 1.50015 0 1 0 35.5 31 L 31.5 31 z" />
                </svg>
                EXPORT
              </div>
            </button>
            <button
              onClick={() => router.push("/dashboard/form")}
              className="transition ease-in-out duration-200 bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3 text-white px-4 py-2 rounded-xl"
            >
              <div className="ml-auto flex items-center space-x-4 font-semibold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="white"
                >
                  <path d="M444-288h72v-156h156v-72H516v-156h-72v156H288v72h156v156Zm36.28 192Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Zm-.28-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z" />
                </svg>
                ADD PROJECT
              </div>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-transparent rounded-md border-2 border-gray-400">
          <div className="overflow-x-auto rounded">
            <table className="min-w-full divide-y-2 divide-gray-400">
              <thead className="bg-gray-50">
                <tr className="divide-x-2 divide-gray-400 text-xs">
                  <th className="px-6 py-3 text-center text-gray-500 uppercase tracking-wider font-semibold">
                    No.
                  </th>
                  <th className="px-6 py-3 text-center text-gray-500 uppercase tracking-wider font-semibold">
                    Nama Proyek
                  </th>
                  <th className="px-6 py-3 text-center text-gray-500 uppercase tracking-wider font-semibold">
                    Nomor Kontrak
                  </th>
                  <th className="px-6 py-3 text-center text-gray-500 uppercase tracking-wider font-semibold">
                    Kode Proyek
                  </th>
                  <th className="px-6 py-3 text-center text-gray-500 uppercase tracking-wider font-semibold">
                    Tanggal Kontrak
                  </th>
                  <th className="px-6 py-3 text-center text-gray-500 uppercase tracking-wider font-semibold">
                    Tanggal Berakhir Kontrak
                  </th>
                  <th className="px-6 py-3 text-center text-gray-500 uppercase tracking-wider font-semibold">
                    Aksi
                  </th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-center align-middle">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-center">
                      <button
                        onClick={() => handleProjectClick(item.id)}
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
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {item.nomorkontrak || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {item.kodeproyek || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {item.tanggalkontrak
                        ? new Date(item.tanggalkontrak).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {item.tanggalakhirkontrak
                        ? new Date(
                            item.tanggalakhirkontrak
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
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
                          <FaRegTrashAlt className="text-lg text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
      </div>

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Masukkan Password Proyek</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
              placeholder="Password"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handlePasswordSubmit();
                }
              }}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mb-4">{passwordError}</p>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="mt-2 transition ease-in-out duration-200 bg-white hover:-translate-1 hover:scale-110 hover:bg-gray-200 duration-300 px-4 py-2 text-gray-500 border-2 border-gray-500 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="mt-2 transition ease-in-out duration-200 bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3 text-white px-4 py-2 rounded-xl font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-red-500">KONFIRMASI HAPUS</h2>
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
          </div>
        </div>
      )}
    </div>
  );
};
