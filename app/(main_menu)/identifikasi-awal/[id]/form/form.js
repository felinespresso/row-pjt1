"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, startTransition, useEffect } from "react";
import { FaArrowLeft, FaRegTrashAlt } from "react-icons/fa";
import Link from "next/link";
import { saveIdentifikasi } from "@/lib/identifikasi/action";
import React, { useActionState } from "react";
import { MdAddCircleOutline, MdRemoveCircleOutline } from "react-icons/md";
import { SubmitButton } from "@/app/_components/buttons";
import SuccessPopup from "@/app/_components/SuccessPopup";
import SaveLoading from "@/app/_components/SaveLoading";
import "./globals.css";
import { useAlert } from "@/app/_contexts/AlertContext";
import { motion, AnimatePresence } from "framer-motion";

const FormIdentifikasiAwal = ({ session }) => {
  const router = useRouter();
  const { id } = useParams(); // Ambil ID proyek dari URL
  const [state, formAction] = useActionState(saveIdentifikasi, null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { showAlert } = useAlert();

  // Perbarui state untuk error form
  const [formErrors, setFormErrors] = useState({
    namadesa: "",
    spantower: "",
    tanggal: "",
    fotoudara: "",
    file: "", // Evidence 1 file
    namaPemilik: "", // Nama pemilik untuk evidence 1
    bidangLahan: "", // Bidang lahan untuk evidence 1
    additionalEvidence: [], // Array untuk menyimpan error evidence tambahan
  });

  // Tambahkan useEffect untuk mengatur loading state
  useEffect(() => {
    // Simulasi loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Jika id tidak ada, jangan render form
  if (!id) {
    return <div>Error: ID proyek tidak ditemukan.</div>;
  }

  const handleCancel = () => {
    router.push(`/identifikasi-awal/${id}`);
  };

  // Tambahkan fungsi untuk menginisialisasi error evidence tambahan
  const initializeAdditionalEvidenceErrors = () => {
    return additionalEvidenceInputs.map(() => ({
      file: "",
      namaPemilik: "",
      bidangLahan: "",
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.target);
    formData.append("itemId", id);

    // Validasi form
    let hasError = false;
    const newErrors = {
      namadesa: "",
      spantower: "",
      tanggal: "",
      fotoudara: "",
      file: "",
      namaPemilik: "",
      bidangLahan: "",
      additionalEvidence: initializeAdditionalEvidenceErrors(),
    };

    // Validasi nama desa
    if (!event.target.namadesa.value.trim()) {
      newErrors.namadesa = "Nama desa wajib diisi!";
      hasError = true;
    }

    // Validasi span tower
    if (!event.target.spantower.value.trim()) {
      newErrors.spantower = "Nomor span tower wajib diisi!";
      hasError = true;
    }

    // Validasi tanggal
    if (!event.target.tanggal.value) {
      newErrors.tanggal = "Tanggal pelaksanaan wajib diisi!";
      hasError = true;
    }

    // Validasi apakah file foto udara dipilih
    const fotoudara = event.target.fotoudara.files[0];
    if (!fotoudara) {
      newErrors.fotoudara = "Hasil Foto Udara wajib diunggah!";
      hasError = true;
    }

    // Validasi evidence 1
    const evidence1 = event.target.file.files[0];
    if (!evidence1) {
      newErrors.file = "Evidence 1 wajib diunggah!";
      hasError = true;
    }

    // Validasi nama pemilik
    const namaPemilik = event.target.namaPemilik.value.trim();
    if (!namaPemilik) {
      newErrors.namaPemilik = "Nama pemilik wajib diisi!";
      hasError = true;
    }

    // Validasi bidang lahan
    const bidangLahan = event.target.bidangLahan.value.trim();
    if (!bidangLahan) {
      newErrors.bidangLahan = "Nomor bidang lahan wajib diisi!";
      hasError = true;
    }

    // Validasi evidence tambahan
    additionalEvidenceInputs.forEach((input, index) => {
      const file = event.target[`file-${index}`]?.files[0];
      const additionalNamaPemilik =
        event.target[`namaPemilik-${index}`]?.value?.trim();
      const additionalBidangLahan =
        event.target[`bidangLahan-${index}`]?.value?.trim();

      if (!file) {
        newErrors.additionalEvidence[index].file = `Evidence ${
          index + 2
        } wajib diunggah.`;
        hasError = true;
      }

      if (!additionalNamaPemilik) {
        newErrors.additionalEvidence[index].namaPemilik =
          "Nama pemilik wajib diisi!";
        hasError = true;
      }

      if (!additionalBidangLahan) {
        newErrors.additionalEvidence[index].bidangLahan =
          "Nomor bidang lahan wajib diisi!";
        hasError = true;
      }

      if (file && additionalNamaPemilik && additionalBidangLahan) {
        formData.append(`file-${index}`, file);
        formData.append(`namaPemilik-${index}`, additionalNamaPemilik);
        formData.append(`bidangLahan-${index}`, additionalBidangLahan);
      }
    });

    if (hasError) {
      setFormErrors(newErrors);
      showAlert("Mohon isi semua form yang wajib diisi!", "error");
      setIsSubmitting(false);
      return;
    }

    formData.append("fotoudara", fotoudara);
    formData.append("file", evidence1);
    formData.append("namaPemilik", namaPemilik);
    formData.append("bidangLahan", bidangLahan);

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/identifikasi", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        showAlert(
          result.message || "Terjadi kesalahan saat menyimpan data",
          "error"
        );
        setIsSubmitting(false);
        return;
      }

      setShowSuccessPopup(true);
      setTimeout(() => {
        router.push(`/identifikasi-awal/${id}`);
      }, 2000);
    } catch (error) {
      showAlert(
        "Gagal menyimpan data, coba lagi nanti! Error: " + error.message,
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const [additionalEvidenceInputs, setAdditionalEvidenceInputs] = useState([]);
  const addEvidenceInput = () => {
    setAdditionalEvidenceInputs([
      ...additionalEvidenceInputs,
      { id: additionalEvidenceInputs.length + 1 },
    ]);
  };
  const removeEvidenceInput = (id) => {
    setAdditionalEvidenceInputs(
      additionalEvidenceInputs.filter((input) => input.id !== id)
    );
  };

  return (
    <div className="px-6 pt-32 pb-20">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : session.user.role === "admin" ? (
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
            <form action={formAction} onSubmit={handleFormSubmit}>
              <div className="pt-2 bg-transparent border-2 border-gray-400 rounded-md">
                <div className="flex items-center justify-between px-4 m-4">
                  <h2 className="text-xl font-bold">Form Identifikasi Awal</h2>
                  <div className="flex justify-end text-base space-x-7">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="w-32 px-4 py-2 font-semibold text-gray-500 transition duration-200 ease-in-out bg-white border-2 border-gray-500 rounded-lg hover:-translate-1 hover:scale-110 hover:bg-gray-200"
                    >
                      {" "}
                      BATAL
                    </button>
                    <SubmitButton label="SIMPAN" />
                  </div>
                </div>
                <hr className="border border-gray-400" />

                <div>
                  <div className="h-full pb-2 bg-color9">
                    <div className="flex items-center justify-between h-16 px-4">
                      <label className="block ml-3 text-base font-semibold text-black">
                        Nama Desa <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="namadesa"
                        className={`w-[70%] p-2 text-sm font-medium placeholder-gray-400 transition duration-300 ease-in-out bg-white border-2 ${
                          formErrors.namadesa
                            ? "border-red-500"
                            : "border-gray-400"
                        } rounded-md mr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400`}
                        placeholder="Masukkan nama desa"
                      />
                    </div>
                    <div className="flex justify-between w-full mt-[-7px]">
                      <div className="w-4/12"></div>
                      <div
                        id="namadesa-error"
                        className="w-11/12 text-red-500 text-[12px]"
                      >
                        <span>
                          {formErrors.namadesa || state?.Error?.namadesa}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="h-full pb-2 bg-white">
                    <div className="flex items-center justify-between h-16 px-4">
                      <label className="block ml-3 text-base font-semibold text-black">
                        Nomor Span Tower <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="spantower"
                        className={`w-[70%] p-2 text-sm font-medium placeholder-gray-400 transition duration-300 ease-in-out bg-white border-2 ${
                          formErrors.spantower
                            ? "border-red-500"
                            : "border-gray-400"
                        } rounded-md mr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400`}
                        placeholder="Masukkan span tower"
                      />
                    </div>
                    <div className="flex justify-between w-full mt-[-7px]">
                      <div className="w-4/12"></div>
                      <div
                        id="spantower-error"
                        className="w-11/12 text-red-500 text-[12px]"
                      >
                        <span>
                          {formErrors.spantower || state?.Error?.spantower}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="h-full pb-1 bg-color9">
                    <div className="flex items-center justify-between h-16 px-4">
                      <label className="block ml-3 text-base font-semibold text-black">
                        Tanggal Pelaksanaan{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="tanggal"
                        className={`w-[70%] px-2 py-1 text-sm font-medium placeholder-gray-400 transition duration-300 ease-in-out bg-white border-2 ${
                          formErrors.tanggal
                            ? "border-red-500"
                            : "border-gray-400"
                        } rounded-md mr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400`}
                        placeholder="Masukkan tanggal pelaksanaan"
                      />
                    </div>
                    <div className="flex justify-between w-full mt-[-7px]">
                      <div className="w-4/12"></div>
                      <div
                        id="tanggal-error"
                        className="w-11/12 text-red-500 text-[12px]"
                      >
                        <span>
                          {formErrors.tanggal || state?.Error?.tanggal}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="h-full pb-2 bg-white">
                    <div className="flex items-center justify-between h-16 px-4">
                      <label className="block ml-3 text-base font-semibold text-black">
                        Hasil Foto Udara <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        name="fotoudara"
                        accept=".pdf, .doc, .docx, .xls, .xlsx"
                        className={`w-[70%] p-2 mr-14 text-sm transition duration-300 ease-in-out bg-white border-2 ${
                          formErrors.fotoudara
                            ? "border-red-500"
                            : "border-gray-400"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 file:py-1 file:px-3 file:mr-2 file:rounded-sm file:border-0 file:bg-gray-200 hover:file:bg-blue-200 file:cursor-pointer file:text-sm file:font-medium file:text-gray-700 file:shadow-md`}
                      />
                    </div>
                    <div className="flex justify-between w-full mt-[-6px]">
                      <div className="w-4/12"></div>
                      <div
                        id="fotoudara-error"
                        className="w-11/12 text-red-500 text-[12px]"
                      >
                        <span>
                          {formErrors.fotoudara || state?.Error?.fotoudara}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`h-full px-4 pt-3 pb-4 bg-color9 ${
                      additionalEvidenceInputs.length === 0 ? "rounded-b" : ""
                    }`}
                  >
                    <div className="grid grid-cols-1 gap-12 pl-3 pr-1 md:grid-cols-2 lg:grid-cols-3">
                      <div className="flex flex-col">
                        <label className="block pb-2 text-base font-semibold text-black">
                          Evidence 1 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          name="file"
                          accept=".png, .jpg, .jpeg"
                          className={`w-full min-w-0 p-2 text-sm bg-white border-2 ${
                            formErrors.file
                              ? "border-red-500"
                              : "border-gray-400"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 file:py-1 file:px-3 file:mr-2 file:rounded-sm file:border-0 file:bg-gray-200 hover:file:bg-blue-200 file:cursor-pointer file:text-sm file:font-medium file:text-gray-700 file:shadow-md`}
                        />
                        {formErrors.file && (
                          <p className="mt-1 text-sm text-red-500">
                            {formErrors.file}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <label className="block pt-[3px] pb-2 text-base font-semibold text-black">
                          Nama Pemilik <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="namaPemilik"
                          className={`w-full min-w-0 py-[9px] px-2 text-sm font-medium placeholder-gray-400 bg-white border-2 ${
                            formErrors.namaPemilik
                              ? "border-red-500"
                              : "border-gray-400"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400`}
                          placeholder="Masukkan nama pemilik"
                        />
                        {formErrors.namaPemilik && (
                          <p className="mt-1 text-sm text-red-500">
                            {formErrors.namaPemilik}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center">
                        <div className="flex flex-col flex-grow">
                          <label className="block pb-2 text-base font-semibold text-black">
                            No. Bidang Lahan{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="bidangLahan"
                            className={`w-full min-w-0 p-2 text-sm font-medium placeholder-gray-400 bg-white border-2 ${
                              formErrors.bidangLahan
                                ? "border-red-500"
                                : "border-gray-400"
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400`}
                            placeholder="Masukkan nomor bidang lahan"
                          />
                          {formErrors.bidangLahan && (
                            <p className="mt-1 text-sm text-red-500">
                              {formErrors.bidangLahan}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={addEvidenceInput}
                          className="ml-4 text-4xl"
                        >
                          <MdAddCircleOutline className="text-color3" />
                        </button>
                      </div>
                    </div>
                    <div id="evidence-error" className="flex mt-3 text-center">
                      <span className="text-red-500 text-[12px] w-full">
                        {state?.Error?.evidences}
                      </span>
                    </div>
                  </div>

                  {additionalEvidenceInputs.map((input, index) => (
                    <div
                      key={input.id}
                      className={`h-full px-4 pt-3 pb-4 bg-color9 ${
                        index === additionalEvidenceInputs.length - 1
                          ? "rounded-b"
                          : ""
                      }`}
                    >
                      <div className="grid grid-cols-1 gap-12 pl-3 pr-1 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col">
                          <label className="block pb-2 text-base font-semibold text-black">
                            Evidence {input.id + 1}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            name={`file-${index}`}
                            accept=".png, .jpg, .jpeg"
                            className={`w-full min-w-0 p-2 text-sm bg-white border-2 ${
                              formErrors.additionalEvidence[index]?.file
                                ? "border-red-500"
                                : "border-gray-400"
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 file:py-1 file:px-3 file:mr-2 file:rounded-sm file:border-0 file:bg-gray-200 hover:file:bg-blue-200 file:cursor-pointer file:text-sm file:font-medium file:text-gray-700 file:shadow-md`}
                          />
                          {formErrors.additionalEvidence[index]?.file && (
                            <p className="mt-1 text-sm text-red-500">
                              {formErrors.additionalEvidence[index].file}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <label className="block pt-[3px] pb-2 text-base font-semibold text-black">
                            Nama Pemilik <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name={`namaPemilik-${index}`}
                            className={`w-full min-w-0 py-[9px] px-2 text-sm font-medium placeholder-gray-400 bg-white border-2 ${
                              formErrors.additionalEvidence[index]?.namaPemilik
                                ? "border-red-500"
                                : "border-gray-400"
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400`}
                            placeholder="Masukkan nama pemilik"
                          />
                          {formErrors.additionalEvidence[index]
                            ?.namaPemilik && (
                            <p className="mt-1 text-sm text-red-500">
                              {formErrors.additionalEvidence[index].namaPemilik}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center">
                          <div className="flex flex-col flex-grow">
                            <label className="block pb-2 text-base font-semibold text-black">
                              No. Bidang Lahan{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name={`bidangLahan-${index}`}
                              className={`w-full min-w-0 p-2 text-sm font-medium placeholder-gray-400 bg-white border-2 ${
                                formErrors.additionalEvidence[index]
                                  ?.bidangLahan
                                  ? "border-red-500"
                                  : "border-gray-400"
                              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400`}
                              placeholder="Masukkan nomor bidang lahan"
                            />
                            {formErrors.additionalEvidence[index]
                              ?.bidangLahan && (
                              <p className="mt-1 text-sm text-red-500">
                                {
                                  formErrors.additionalEvidence[index]
                                    .bidangLahan
                                }
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeEvidenceInput(input.id)}
                            className="ml-4 text-4xl"
                          >
                            <MdRemoveCircleOutline className="text-color3" />
                          </button>
                        </div>
                      </div>
                      <div id="evidence-error" className="flex text-center">
                        <span className="text-red-500 text-[12px] w-full">
                          {state?.Error?.evidences}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                id="message-error"
                aria-live="polite"
                aria-atomic="true"
                className="justify-center"
              >
                <span className="text-[12px] leading-none text-justify font-bold text-red-500">
                  {state?.message}
                </span>
              </div>
            </form>
          </motion.div>
        </div>
      ) : (
        <div>
          <Link href={`/identifikasi-awal/${id}`}>
            <button className="flex items-center gap-2 text-blue-3 hover:text-blue-4">
              <FaArrowLeft /> Kembali
            </button>
          </Link>
          <p className="flex items-center justify-center py-48 m-4 text-2xl font-bold text-center text-gray-500">
            404 | HALAMAN TIDAK DITEMUKAN
          </p>
        </div>
      )}
      <SuccessPopup
        message="Data berhasil disimpan"
        isVisible={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
      />
    </div>
  );
};

export default FormIdentifikasiAwal;
