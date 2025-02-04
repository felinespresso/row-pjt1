"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import "./globals.css";
import { MdAddCircleOutline, MdRemoveCircleOutline } from "react-icons/md";

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
  
  // State dasar tanpa localStorage
  const [formData, setFormData] = useState<FormData>({
    identifikasiId: "",
    tanggalPelaksanaan: "",
    keterangan: "",
    beritaAcara: null,
    daftarHadir: null,
    evidence: [],
  });

  // Pindahkan localStorage ke useEffect
  useEffect(() => {
    setIsClient(true);
    const savedData = localStorage.getItem('sosialisasiFormData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(prev => ({
        ...prev,
        identifikasiId: parsedData?.identifikasiId || "",
        tanggalPelaksanaan: parsedData?.tanggalPelaksanaan || "",
        keterangan: parsedData?.keterangan || "",
      }));
    }
  }, []);

  // Update handler untuk tombol cancel
  const handleCancel = () => {
    localStorage.removeItem('sosialisasiFormData');
    router.push("/sosialisasi");
  };

  const [identifikasiList, setIdentifikasiList] = useState<Identifikasi[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceInput[]>([{ file: null }]);

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

  // Handler untuk mengubah nilai pencarian dan identifikasiId
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "search") {
      // Jika yang dipilih adalah opsi pencarian, jangan update formData
      return;
    }
    setFormData({
      ...formData,
      identifikasiId: value
    });
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

    fetchIdentifikasi();
  }, []);

  const handleEvidenceChange = (index: number, file: File | null) => {
    const newList = [...evidenceList];
    newList[index].file = file;
    setEvidenceList(newList);
  };

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

      localStorage.removeItem('sosialisasiFormData');
      router.push("/sosialisasi");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
      >
        <form onSubmit={handleSubmit}>
          <div className="bg-transparent rounded-md border-2 border-gray-400">
            <div className="flex justify-between items-center m-4">
              <h2 className="text-xl font-bold">Form Sosialisasi</h2>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
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
                  Lokasi
                </label>
                <div className="w-8/12 mr-3">
                  <select
                    className="w-full p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                    value={formData.identifikasiId || "search"}
                    onChange={handleLocationChange}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") {
                        setSearchTerm(e.currentTarget.value + e.key);
                      }
                    }}
                    required
                  >
                    <option value="search" disabled>
                      Cari lokasi...
                    </option>
                    {filteredOptions.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.namadesa} - {item.spantower}
                      </option>
                    ))}
                  </select>
                  {isClient && formData.identifikasiId && (
                    <div className="flex justify-between text-sm text-gray-600 px-2 mt-2">
                      <span>
                        Nama Desa: {identifikasiList.find(i => i.id === formData.identifikasiId)?.namadesa || "-"}
                      </span>
                      <span>
                        Span Tower: {identifikasiList.find(i => i.id === formData.identifikasiId)?.spantower || "-"}
                      </span>
                    </div>
                  )}
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
                    className="w-full p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept=".pdf"
                  />
                </div>
              </div>

              <div className="row flex justify-between items-center">
                <label className="block text-sm font-semibold text-black ml-3">
                  Daftar Hadir
                </label>
                <div className="w-8/12 mr-3 flex items-center">
                  <input
                    type="file"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        daftarHadir: e.target.files?.[0] || null,
                      })
                    }
                    className="w-full p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept=".pdf"
                  />
                </div>
              </div>

              <div className="row flex justify-between items-center rounded-b">
                <label className="block text-sm font-semibold text-black ml-3">
                  Evidence
                </label>
                <div className="w-8/12 mr-3">
                  {evidenceList.map((evidence, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="file"
                        onChange={(e) =>
                          handleEvidenceChange(index, e.target.files?.[0] || null)
                        }
                        className="w-full p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        accept="image/*"
                      />
                      {index === 0 ? (
                        <button
                          type="button"
                          onClick={() => setEvidenceList([...evidenceList, { file: null }])}
                          className="ml-4 text-3xl"
                        >
                          <MdAddCircleOutline className="text-color3" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const newList = evidenceList.filter((_, i) => i !== index);
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
    </div>
  );
};

export default FormSosialisasi;
