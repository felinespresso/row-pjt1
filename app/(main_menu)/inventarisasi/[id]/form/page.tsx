// app/inventarisasi/form/page.tsx
"use client";

import { put } from "@vercel/blob";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import "./globals.css";
import { MdAddCircleOutline, MdRemoveCircleOutline } from "react-icons/md";
import { motion } from "framer-motion";
import { useAlert } from "@/app/_contexts/AlertContext";
import SaveLoading from "@/app/_components/SaveLoading";
import SuccessPopup from "@/app/_components/SuccessPopup";

const FormInventarisasi: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const params = useParams();
  const id = params.id;
  const { showAlert } = useAlert();

  // State untuk form utama dengan nilai default kosong
  const [mainForm, setMainForm] = useState({
    span: "",
    bidanglahan: "",
    formulir: "",
    namapemilik: "",
    nik: "",
    ttl: "",
    desakelurahan: "",
    kecamatan: "",
    kabupatenkota: "",
    pekerjaan: "",
    alashak: "",
    luastanah: "",
    pelaksanaan: "",
  });

  // State terpisah untuk bangunan dan tanaman
  const [bangunanList, setBangunanList] = useState([
    { namabangunan: "", luasbangunan: "" },
  ]);

  const [tanamanList, setTanamanList] = useState([
    { namatanaman: "", produktif: "", besar: "", kecil: "" },
  ]);

  // State untuk menyimpan pesan kesalahan
  const [mainFormErrors, setMainFormErrors] = useState({
    span: "",
    pelaksanaan: "",
  });

  // Load data dari localStorage saat komponen dimount
  useEffect(() => {
    const savedMainForm = localStorage.getItem("mainForm");
    const savedBangunanList = localStorage.getItem("bangunanList");
    const savedTanamanList = localStorage.getItem("tanamanList");
    const savedStep = localStorage.getItem("currentStep");

    if (savedMainForm) {
      const parsedForm = JSON.parse(savedMainForm);
      delete parsedForm.formulir; // Hapus formulir (file) agar tidak disimpan
      setMainForm(parsedForm);
    }
    if (savedBangunanList) {
      setBangunanList(JSON.parse(savedBangunanList));
    }
    if (savedTanamanList) {
      setTanamanList(JSON.parse(savedTanamanList));
    }
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
  }, []);

  // Simpan data ke localStorage setiap kali ada perubahan
  useEffect(() => {
    const { formulir, ...formWithoutFormulir } = mainForm; // Hapus formulir sebelum menyimpan
    localStorage.setItem("mainForm", JSON.stringify(formWithoutFormulir));
    localStorage.setItem("bangunanList", JSON.stringify(bangunanList));
    localStorage.setItem("tanamanList", JSON.stringify(tanamanList));
    localStorage.setItem("currentStep", currentStep.toString());
  }, [mainForm, bangunanList, tanamanList, currentStep]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSaving(true);
    setIsSubmitting(true);


    try {
      const formData = new FormData();
      Object.entries(mainForm).forEach(([key, value]) => {
        if (value) formData.append(key, value.toString());
      });

      // Tambahkan Base64 string formulir ke formData
      if (mainForm.formulir) {
        formData.append("formulir", mainForm.formulir);
      }

      formData.append("itemId", id as string);

      const response = await fetch("/api/invents", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan data");
      }

      setSuccessMessage("Data berhasil disimpan!");
      setShowSuccessPopup(true);
      setTimeout(() => router.push(`/inventarisasi/{id}`), 2000);
    } catch (error) {
      console.error("❌ Error handleSubmit:", error);
      showAlert("Gagal menyimpan data", "error");
    } finally {
      setIsSubmitting(false);
      setIsSaving(false);
    }
  };

  // Menghandle input file formulir dan menyimpannya sebagai Base64
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Membaca file sebagai Base64

      reader.onload = () => {
        if (reader.result) {
          const base64String = reader.result.toString().split(",")[1]; // Hanya mengambil isi Base64 tanpa prefix "data:..."
          setMainForm((prev) => ({ ...prev, formulir: base64String })); // Simpan Base64 string di state
        }
      };

      reader.onerror = (error) => {
        console.error("❌ Error mengubah file menjadi Base64:", error);
        showAlert("Gagal memproses file formulir", "error");
      };
    } catch (error) {
      console.error("❌ Error handleFileChange:", error);
      showAlert("Terjadi kesalahan saat mengunggah formulir", "error");
    }
  };

  // Handler untuk form utama
  const handleMainFormChange = (field: string, value: string) => {
    setMainForm({ ...mainForm, [field]: value });
  };

  // Handler untuk bangunan
  const handleBangunanChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newBangunanList = [...bangunanList];
    newBangunanList[index] = {
      ...newBangunanList[index],
      [field]: value,
    };
    setBangunanList(newBangunanList);
  };

  // Handler untuk tanaman
  const handleTanamanChange = (index: number, field: string, value: string) => {
    const newTanamanList = [...tanamanList];
    newTanamanList[index] = {
      ...newTanamanList[index],
      [field]: value,
    };
    setTanamanList(newTanamanList);
  };

  // Hapus atribut required dari semua input
  const renderInput = (
    label: string,
    name: string,
    value: string,
    onChange: (value: string) => void,
    type: string = "text"
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm"
      />
    </div>
  );

  // Render functions
  const renderStepOne = () => {
    return (
      <div>
        <div className="flex items-center justify-between row">
          <label className="block ml-3 text-sm font-semibold text-black">
            Span Tower
          </label>
          <div className="w-8/12 mr-3">
            <input
              type="text"
              value={mainForm.span}
              onChange={(e) => handleMainFormChange("span", e.target.value)}
              className={`w-full mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400 ${mainFormErrors.span ? "border-red-500" : ""
                }`}
              placeholder="Masukkan span tower"
            />
            {mainFormErrors.span && (
              <p className="mt-1 text-sm text-red-500">{mainFormErrors.span}</p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between row">
          <label className="block ml-3 text-sm font-semibold text-black">
            No. Bidang Lahan
          </label>
          <input
            type="number"
            value={mainForm.bidanglahan}
            onChange={(e) =>
              handleMainFormChange("bidanglahan", e.target.value)
            }
            className="w-8/12 p-2 mr-3 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
            placeholder="Masukkan nomor bidang lahan"
          />
        </div>
        <div className="flex items-center justify-between row">
          <label className="block ml-3 text-sm font-semibold text-black">
            Formulir
          </label>
          <div className="w-8/12 mr-3">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf"
              className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {selectedFile && (
              <p className="mt-1 text-sm text-gray-500">
                {/* File terpilih: {selectedFile.name} */}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between row">
          <label className="block ml-3 text-sm font-semibold text-black">
            Tanggal Pelaksanaan
          </label>
          <div className="w-8/12 mr-3">
            <input
              type="date"
              value={mainForm.pelaksanaan}
              onChange={(e) =>
                handleMainFormChange("pelaksanaan", e.target.value)
              }
              className={`w-full mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400 ${mainFormErrors.pelaksanaan ? "border-red-500" : ""
                }`}
            />
            {mainFormErrors.pelaksanaan && (
              <p className="mt-1 text-sm text-red-500">
                {mainFormErrors.pelaksanaan}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between row">
          <label className="block ml-3 text-sm font-semibold text-black">
            Nama Pemilik
          </label>
          <input
            type="text"
            value={mainForm.namapemilik}
            onChange={(e) =>
              handleMainFormChange("namapemilik", e.target.value)
            }
            className="w-8/12 p-2 mr-3 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
            placeholder="Masukkan nama pemilik"
          />
        </div>
        <div className="flex items-center justify-between row">
          <label className="block ml-3 text-sm font-semibold text-black">
            NIK
          </label>
          <input
            type="number"
            value={mainForm.nik}
            onChange={(e) => handleMainFormChange("nik", e.target.value)}
            className="w-8/12 p-2 mr-3 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
            placeholder="Masukkan NIK"
          />
        </div>
        <div className="flex items-center justify-between row">
          <label className="block ml-3 text-sm font-semibold text-black">
            Tempat Tanggal Lahir
          </label>
          <input
            type="text"
            value={mainForm.ttl}
            onChange={(e) => handleMainFormChange("ttl", e.target.value)}
            className="w-8/12 p-2 mr-3 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
            placeholder="Masukkan tempat tanggal lahir"
          />
        </div>
        <div className="flex items-center justify-between row">
          <label className="block ml-3 text-sm font-semibold text-black">
            Desa/Kelurahan
          </label>
          <input
            type="text"
            value={mainForm.desakelurahan}
            onChange={(e) =>
              handleMainFormChange("desakelurahan", e.target.value)
            }
            className="w-8/12 p-2 mr-3 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
            placeholder="Masukkan nama desa/kelurahan"
          />
        </div>
        <div className="flex items-center justify-between row">
          <label className="block ml-3 text-sm font-semibold text-black">
            Kecamatan
          </label>
          <input
            type="text"
            value={mainForm.kecamatan}
            onChange={(e) => handleMainFormChange("kecamatan", e.target.value)}
            className="w-8/12 p-2 mr-3 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
            placeholder="Masukkan nama kecamatan"
          />
        </div>
        <div className="flex items-center justify-between row">
          <label className="block ml-3 text-sm font-semibold text-black">
            Kabupaten/Kota
          </label>
          <input
            type="text"
            value={mainForm.kabupatenkota}
            onChange={(e) =>
              handleMainFormChange("kabupatenkota", e.target.value)
            }
            className="w-8/12 p-2 mr-3 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
            placeholder="Masukkan nama kabupaten/kota"
          />
        </div>
        <div className="flex items-center justify-between rounded-b row">
          <label className="block ml-3 text-sm font-semibold text-black">
            Pekerjaan
          </label>
          <input
            type="text"
            value={mainForm.pekerjaan}
            onChange={(e) => handleMainFormChange("pekerjaan", e.target.value)}
            className="w-8/12 p-2 mr-3 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
            placeholder="Masukkan pekerjaan"
          />
        </div>
      </div>
    );
  };

  const renderStepTwo = () => {
    return (
      <div>
        {/* Form alas hak dan luas tanah */}
        <div className="flex items-center justify-between row">
          <label className="block ml-3 text-sm font-semibold text-black">
            Alas Hak
          </label>
          <div className="flex items-center w-8/12 mr-3">
            <input
              type="text"
              value={mainForm.alashak}
              onChange={(e) => handleMainFormChange("alashak", e.target.value)}
              className="flex-1 p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
              placeholder="Masukkan alas hak"
            />
          </div>
        </div>

        <div className="flex items-center justify-between row">
          <label className="block ml-3 text-sm font-semibold text-black">
            Luas Tanah
          </label>
          <div className="flex items-center w-8/12 mr-3">
            <input
              type="text"
              value={mainForm.luastanah}
              onChange={(e) =>
                handleMainFormChange("luastanah", e.target.value)
              }
              className="flex-1 p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
              placeholder="Masukkan luas tanah"
            />
          </div>
        </div>

        {/* Form bangunan */}
        {bangunanList.map((bangunan, index) => (
          <div key={index}>
            <div className="flex items-center justify-between row">
              <label className="block ml-3 text-sm font-semibold text-black">
                Jenis Bangunan
              </label>
              <div className="flex items-center w-8/12 mr-3">
                <input
                  type="text"
                  value={bangunan.namabangunan}
                  onChange={(e) =>
                    handleBangunanChange(index, "namabangunan", e.target.value)
                  }
                  className="flex-1 p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  placeholder="Masukkan jenis bangunan"
                />
                {index === 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setBangunanList([
                        ...bangunanList,
                        { namabangunan: "", luasbangunan: "" },
                      ])
                    }
                    className="ml-4 text-3xl"
                  >
                    <MdAddCircleOutline className="text-color3" />
                  </button>
                )}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newList = bangunanList.filter(
                        (_, i) => i !== index
                      );
                      setBangunanList(newList);
                    }}
                    className="ml-4 text-3xl"
                  >
                    <MdRemoveCircleOutline className="text-red-500" />
                  </button>
                )}
              </div>
            </div>
            <div
              className={`row flex justify-between items-center ${index === bangunanList.length - 1
                ? "rounded-b-lg overflow-hidden"
                : ""
                }`}
            >
              <label className="block ml-3 text-sm font-semibold text-black">
                Luas Bangunan
              </label>
              <div className="w-[66.6%] mr-3 flex items-center pr-11">
                <input
                  type="text"
                  value={bangunan.luasbangunan}
                  onChange={(e) =>
                    handleBangunanChange(index, "luasbangunan", e.target.value)
                  }
                  className="flex-1 p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  placeholder="Masukkan luas bangunan"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStepThree = () => {
    return (
      <div>
        {tanamanList.map((tanaman, index) => (
          <div
            key={index}
            className={`${index === tanamanList.length - 1
              ? "rounded-b overflow-hidden"
              : ""
              }`}
          >
            <div className="flex items-center justify-between row">
              <label className="block ml-3 text-sm font-semibold text-black">
                Jenis Tanaman
              </label>
              <div className="flex items-center w-8/12 mr-3">
                <input
                  type="text"
                  value={tanaman.namatanaman}
                  onChange={(e) =>
                    handleTanamanChange(index, "namatanaman", e.target.value)
                  }
                  className="flex-1 p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  placeholder="Masukkan jenis tanaman"
                />
                {index === 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setTanamanList([
                        ...tanamanList,
                        {
                          namatanaman: "",
                          produktif: "",
                          besar: "",
                          kecil: "",
                        },
                      ])
                    }
                    className="ml-4 text-3xl"
                  >
                    <MdAddCircleOutline className="text-color3" />
                  </button>
                )}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newList = tanamanList.filter((_, i) => i !== index);
                      setTanamanList(newList);
                    }}
                    className="ml-4 text-3xl"
                  >
                    <MdRemoveCircleOutline className="text-red-500" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between row">
              <label className="block ml-3 text-sm font-semibold text-black">
                Tanaman Produktif
              </label>
              <div className="flex items-center w-8/12 mr-3 pr-11">
                <input
                  type="text"
                  value={tanaman.produktif}
                  onChange={(e) =>
                    handleTanamanChange(index, "produktif", e.target.value)
                  }
                  className="flex-1 p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  placeholder="Masukkan jumlah tanaman produktif"
                />
              </div>
            </div>
            <div className="flex items-center justify-between row">
              <label className="block ml-3 text-sm font-semibold text-black">
                Tanaman Besar
              </label>
              <div className="flex items-center w-8/12 mr-3 pr-11">
                <input
                  type="text"
                  value={tanaman.besar}
                  onChange={(e) =>
                    handleTanamanChange(index, "besar", e.target.value)
                  }
                  className="flex-1 p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  placeholder="Masukkan jumlah tanaman besar"
                />
              </div>
            </div>
            <div className="flex items-center justify-between row">
              <label className="block ml-3 text-sm font-semibold text-black">
                Tanaman Kecil
              </label>
              <div className="flex items-center w-8/12 mr-3 pr-11">
                <input
                  type="text"
                  value={tanaman.kecil}
                  onChange={(e) =>
                    handleTanamanChange(index, "kecil", e.target.value)
                  }
                  className="flex-1 p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  placeholder="Masukkan jumlah tanaman kecil"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative px-6 pt-32 pb-20">
      {/* Loading overlay dengan backdrop blur */}
      {isSaving && <SaveLoading />}

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="pt-2 bg-transparent border-2 border-gray-400 rounded-md">
              <div className="flex items-center justify-between px-4 m-4">
                <h2 className="text-xl font-bold">Form Inventarisasi</h2>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => router.push(`/inventarisasi/${id}`)}
                    className="w-32 px-4 py-2 font-semibold text-gray-500 transition duration-200 ease-in-out bg-white border-2 border-gray-500 rounded-lg hover:-translate-1 hover:scale-110 hover:bg-gray-200"
                  >
                    BATAL
                  </button>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-4 py-2 font-semibold transition duration-200 ease-in-out bg-white border-2 rounded-lg hover:-translate-1 hover:scale-110 hover:bg-gray-200 text-blue-2 border-blue-2 w-38"
                    >
                      SEBELUMNYA
                    </button>
                  )}
                  {currentStep < 3 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="px-4 py-2 font-semibold text-white transition duration-200 ease-in-out rounded-lg bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3 w-38"
                    >
                      SELANJUTNYA
                    </button>
                  )}
                  {currentStep === 3 && (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`transition ease-in-out duration-200 bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3 px-4 py-2 text-white rounded-lg font-semibold w-32 ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : ""
                        }`}
                    >
                      {isSubmitting ? "MENYIMPAN..." : "SIMPAN"}
                    </button>
                  )}
                </div>
              </div>
              <hr />
              {currentStep === 1 && renderStepOne()}
              {currentStep === 2 && renderStepTwo()}
              {currentStep === 3 && renderStepThree()}
            </div>
          </form>
        </div>
      </motion.div>

      <SuccessPopup
        message={successMessage}
        isVisible={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
      />
    </div>
  );
};

export default FormInventarisasi;
