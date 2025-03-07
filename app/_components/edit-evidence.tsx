"use client";
import { useRouter } from "next/navigation";
import { editEvidence } from "@/lib/identifikasi/action";
import React, {
  useActionState,
  useState,
  useEffect,
  useTransition,
} from "react";
import { SubmitButton } from "./buttons";
import type { Evidences } from "@prisma/client";
import { motion } from "framer-motion";
import SaveLoading from "./SaveLoading";
import SuccessPopup from "./SuccessPopup";
import { useSession } from "next-auth/react";

const EditEvidence = ({
  data,
  itemId,
  identifikasiId,
}: {
  data: Evidences;
  itemId: string;
  identifikasiId: string;
}) => {
  const router = useRouter();
  const EditIdentifikasiWithId = editEvidence.bind(
    null,
    data.id,
    itemId,
    identifikasiId
  );
  const [state, formAction] = useActionState(EditIdentifikasiWithId, null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

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

  // Handle form submission
  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await formAction(formData);
        setShowSuccessPopup(true);
        setTimeout(() => {
          router.back();
        }, 2000);
      } catch (error) {
        console.error("Error:", error);
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
      {session?.user?.role === "admin" && (
        <div>
          {/* Tampilkan SaveLoading saat isSubmitting true */}
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
            <form action={handleSubmit}>
              <div className="pt-2 bg-transparent border-2 border-gray-400 rounded-md">
                <div className="flex items-center justify-between px-4 m-4">
                  <h2 className="text-xl font-bold">Form Edit Evidence</h2>
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
                        className="w-[70%] p-2 mr-8 text-sm transition duration-300 ease-in-out bg-white border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 file:py-1 file:px-3 file:mr-2 file:rounded-sm file:border-0 file:bg-gray-200 hover:file:bg-blue-200 file:cursor-pointer file:text-sm file:font-medium file:text-gray-700 file:shadow-md"
                      />
                    </div>
                    <div className="flex justify-between w-full mt-[-6px]">
                      <div className="w-4/12"></div>
                      <div
                        id="file-error"
                        className="w-10/12 text-red-500 text-[12px]"
                      >
                        <span>{state?.Error?.file}</span>
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
                        className="w-[70%] p-2 text-sm font-medium placeholder-gray-400 transition duration-300 ease-in-out bg-white border-2 border-gray-400 rounded-md mr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                        placeholder="Masukkan nama pemilik"
                        defaultValue={data.namaPemilik}
                      />
                    </div>
                    <div className="flex justify-between w-full mt-[-7px]">
                      <div className="w-4/12"></div>
                      <div
                        id="namaPemilik-error"
                        className="w-10/12 text-red-500 text-[12px]"
                      >
                        <span>{state?.Error?.namaPemilik}</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-full pb-2 bg-color9">
                    <div className="flex items-center justify-between h-16 px-4 row-container">
                      <label className="block ml-4 text-base font-semibold text-black">
                        No. Bidang Lahan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="bidangLahan"
                        className="w-[70%] p-2 text-sm font-medium placeholder-gray-400 transition duration-300 ease-in-out bg-white border-2 border-gray-400 rounded-md mr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                        placeholder="Masukkan nomor bidang lahan"
                        defaultValue={data.bidangLahan!}
                      />
                    </div>
                    <div className="flex justify-between w-full mt-[-7px]">
                      <div className="w-4/12"></div>
                      <div
                        id="spantower-error"
                        className="w-10/12 text-red-500 text-[12px]"
                      >
                        <span>{state?.Error?.bidangLahan}</span>
                      </div>
                    </div>
                  </div>
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

          <SuccessPopup
            message="Data berhasil diperbarui"
            isVisible={showSuccessPopup}
            onClose={() => setShowSuccessPopup(false)}
          />
        </div>
      )}
    </div>
  );
};

export default EditEvidence;
