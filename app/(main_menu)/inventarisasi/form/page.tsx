// app/inventarisasi/form/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./globals.css";
import { MdAddCircleOutline, MdRemoveCircleOutline } from "react-icons/md";
import { motion } from "framer-motion";

const FormInvent: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // State untuk form utama dengan nilai default kosong
  const [mainForm, setMainForm] = useState({
    span: "",
    bidanglahan: "",
    formulir: null as File | null,
    namapemilik: "",
    nik: "",
    ttl: "",
    desakelurahan: "",
    kecamatan: "",
    kabupatenkota: "",
    alashak: "",
    luastanah: "",
    pelaksanaan: "",
  });

  // State terpisah untuk bangunan dan tanaman
  const [bangunanList, setBangunanList] = useState([
    { namabangunan: "", luasbangunan: "" },
  ]);

  const [tanamanList, setTanamanList] = useState([
    { namatanaman: "", produktif: "", besar: "", kecil: "", bibit: "" },
  ]);

  // Load data dari localStorage saat komponen dimount
  useEffect(() => {
    const savedMainForm = localStorage.getItem("mainForm");
    const savedBangunanList = localStorage.getItem("bangunanList");
    const savedTanamanList = localStorage.getItem("tanamanList");
    const savedStep = localStorage.getItem("currentStep");

    if (savedMainForm) {
      setMainForm(JSON.parse(savedMainForm));
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
    localStorage.setItem("mainForm", JSON.stringify(mainForm));
    localStorage.setItem("bangunanList", JSON.stringify(bangunanList));
    localStorage.setItem("tanamanList", JSON.stringify(tanamanList));
    localStorage.setItem("currentStep", currentStep.toString());
  }, [mainForm, bangunanList, tanamanList, currentStep]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Proses mainForm tanpa formulir terlebih dahulu
      Object.entries(mainForm).forEach(([key, value]) => {
        if (key !== "formulir") {
          // Skip formulir untuk diproses terpisah
          formData.append(key, value?.toString() || "-");
        }
      });

      // Hanya tambahkan formulir jika ada file yang dipilih
      if (selectedFile instanceof File) {
        formData.append("formulir", selectedFile);
      }

      // Proses bangunanList
      const processedBangunanList = bangunanList
        .filter((bangunan) => bangunan.namabangunan || bangunan.luasbangunan)
        .map((bangunan) => ({
          namabangunan: bangunan.namabangunan || "-",
          luasbangunan: bangunan.luasbangunan || "-",
        }));

      // Proses tanamanList
      const processedTanamanList = tanamanList
        .filter(
          (tanaman) =>
            tanaman.namatanaman ||
            tanaman.produktif ||
            tanaman.besar ||
            tanaman.kecil ||
            tanaman.bibit
        )
        .map((tanaman) => ({
          namatanaman: tanaman.namatanaman || "-",
          produktif: tanaman.produktif || "-",
          besar: tanaman.besar || "-",
          kecil: tanaman.kecil || "-",
          bibit: tanaman.bibit || "-",
        }));

      formData.append("jnsbangunan", JSON.stringify(processedBangunanList));
      formData.append("jnstanaman", JSON.stringify(processedTanamanList));

      const response = await fetch("/api/invents", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan data");
      }

      // Bersihkan localStorage
      localStorage.removeItem("mainForm");
      localStorage.removeItem("bangunanList");
      localStorage.removeItem("tanamanList");
      localStorage.removeItem("currentStep");

      router.push("/inventarisasi");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "Gagal menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setMainForm((prev) => ({ ...prev, formulir: file }));
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
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
      />
    </div>
  );

  // Render functions
  const renderStepOne = () => {
    return (
      <div>
        <div className="row flex justify-between items-center">
          <label className="block text-sm font-semibold text-black ml-3">
            Span Tower
          </label>
          <input
            type="text"
            value={mainForm.span}
            onChange={(e) => handleMainFormChange("span", e.target.value)}
            className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
            placeholder="Masukkan span tower"
          />
        </div>
        <div className="row flex justify-between items-center">
          <label className="block text-sm font-semibold text-black ml-3">
            No. Bidang Lahan
          </label>
          <input
            type="number"
            value={mainForm.bidanglahan}
            onChange={(e) =>
              handleMainFormChange("bidanglahan", e.target.value)
            }
            className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
            placeholder="Masukkan nomor bidang lahan"
          />
        </div>
        <div className="row flex justify-between items-center">
          <label className="block text-sm font-semibold text-black ml-3">
            Formulir
          </label>
          <div className="w-8/12 mr-3">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf"
              className="w-full p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {selectedFile && (
              <p className="mt-1 text-sm text-gray-500">
                File terpilih: {selectedFile.name}
              </p>
            )}
          </div>
        </div>
        <div className="row flex justify-between items-center">
          <label className="block text-sm font-semibold text-black ml-3">
            Nama Pemilik
          </label>
          <input
            type="text"
            value={mainForm.namapemilik}
            onChange={(e) =>
              handleMainFormChange("namapemilik", e.target.value)
            }
            className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
            placeholder="Masukkan nama pemilik"
          />
        </div>
        <div className="row flex justify-between items-center">
          <label className="block text-sm font-semibold text-black ml-3">
            NIK
          </label>
          <input
            type="number"
            value={mainForm.nik}
            onChange={(e) => handleMainFormChange("nik", e.target.value)}
            className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
            placeholder="Masukkan NIK"
          />
        </div>
        <div className="row flex justify-between items-center">
          <label className="block text-sm font-semibold text-black ml-3">
            Tempat Tanggal Lahir
          </label>
          <input
            type="text"
            value={mainForm.ttl}
            onChange={(e) => handleMainFormChange("ttl", e.target.value)}
            className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
            placeholder="Masukkan tempat tanggal lahir"
          />
        </div>
        <div className="row flex justify-between items-center">
          <label className="block text-sm font-semibold text-black ml-3">
            Desa/Kelurahan
          </label>
          <input
            type="text"
            value={mainForm.desakelurahan}
            onChange={(e) =>
              handleMainFormChange("desakelurahan", e.target.value)
            }
            className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
            placeholder="Masukkan nama desa/kelurahan"
          />
        </div>
        <div className="row flex justify-between items-center">
          <label className="block text-sm font-semibold text-black ml-3">
            Kecamatan
          </label>
          <input
            type="text"
            value={mainForm.kecamatan}
            onChange={(e) => handleMainFormChange("kecamatan", e.target.value)}
            className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
            placeholder="Masukkan nama kecamatan"
          />
        </div>
        <div className="row flex justify-between items-center">
          <label className="block text-sm font-semibold text-black ml-3">
            Kabupaten/Kota
          </label>
          <input
            type="text"
            value={mainForm.kabupatenkota}
            onChange={(e) =>
              handleMainFormChange("kabupatenkota", e.target.value)
            }
            className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
            placeholder="Masukkan nama kabupaten/kota"
          />
        </div>
        <div className="row flex justify-between items-center rounded-b">
          <label className="block text-sm font-semibold text-black ml-3">
            Tanggal Pelaksanaan
          </label>
          <input
            type="date"
            value={mainForm.pelaksanaan}
            onChange={(e) =>
              handleMainFormChange("pelaksanaan", e.target.value)
            }
            className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
            placeholder="Masukkan tanggal pelaksanaan"
          />
        </div>
      </div>
    );
  };

  const renderStepTwo = () => {
    return (
      <div>
        {/* Form alas hak dan luas tanah */}
        <div className="row flex justify-between items-center">
          <label className="block text-sm font-semibold text-black ml-3">
            Alas Hak
          </label>
          <div className="w-8/12 mr-3 flex items-center">
            <input
              type="text"
              value={mainForm.alashak}
              onChange={(e) => handleMainFormChange("alashak", e.target.value)}
              className="flex-1 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
              placeholder="Masukkan alas hak"
            />
          </div>
        </div>

        <div className="row flex justify-between items-center">
          <label className="block text-sm font-semibold text-black ml-3">
            Luas Tanah
          </label>
          <div className="w-8/12 mr-3 flex items-center">
            <input
              type="text"
              value={mainForm.luastanah}
              onChange={(e) => handleMainFormChange("luastanah", e.target.value)}
              className="flex-1 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
              placeholder="Masukkan luas tanah"
            />
          </div>
        </div>

        {/* Form bangunan */}
        {bangunanList.map((bangunan, index) => (
          <div key={index}>
            <div className="row flex justify-between items-center">
              <label className="block text-sm font-semibold text-black ml-3">
                Jenis Bangunan
              </label>
              <div className="w-8/12 mr-3 flex items-center">
                <input
                  type="text"
                  value={bangunan.namabangunan}
                  onChange={(e) =>
                    handleBangunanChange(index, "namabangunan", e.target.value)
                  }
                  className="flex-1 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
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
                      const newList = bangunanList.filter((_, i) => i !== index);
                      setBangunanList(newList);
                    }}
                    className="ml-4 text-3xl"
                  >
                    <MdRemoveCircleOutline className="text-red-500" />
                  </button>
                )}
              </div>
            </div>
            <div className={`row flex justify-between items-center ${
              index === bangunanList.length - 1 ? "rounded-b-lg overflow-hidden" : ""
            }`}>
              <label className="block text-sm font-semibold text-black ml-3">
                Luas Bangunan
              </label>
              <div className="w-[66.6%] mr-3 flex items-center pr-11">
                <input
                  type="text"
                  value={bangunan.luasbangunan}
                  onChange={(e) =>
                    handleBangunanChange(index, "luasbangunan", e.target.value)
                  }
                  className="flex-1 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
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
            className={`${index === tanamanList.length - 1 ? "rounded-b overflow-hidden" : ""}`}
          >
            <div className="row flex justify-between items-center">
              <label className="block text-sm font-semibold text-black ml-3">
                Jenis Tanaman
              </label>
              <div className="w-8/12 mr-3 flex items-center">
                <input
                  type="text"
                  value={tanaman.namatanaman}
                  onChange={(e) =>
                    handleTanamanChange(index, "namatanaman", e.target.value)
                  }
                  className="flex-1 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
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
                          bibit: "",
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
            <div className="row flex justify-between items-center">
              <label className="block text-sm font-semibold text-black ml-3">
                Tanaman Produktif
              </label>
              <div className="w-8/12 mr-3 flex items-center pr-11">
                <input
                  type="text"
                  value={tanaman.produktif}
                  onChange={(e) =>
                    handleTanamanChange(index, "produktif", e.target.value)
                  }
                  className="flex-1 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  placeholder="Masukkan jumlah tanaman produktif"
                />
              </div>
            </div>
            <div className="row flex justify-between items-center">
              <label className="block text-sm font-semibold text-black ml-3">
                Tanaman Besar
              </label>
              <div className="w-8/12 mr-3 flex items-center pr-11">
                <input
                  type="text"
                  value={tanaman.besar}
                  onChange={(e) =>
                    handleTanamanChange(index, "besar", e.target.value)
                  }
                  className="flex-1 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  placeholder="Masukkan jumlah tanaman besar"
                />
              </div>
            </div>
            <div className="row flex justify-between items-center">
              <label className="block text-sm font-semibold text-black ml-3">
                Tanaman Kecil
              </label>
              <div className="w-8/12 mr-3 flex items-center pr-11">
                <input
                  type="text"
                  value={tanaman.kecil}
                  onChange={(e) =>
                    handleTanamanChange(index, "kecil", e.target.value)
                  }
                  className="flex-1 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  placeholder="Masukkan jumlah tanaman kecil"
                />
              </div>
            </div>
            <div className="row flex justify-between items-center">
              <label className="block text-sm font-semibold text-black ml-3">
                Bibit Tanaman
              </label>
              <div className="w-8/12 mr-3 flex items-center pr-11">
                <input
                  type="text"
                  value={tanaman.bibit}
                  onChange={(e) =>
                    handleTanamanChange(index, "bibit", e.target.value)
                  }
                  className="flex-1 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  placeholder="Masukkan jumlah bibit tanaman"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className="p-6"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="bg-transparent rounded-md border-2 border-gray-400">
            <div className="flex justify-between items-center m-4">
              <h2 className="text-xl font-bold">Form Inventarisasi</h2>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push("/inventarisasi")}
                  className="transition ease-in-out duration-200 bg-white hover:-translate-1 hover:scale-110 hover:bg-gray-200 duration-300 px-4 py-2 text-gray-500 border-2 border-gray-500 rounded-lg font-semibold w-32"
                >
                  CANCEL
                </button>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="transition ease-in-out duration-200 bg-white hover:-translate-1 hover:scale-110 hover:bg-gray-200 duration-300 px-4 py-2 text-blue-2 border-2 border-blue-2 rounded-lg font-semibold w-32"
                  >
                    PREVIOUS
                  </button>
                )}
                {currentStep < 3 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="transition ease-in-out duration-200 bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3 px-4 py-2 text-white rounded-lg font-semibold w-32"
                  >
                    NEXT
                  </button>
                )}
                {currentStep === 3 && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="transition ease-in-out duration-200 bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3 px-4 py-2 text-white rounded-lg font-semibold w-32"
                  >
                    {isSubmitting ? "Saving..." : "SAVE"}
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
  );
};

export default FormInvent;
