"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
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

interface FormData {
  itemId: string;
  identifikasiId: string;
  tanggalPelaksanaan: string;
  keterangan: string;
  beritaAcara: File | null;
  daftarHadir: File | null;
  evidence: File[];
}

interface EvidenceInput {
  file: File | null;
}

const FormSosialisasi = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const { showAlert } = useAlert();
  const { id } = useParams();

  console.log(id);

  const [formData, setFormData] = useState<FormData>({
    itemId: "",
    identifikasiId: "",
    tanggalPelaksanaan: "",
    keterangan: "",
    beritaAcara: null,
    daftarHadir: null,
    evidence: [],
  });

  // Tambahkan state untuk error
  const [formErrors, setFormErrors] = useState({
    identifikasiId: "",
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
    const savedData = localStorage.getItem("sosialisasiFormData");
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
    localStorage.removeItem("sosialisasiFormData");
    router.push(`/sosialisasi/${id}`); // ✅ Arahkan ke halaman yang benar sesuai dengan ID
  };

  const [identifikasiList, setIdentifikasiList] = useState<Identifikasi[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceInput[]>([
    { file: null },
  ]);

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
      const response = await fetch(`/api/identifikasi/${value}`);
      if (!response.ok) throw new Error("Failed to fetch location data");

      const locationData = await response.json();
      setSelectedLocation(locationData);

      const newFormData = {
        ...formData,
        identifikasiId: value,
        itemId: locationData.itemId, // Ambil itemId dari identifikasi
      };
      setFormData(newFormData);
    } catch (error) {
      console.error("Error:", error);
      showAlert("Gagal mengambil data lokasi", "error");
    }
  };

  useEffect(() => {
    const fetchIdentifikasi = async () => {
      try {
        console.log("Fetching identifikasi for itemId:", id); // ✅ Debugging

        const response = await fetch(`/api/identifikasi/${id}`);
        console.log("Response status:", response); // ✅ Debugging

        if (!response.ok) {
          const errorText = await response.text(); // ✅ Dapatkan error lebih detail
          throw new Error(
            `HTTP error! Status: ${response.status}, Message: ${errorText}`
          );
        }

        const data = await response.json();
        console.log("Identifikasi data:", data); // ✅ Debugging
        setIdentifikasiList(data);
      } catch (error) {
        console.error("Error fetching identifikasi:", error); // ✅ Debugging
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

    // Reset error messages
    setFormErrors({
      identifikasiId: "",
      tanggalPelaksanaan: "",
      keterangan: "",
    });

    // Validasi form
    let hasError = false;
    const newErrors = {
      identifikasiId: "",
      tanggalPelaksanaan: "",
      keterangan: "",
    };

    if (!formData.identifikasiId) {
      newErrors.identifikasiId = "Lokasi wajib diisi!";
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
      formDataToSend.append("itemId", formData.itemId); // Tambahkan itemId
      formDataToSend.append("tanggalPelaksanaan", formData.tanggalPelaksanaan);
      formDataToSend.append("keterangan", formData.keterangan);

      if (formData.beritaAcara) {
        formDataToSend.append("beritaAcara", formData.beritaAcara);
      }

      if (formData.daftarHadir) {
        formDataToSend.append("daftarHadir", formData.daftarHadir);
      }

      evidenceList.forEach((evidence, index) => {
        if (evidence.file) {
          formDataToSend.append(`evidence`, evidence.file);
        }
      });

      const response = await fetch("/api/sosialisasi", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      localStorage.removeItem("sosialisasiFormData");
      setShowSuccessPopup(true);
      setTimeout(() => {
        router.push("/sosialisasi");
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
              <h2 className="text-xl font-bold">Form Sosialisasi</h2>
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
                    <option value="">Pilih lokasi...</option>
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
                  Berita Acara
                </label>
                <div className="flex items-center w-8/12 mr-3">
                  <input
                    type="file"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        beritaAcara: e.target.files?.[0] || null,
                      })
                    }
                    className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept=".pdf"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between row">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Daftar Hadir
                </label>
                <div className="flex items-center w-8/12 mr-3">
                  <input
                    type="file"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        daftarHadir: e.target.files?.[0] || null,
                      })
                    }
                    className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept=".pdf"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-b row">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Evidence
                </label>
                <div className="w-8/12 mr-3">
                  {evidenceList.map((evidence, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="file"
                        onChange={(e) =>
                          handleEvidenceChange(
                            index,
                            e.target.files?.[0] || null
                          )
                        }
                        className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        accept="image/*"
                      />
                      {index === 0 ? (
                        <button
                          type="button"
                          onClick={() =>
                            setEvidenceList([...evidenceList, { file: null }])
                          }
                          className="ml-4 text-3xl"
                        >
                          <MdAddCircleOutline className="text-color3" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const newList = evidenceList.filter(
                              (_, i) => i !== index
                            );
                            setEvidenceList(newList);
                          }}
                          className="ml-4 text-3xl"
                        >
                          <MdRemoveCircleOutline className="text-red-500" />
                        </button>
                      )}
                    </div>
                  ))}
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
  );
};

export default FormSosialisasi;
