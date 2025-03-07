"use client";
import { useRouter } from "next/navigation";
import { useActionState, useState, useEffect, useTransition } from "react";
import { SubmitButton } from "@/app/_components/buttons";
import { FaArrowLeft, FaRegTrashAlt } from "react-icons/fa";
import Link from "next/link";
import { useParams } from "next/navigation";
import { uploadEvidence } from "@/lib/identifikasi/action";
import { motion } from "framer-motion";
import SaveLoading from "@/app/_components/SaveLoading";
import SuccessPopup from "@/app/_components/SuccessPopup";
import { useAlert } from "@/app/_contexts/AlertContext";

const FormEvidence = ({ session }: { session: any }) => {
  const router = useRouter();
  const [state, formAction] = useActionState(uploadEvidence, null);
  const { id, formId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { showAlert } = useAlert();

  // Tambahkan state untuk error form
  const [formErrors, setFormErrors] = useState({
    file: "",
    namaPemilik: "",
    bidangLahan: "",
  });

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Effect untuk mengatur loading state saat submit
  useEffect(() => {
    if (isPending) {
      setIsSubmitting(true);
    } else {
      const timer = setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPending]);

  const handleFormSubmit = async (formData: FormData) => {
    // Reset error state
    setFormErrors({
      file: "",
      namaPemilik: "",
      bidangLahan: "",
    });

    // Validasi form
    let hasError = false;
    const newErrors = {
      file: "",
      namaPemilik: "",
      bidangLahan: "",
    };

    // Validasi file evidence
    const file = formData.get("file") as File;
    if (!file || file.size === 0) {
      newErrors.file = "Evidence wajib diunggah!";
      hasError = true;
    }

    // Validasi nama pemilik
    const namaPemilik = formData.get("namaPemilik") as string;
    if (!namaPemilik || !namaPemilik.trim()) {
      newErrors.namaPemilik = "Nama pemilik wajib diisi!";
      hasError = true;
    }

    // Validasi nomor bidang lahan
    const bidangLahan = formData.get("bidangLahan") as string;
    if (!bidangLahan || !bidangLahan.trim()) {
      newErrors.bidangLahan = "Nomor bidang lahan wajib diisi!";
      hasError = true;
    }

    if (hasError) {
      setFormErrors(newErrors);
      showAlert("Mohon isi semua form yang wajib diisi!", "error");
      return;
    }

    startTransition(async () => {
      try {
        await formAction(formData);
        setShowSuccessPopup(true);
        setTimeout(() => {
          router.back();
        }, 2000);
      } catch (error) {
        console.error("Error submitting form:", error);
        showAlert("Gagal menyimpan data, coba lagi nanti!", "error");
      }
    });
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
      {session.user.role === "admin" ? (
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
          <form action={handleFormSubmit}>
            <div className="pt-2 bg-transparent border-2 border-gray-400 rounded-md">
              <div className="flex items-center justify-between px-4 m-4">
                <h2 className="text-xl font-bold">Form Evidence</h2>
                <div className="flex justify-end text-base space-x-7">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-32 px-4 py-2 font-semibold text-gray-500 transition duration-200 ease-in-out bg-white border-2 border-gray-500 rounded-lg hover:-translate-1 hover:scale-110 hover:bg-gray-200"
                    disabled={isSubmitting}
                  >
                    BATAL
                  </button>
                  <SubmitButton label="SIMPAN" disabled={isSubmitting} />
                </div>
              </div>
              <hr className="border border-gray-400" />
              <div>
                <div className="h-full pb-2 bg-color9">
                  <div className="flex items-center justify-between h-16 px-4 row-container">
                    <label className="block ml-4 text-base font-semibold text-black">
                      Evidence <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      name="file"
                      accept=".png, .jpg, .jpeg"
                      className={`w-[70%] p-2 mr-8 text-sm transition duration-300 ease-in-out bg-white border-2 ${
                        formErrors.file ? "border-red-500" : "border-gray-400"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 file:py-1 file:px-3 file:mr-2 file:rounded-sm file:border-0 file:bg-gray-200 hover:file:bg-blue-200 file:cursor-pointer file:text-sm file:font-medium file:text-gray-700 file:shadow-md`}
                    />
                  </div>
                  <div className="flex justify-between w-full mt-[-6px]">
                    <div className="w-4/12"></div>
                    <div className="w-10/12 text-red-500 text-[12px]">
                      <span>{formErrors.file || state?.Error?.file}</span>
                    </div>
                  </div>
                </div>
                <div className="h-full pb-2 bg-white">
                  <div className="flex items-center justify-between h-16 px-4 row-container">
                    <label className="block ml-4 text-base font-semibold text-black">
                      Nama Pemilik <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="namaPemilik"
                      className={`w-[70%] p-2 text-sm font-medium placeholder-gray-400 transition duration-300 ease-in-out bg-white border-2 ${
                        formErrors.namaPemilik
                          ? "border-red-500"
                          : "border-gray-400"
                      } rounded-md mr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400`}
                      placeholder="Masukkan nama pemilik"
                    />
                  </div>
                  <div className="flex justify-between w-full mt-[-7px]">
                    <div className="w-4/12"></div>
                    <div className="w-10/12 text-red-500 text-[12px]">
                      <span>
                        {formErrors.namaPemilik || state?.Error?.namaPemilik}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-full pb-2 rounded-b bg-color9">
                  <div className="flex items-center justify-between h-16 px-4 row-container">
                    <label className="block ml-4 text-base font-semibold text-black">
                      No. Bidang Lahan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="bidangLahan"
                      className={`w-[70%] p-2 text-sm font-medium placeholder-gray-400 transition duration-300 ease-in-out bg-white border-2 ${
                        formErrors.bidangLahan
                          ? "border-red-500"
                          : "border-gray-400"
                      } rounded-md mr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400`}
                      placeholder="Masukkan nomor bidang lahan"
                    />
                  </div>
                  <div className="flex justify-between w-full mt-[-7px]">
                    <div className="w-4/12"></div>
                    <div className="w-10/12 text-red-500 text-[12px]">
                      <span>
                        {formErrors.bidangLahan || state?.Error?.bidangLahan}
                      </span>
                    </div>
                  </div>
                </div>
                <input type="hidden" name="desaId" value={formId} />
                <input type="hidden" name="id" value={id} />
              </div>
            </div>
            <div className="justify-center">
              <span className="text-[12px] leading-none text-justify font-bold text-red-500">
                {state?.message}
              </span>
            </div>
          </form>
        </motion.div>
      ) : (
        <div>
          <p className="flex items-center justify-center py-48 m-4 text-2xl font-bold text-center text-gray-500">
            404 | HALAMAN TIDAK DITEMUKAN
          </p>
        </div>
      )}
      <SuccessPopup
        message="Data berhasil disimpan, silakan refresh!"
        isVisible={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
      />
    </div>
  );
};

export default FormEvidence;
