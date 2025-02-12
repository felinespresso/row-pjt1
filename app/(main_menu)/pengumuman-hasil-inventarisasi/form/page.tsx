"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  identifikasiId: string;
  tanggalPelaksanaan: string;
  keterangan: string;
  beritaAcara: File | null;
  evidence: File[];
}

interface EvidenceInput {
  file: File | null;
}

const FormPengumuman = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    identifikasiId: "",
    tanggalPelaksanaan: "",
    keterangan: "",
    beritaAcara: null,
    evidence: [],
  });
  const [identifikasiList, setIdentifikasiList] = useState<Identifikasi[]>([]);
  const { showAlert } = useAlert();
  const [evidenceList, setEvidenceList] = useState<EvidenceInput[]>([
    { file: null },
  ]);

  // Tambahkan state untuk error
  const [formErrors, setFormErrors] = useState({
    identifikasiId: "",
    tanggalPelaksanaan: "",
  });

  // Tambahkan state untuk menyimpan nama desa dan span tower yang terpilih
  const [selectedLocation, setSelectedLocation] = useState<{
    id: string;
    namadesa: string;
    spantower: string;
  } | null>(null);

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
      };
      setFormData(newFormData);

      // Simpan ke localStorage
      localStorage.setItem(
        "pengumumanFormData",
        JSON.stringify({
          ...newFormData,
          selectedLocation: locationData,
        })
      );
    } catch (error) {
      console.error("Error:", error);
      showAlert("Gagal mengambil data lokasi", "error");
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("identifikasiId", formData.identifikasiId);
      formDataToSend.append("tanggalPelaksanaan", formData.tanggalPelaksanaan);
      formDataToSend.append("keterangan", formData.keterangan);

      // Berita Acara
      if (formData.beritaAcara) {
        formDataToSend.append("beritaAcara", formData.beritaAcara);
      }

      // Evidence (Revisi Bagian Ini)
      evidenceList.forEach((evidence, index) => {
        if (evidence.file) {
          formDataToSend.append(`evidence`, evidence.file);
        }
      });

      const response = await fetch("/api/pengumuman", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setShowSuccessPopup(true);
      setTimeout(() => {
        router.push("/pengumuman-hasil-inventarisasi");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      showAlert("Gagal menyimpan data. Silakan coba lagi.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEvidenceChange = (index: number, file: File | null) => {
    const newList = [...evidenceList];
    newList[index].file = file;
    setEvidenceList(newList);
  };

  const addNewEvidenceField = () => {
    setEvidenceList([...evidenceList, { file: null }]);
  };

  const removeEvidenceField = (index: number) => {
    setEvidenceList(evidenceList.filter((_, i) => i !== index));
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
          <div className="bg-transparent border-2 border-gray-400 rounded-md">
            <div className="flex items-center justify-between m-4">
              <h2 className="text-xl font-bold">
                Form Pengumuman Hasil Inventarisasi
              </h2>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push("/pengumuman-hasil-inventarisasi")}
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

              <div className="flex items-center justify-between row">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Tanggal Pelaksanaan
                </label>
                <div className="flex items-center w-8/12 mr-3">
                  <input
                    type="date"
                    value={formData.tanggalPelaksanaan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tanggalPelaksanaan: e.target.value,
                      })
                    }
                    className="flex-1 p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between row">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Keterangan
                </label>
                <div className="flex items-center w-8/12 mr-3">
                  <input
                    type="text"
                    value={formData.keterangan}
                    onChange={(e) =>
                      setFormData({ ...formData, keterangan: e.target.value })
                    }
                    className="flex-1 p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                    placeholder="Masukkan keterangan"
                  />
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

export default FormPengumuman;
