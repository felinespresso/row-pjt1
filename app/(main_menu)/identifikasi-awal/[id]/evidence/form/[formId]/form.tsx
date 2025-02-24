"use client";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { SubmitButton } from "@/app/_components/buttons";
import { FaArrowLeft, FaRegTrashAlt } from "react-icons/fa";
import Link from "next/link";
import { useParams } from "next/navigation";
import { uploadEvidence } from "@/lib/identifikasi/action";

const FormEvidence = ({ session }: { session: any }) => {
  const router = useRouter();
  const [state, formAction] = useActionState(uploadEvidence, null);
  const { id, formId, identifikasiId } = useParams();

  return (
    <div className="px-6 pt-32 pb-20">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        {session.user.role === "admin" ? (
          <form action={formAction}>
            <div className="pt-2 bg-transparent border-2 border-gray-400 rounded-md">
              <div className="flex items-center justify-between px-4 m-4">
                <h2 className="text-xl font-bold">Form Evidence</h2>
                <div className="flex justify-end text-base space-x-7">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-32 px-4 py-2 font-semibold text-gray-500 transition duration-200 ease-in-out bg-white border-2 border-gray-500 rounded-lg hover:-translate-1 hover:scale-110 hover:bg-gray-200"
                  >
                    BATAL
                  </button>
                  <SubmitButton label="save" />
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
                      aria-live="polite"
                      aria-atomic="true"
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
                    />
                  </div>
                  <div className="flex justify-between w-full mt-[-7px]">
                    <div className="w-4/12"></div>
                    <div
                      aria-live="polite"
                      aria-atomic="true"
                      id="namaPemilik-error"
                      className="w-10/12 text-red-500 text-[12px]"
                    >
                      <span>{state?.Error?.namaPemilik}</span>
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
                      className="w-[70%] p-2 text-sm font-medium placeholder-gray-400 transition duration-300 ease-in-out bg-white border-2 border-gray-400 rounded-md mr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                      placeholder="Masukkan nomor bidang lahan"
                    />
                  </div>
                  <div className="flex justify-between w-full mt-[-7px]">
                    <div className="w-4/12"></div>
                    <div
                      aria-live="polite"
                      aria-atomic="true"
                      id="spantower-error"
                      className="w-10/12 text-red-500 text-[12px]"
                    >
                      <span>{state?.Error?.bidangLahan}</span>
                    </div>
                  </div>
                </div>
                <input type="hidden" name="desaId" value={formId} />
                <input type="hidden" name="id" value={id} />
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
        ) : null}
      </div>
    </div>
  );
};

export default FormEvidence;
