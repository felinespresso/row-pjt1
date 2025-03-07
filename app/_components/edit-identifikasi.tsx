"use client";
import { useRouter } from "next/navigation";
import { editIdentifikasi } from "@/lib/identifikasi/action";
import React, { useActionState, useState, useEffect, useTransition } from "react";
import "../(main_menu)/identifikasi-awal/[id]/form/globals.css";
import type { Evidences, Identifikasi } from "@prisma/client";
import { motion } from "framer-motion";
import SaveLoading from "@/app/_components/SaveLoading";
import SuccessPopup from "@/app/_components/SuccessPopup";

const EditIdentifikasiAwal = ({
  data,
  itemId
}: {
  data: Identifikasi & { evidence: Evidences[] };
  itemId: string
}) => {
  const router = useRouter();
  const EditIdentifikasiWithId = editIdentifikasi.bind(null, data.id, itemId);
  const [state, formAction] = useActionState(EditIdentifikasiWithId, null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Fetch data dan atur loading state
  useEffect(() => {
    // Simulasi loading untuk menampilkan animasi
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Waktu loading yang singkat untuk menampilkan animasi

    return () => clearTimeout(timer);
  }, []);

  // Pantau status isPending untuk mengatur submitting
  useEffect(() => {
    if (isPending) {
      setSubmitting(true);
    } else {
      const timer = setTimeout(() => {
        setSubmitting(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isPending]);

  // Fungsi untuk menangani submit form
  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      await formAction(formData);
      setShowSuccessPopup(true);
      // Redirect setelah 2 detik
      setTimeout(() => {
        router.push(`/identifikasi-awal/${itemId}`);
      }, 2000);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-32 pb-20">
      {submitting && <SaveLoading />}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="p-6 bg-white rounded-lg shadow-lg"
      >
        <form action={handleSubmit}>
          <div className="pt-2 bg-transparent border-2 border-gray-400 rounded-md">
            <div className="flex items-center justify-between px-4 m-4">
              <h2 className="text-xl font-bold">Form Edit Identifikasi Awal</h2>
              <div className="flex justify-end text-base space-x-7">
                <button
                  type="button"
                  onClick={() => router.push(`/identifikasi-awal/${itemId}`)}
                  className="w-32 px-4 py-2 font-semibold text-gray-500 transition duration-200 ease-in-out bg-white border-2 border-gray-500 rounded-lg hover:-translate-1 hover:scale-110 hover:bg-gray-200"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  disabled={submitting || isPending}
                  className="w-32 px-4 py-2 font-semibold text-white transition duration-200 ease-in-out rounded-lg bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3"
                >
                  {submitting || isPending ? "MENYIMPAN..." : "SIMPAN"}
                </button>
              </div>
            </div>
            <hr className="border border-gray-400" />
            <div>
              <div className="h-full pb-2 bg-color9">
                <div className="flex items-center justify-between h-16 px-4 ">
                  <label className="block ml-4 text-base font-semibold text-black">
                    Nama Desa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namadesa"
                    className="w-[70%] p-2 text-sm font-medium placeholder-gray-400 transition duration-300 ease-in-out bg-white border-2 border-gray-400 rounded-md mr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                    placeholder="Masukkan nama desa"
                    defaultValue={data.namadesa}
                  />
                </div>
                <div className="flex justify-between w-full mt-[-7px]">
                  <div className="w-4/12"></div>
                  <div
                    id="namadesa-error"
                    className="w-10/12 text-red-500 text-[12px]"
                  >
                    <span>{state?.Error?.namadesa}</span>
                  </div>
                </div>
              </div>
              <div className="h-full pb-2 bg-white">
                <div className="flex items-center justify-between h-16 px-4 ">
                  <label className="block ml-4 text-base font-semibold text-black">
                    Nomor Span Tower <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="spantower"
                    className="w-[70%] p-2 text-sm font-medium placeholder-gray-400 transition duration-300 ease-in-out bg-white border-2 border-gray-400 rounded-md mr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                    placeholder="Masukkan span tower"
                    defaultValue={data.spantower}
                  />
                </div>
                <div className="flex justify-between w-full mt-[-7px]">
                  <div className="w-4/12"></div>
                  <div
                    id="spantower-error"
                    className="w-10/12 text-red-500 text-[12px]"
                  >
                    <span>{state?.Error?.spantower}</span>
                  </div>
                </div>
              </div>
              <div className="h-full pb-1 bg-color9">
                <div className="flex items-center justify-between h-16 px-4 ">
                  <label className="block ml-4 text-base font-semibold text-black">
                    Tanggal Pelaksanaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="tanggal"
                    className="w-[70%] px-2 py-1 text-sm font-medium placeholder-gray-400 transition duration-300 ease-in-out bg-white border-2 border-gray-400 rounded-md mr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                    placeholder="Masukkan tanggal pelaksanaan"
                    defaultValue={data.tanggal!}
                  />
                </div>
                <div className="flex justify-between w-full mt-[-7px]">
                  <div className="w-4/12"></div>
                  <div
                    id="tanggal-error"
                    className="w-10/12 text-red-500 text-[12px]"
                  >
                    <span>{state?.Error?.tanggal}</span>
                  </div>
                </div>
              </div>
              <div className="h-full pb-2 bg-white rounded-b">
                <div className="flex items-center justify-between h-16 px-4">
                  <label className="block ml-4 text-base font-semibold text-black">
                    Hasil Foto Udara <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="fotoudara"
                    accept=".pdf, .doc, .docx, .xls, .xlsx"
                    className="w-[70%] p-2 mr-8 text-sm transition duration-300 ease-in-out bg-white border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 file:py-1 file:px-3 file:mr-2 file:rounded-sm file:border-0 file:bg-gray-200 hover:file:bg-blue-200 file:cursor-pointer file:text-sm file:font-medium file:text-gray-700 file:shadow-md"
                  />
                </div>
                <div className="flex justify-between w-full mt-[-6px]">
                  <div className="w-4/12"></div>
                  <div
                    id="fotoudara-error"
                    className="w-10/12 text-red-500 text-[12px]"
                  >
                    <span>{state?.Error?.fotoudara}</span>
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
  );
};

export default EditIdentifikasiAwal;
