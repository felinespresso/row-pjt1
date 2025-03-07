"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft, FaRegTrashAlt } from "react-icons/fa";
import Link from "next/link";
import "./globals.css";
import { useAlert } from "@/app/_contexts/AlertContext";
import { MdAddCircleOutline, MdRemoveCircleOutline } from "react-icons/md";
import SuccessPopup from "@/app/_components/SuccessPopup";
import SaveLoading from "@/app/_components/SaveLoading";

interface Identifikasi {
  id: string;
  namadesa: string;
  spantower: string;
}

interface Evidence {
  id: string;
  bidangLahan: string;
  namaPemilik: string;
}

interface FormData {
  identifikasiId: string;
  bidangLahanId: string;
  tanggalPelaksanaan: string;
  keterangan: string;
  ktp: File | null;
  kartukeluarga: File | null;
  alashak: File | null;
}

interface EvidenceInput {
  file: File | null;
}

const ForPemberkasan = ({ session }: { session: any }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const { showAlert } = useAlert();
  const { id } = useParams();

  const [formData, setFormData] = useState<FormData>({
    identifikasiId: "",
    bidangLahanId: "",
    tanggalPelaksanaan: "",
    keterangan: "",
    ktp: null,
    kartukeluarga: null,
    alashak: null,
  });

  // Tambahkan state untuk error
  const [formErrors, setFormErrors] = useState({
    identifikasiId: "",
    bidangLahanId: "",
    tanggalPelaksanaan: "",
    keterangan: "",
  });

  // Tambahkan state untuk menyimpan nama desa dan span tower yang terpilih
  const [selectedLocation, setSelectedLocation] = useState<{
    id: string;
    namadesa: string;
    spantower: string;
  } | null>(null);

  // Tambahkan useEffect untuk memulihkan data dari localStorage
  useEffect(() => {
    setIsClient(true);
    const savedData = localStorage.getItem("pemberkasanFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData((prev) => ({
        ...prev,
        identifikasiId: parsedData.identifikasiId || "",
        tanggalPelaksanaan: parsedData.tanggalPelaksanaan || "",
        keterangan: parsedData.keterangan || "",
      }));

      if (parsedData.selectedLocation) {
        setSelectedLocation(parsedData.selectedLocation);
      }
    }
  }, []);

  // Update handler untuk tombol cancel
  const handleCancel = () => {
    localStorage.removeItem("pemberkasanFormData");
    router.push(`/pemberkasan/${id}`);
  };

  const [identifikasiList, setIdentifikasiList] = useState<Identifikasi[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceInput[]>([
    { file: null },
  ]);

  const [bidangLahanList, setBidangLahanList] = useState<Evidence[]>([]);
  const [selectedNamaPemilik, setSelectedNamaPemilik] = useState("");

  // Tambahkan ref untuk combobox
  const comboboxRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Tambahkan state untuk pencarian
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data berdasarkan pencarian
  const filteredOptions = identifikasiList.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.namadesa.toLowerCase().includes(search) ||
      item.spantower.toLowerCase().includes(search)
    );
  });

  // Update handler untuk mengubah lokasi
  const handleLocationChange = async (value: string) => {
    try {
      const newFormData = {
        ...formData,
        identifikasiId: value,
        bidangLahanId: "",
        itemd: id,
      };
      setFormData(newFormData);

      const selected = identifikasiList.find((item) => item.id === value);
      if (!selected) {
        throw new Error("Lokasi tidak ditemukan");
      }

      setFormData((prev) => ({
        ...prev,
        identifikasiId: value,
      }));

      setSelectedLocation(selected);

      const response = await fetch(`/api/pemberkasan?identifikasiId=${value}`);
      if (!response.ok) throw new Error("Gagal mengambil data bidang lahan");

      const data = await response.json();
      setBidangLahanList(data);
    } catch (error) {
      console.error("Error fetching bidang lahan:", error);
      showAlert("Gagal mengambil data bidang lahan", "error");
    }
  };

  const handleBidangLahanChange = (value: string) => {
    setFormData({ ...formData, bidangLahanId: value });

    const selectedEvidence = bidangLahanList.find((item) => item.id === value);
    setSelectedNamaPemilik(selectedEvidence?.namaPemilik || "");
  };

  useEffect(() => {
    const fetchIdentifikasi = async () => {
      try {
        const response = await fetch(`/api/identifikasi/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setIdentifikasiList(data);
      } catch (error) {
        console.error("Error fetching identifikasi:", error);
      }
    };

    const initializeForm = async () => {
      try {
        await fetchIdentifikasi();
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };
    initializeForm();
  }, []);

  const handleEvidenceChange = (index: number, file: File | null) => {
    const newList = [...evidenceList];
    newList[index].file = file;
    setEvidenceList(newList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormErrors({
      identifikasiId: "",
      bidangLahanId: "",
      tanggalPelaksanaan: "",
      keterangan: "",
    });

    let hasError = false;
    const newErrors = {
      identifikasiId: "",
      bidangLahanId: "",
      tanggalPelaksanaan: "",
      keterangan: "",
    };

    if (!formData.identifikasiId) {
      newErrors.identifikasiId = "Lokasi wajib diisi!";
      hasError = true;
    }

    if (!formData.bidangLahanId) {
      newErrors.bidangLahanId = "Bidang lahan wajib diisi!";
      hasError = true;
    }

    if (!formData.tanggalPelaksanaan) {
      newErrors.tanggalPelaksanaan = "Tanggal pelaksanaan wajib diisi!";
      hasError = true;
    }

    if (!formData.keterangan) {
      newErrors.keterangan = "Keterangan wajib diisi!";
      hasError = true;
    }

    if (hasError) {
      setFormErrors(newErrors);
      showAlert("Mohon isi semua form yang wajib diisi!", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("identifikasiId", formData.identifikasiId);
      formDataToSend.append("bidangLahanId", formData.bidangLahanId);
      formDataToSend.append("tanggalPelaksanaan", formData.tanggalPelaksanaan);
      formDataToSend.append("keterangan", formData.keterangan);

      if (formData.ktp) {
        formDataToSend.append("ktp", formData.ktp);
      }

      if (formData.kartukeluarga) {
        formDataToSend.append("kartukeluarga", formData.kartukeluarga);
      }
      
      if (formData.alashak) {
        formDataToSend.append("alashak", formData.alashak);
      }

      const response = await fetch("/api/pemberkasan", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan data");
      }

      setShowSuccessPopup(true);
      setTimeout(() => {
        router.push(`/pemberkasan/${id}`);
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      showAlert("Gagal menyimpan data", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
      {isSubmitting && <SaveLoading />}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="p-6 mb-6 bg-white rounded-lg shadow-lg"
      >
          <form onSubmit={handleSubmit}>
            <div className="pt-2 bg-transparent border-2 border-gray-400 rounded-md">
              <div className="flex items-center justify-between px-4 m-4">
                <h2 className="text-xl font-bold">Form Pemberkasan</h2>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
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
              <hr className="border border-gray-400" />

              <div>
                <div className="flex items-center justify-between mb-2 row">
                  <label className="block ml-3 text-sm font-semibold text-black">
                    Lokasi
                  </label>
                  <div className="w-8/12 mr-3">
                    <select
                      className={`w-full p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400 ${
                        formErrors.identifikasiId
                          ? "border-red-500"
                          : "border-gray-400"
                      }`}
                      value={formData.identifikasiId}
                      onChange={(e) => handleLocationChange(e.target.value)}
                    >
                      {!formData.identifikasiId && (
                        <option value="">Pilih lokasi...</option>
                      )}
                      {identifikasiList.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.namadesa} - {item.spantower}
                        </option>
                      ))}
                    </select>
                    {formErrors.identifikasiId && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.identifikasiId}
                      </p>
                    )}
                    <div className="flex justify-between mt-2">
                      {/* Tampilkan nama desa di sebelah kiri */}
                      {selectedLocation && (
                        <p className="text-gray-600">
                          Desa: {selectedLocation.namadesa}
                        </p>
                      )}
                      {/* Tampilkan span tower di sebelah kanan */}
                      {selectedLocation && (
                        <p className="text-gray-600">
                          Span Tower: {selectedLocation.spantower}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2 row">
                  <label className="block ml-3 text-sm font-semibold text-black">
                    Nomor Bidang
                  </label>
                  <div className="w-8/12 mr-3">
                    <select
                      className={`w-full p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400 ${
                        formErrors.bidangLahanId
                          ? "border-red-500"
                          : "border-gray-400"
                      }`}
                      value={formData.bidangLahanId}
                      onChange={(e) => handleBidangLahanChange(e.target.value)}
                    >
                      {!formData.bidangLahanId && (
                        <option value="">Pilih bidang...</option>
                      )}
                      {bidangLahanList.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.bidangLahan}
                        </option>
                      ))}
                    </select>
                    {formErrors.bidangLahanId && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.bidangLahanId}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2 row">
                  <label className="block ml-3 text-sm font-semibold text-black">
                    Nama Pemilik
                  </label>
                  <div className="w-8/12 mr-3">
                    <input
                      type="text"
                      value={selectedNamaPemilik}
                      readOnly
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
                      className={`w-full p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400 ${
                        formErrors.tanggalPelaksanaan
                          ? "border-red-500"
                          : "border-gray-400"
                      }`}
                    />
                    {formErrors.tanggalPelaksanaan && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.tanggalPelaksanaan}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between row">
                  <label className="block ml-3 text-sm font-semibold text-black">
                    Keterangan
                  </label>
                  <div className="w-8/12 mr-3">
                    <input
                      type="text"
                      placeholder="Masukkan keterangan"
                      value={formData.keterangan}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          keterangan: e.target.value,
                        })
                      }
                      className={`w-full p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400 ${
                        formErrors.keterangan
                          ? "border-red-500"
                          : "border-gray-400"
                      }`}
                    />
                    {formErrors.keterangan && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.keterangan}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between row">
                  <label className="block ml-3 text-sm font-semibold text-black">
                    KTP
                  </label>
                  <div className="flex items-center w-8/12 mr-3">
                    <input
                      type="file"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ktp: e.target.files?.[0] || null,
                        })
                      }
                      className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept=".pdf"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between row">
                  <label className="block ml-3 text-sm font-semibold text-black">
                    Kartu Keluarga
                  </label>
                  <div className="flex items-center w-8/12 mr-3">
                    <input
                      type="file"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kartukeluarga: e.target.files?.[0] || null,
                        })
                      }
                      className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept=".pdf"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between row">
                  <label className="block ml-3 text-sm font-semibold text-black">
                    Alas Hak
                  </label>
                  <div className="flex items-center w-8/12 mr-3">
                    <input
                      type="file"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          alashak: e.target.files?.[0] || null,
                        })
                      }
                      className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept=".pdf"
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
          <Link href={`/pemberkasan/${id}`}>
            <button className="flex items-center gap-2 text-blue-3 hover:text-blue-4">
              <FaArrowLeft /> Kembali
            </button>
          </Link>
          <p className="flex items-center justify-center py-48 m-4 text-2xl font-bold text-center text-gray-500">
            404 | HALAMAN TIDAK DITEMUKAN
          </p>
        </div>
      )}
    </div>
  );
};

export default ForPemberkasan;
