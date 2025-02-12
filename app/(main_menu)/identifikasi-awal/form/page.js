"use client";
import { useRouter } from "next/navigation";
import { useState, startTransition } from "react";
import { saveIdentifikasi } from "@/lib/identifikasi/action";
import React, { useActionState } from "react";
import { MdAddCircleOutline, MdRemoveCircleOutline } from "react-icons/md";
import { SubmitButton } from "@/app/_components/buttons";
import "./globals.css";

const FormIdentifikasiAwal = () => {
  const router = useRouter();
  const [state, formAction] = useActionState(saveIdentifikasi, null);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    additionalEvidenceInputs.forEach((input, index) => {
      const file = event.target[`file-${index}`]?.files[0];
      const namaPemilik = event.target[`namaPemilik-${index}`]?.value;
      const bidangLahan = event.target[`bidangLahan-${index}`]?.value;
      formData.append(`file-${index}`, file);
      formData.append(`namaPemilik-${index}`, namaPemilik);
      formData.append(`bidangLahan-${index}`, bidangLahan);
    });

    startTransition(() => {
      formAction(formData);
    });
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

  // console.log(state);

  return (
    <div className="px-6 pt-32 pb-20">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <form action={formAction} onSubmit={handleFormSubmit}>
          <div className="pt-2 bg-transparent border-2 border-gray-400 rounded-md">
            <div className="flex items-center justify-between px-4 m-4">
              <h2 className="text-xl font-bold">Form Identifikasi Awal</h2>
              <div className="flex justify-end text-base space-x-7">
                <button
                  type="button"
                  onClick={() => router.push("/identifikasi-awal")}
                  className="w-32 px-4 py-2 font-semibold text-gray-500 transition duration-200 ease-in-out bg-white border-2 border-gray-500 rounded-lg hover:-translate-1 hover:scale-110 hover:bg-gray-200"
                >
                  {" "}
                  BATAL
                </button>
                <SubmitButton label="save" />
              </div>
            </div>
            <hr className="border border-gray-400" />

            <div>
              <div className="h-full pb-2 bg-color9">
                <div className="flex items-center justify-between h-16 px-4 row-container">
                  <label className="block ml-3 text-base font-semibold text-black">
                    Nama Desa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namadesa"
                    className="w-[70%] p-2 text-sm font-medium placeholder-gray-400 transition duration-300 ease-in-out bg-white border-2 border-gray-400 rounded-md mr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                    placeholder="Masukkan nama desa"
                  />
                </div>
                <div className="flex justify-between w-full mt-[-7px]">
                  <div className="w-4/12"></div>
                  <div
                    id="namadesa-error"
                    className="w-11/12 text-red-500 text-[12px]"
                  >
                    <span>{state?.Error?.namadesa}</span>
                  </div>
                </div>
              </div>
              <div className="h-full pb-2 bg-white">
                <div className="flex items-center justify-between h-16 px-4 row-container">
                  <label className="block ml-3 text-base font-semibold text-black">
                    Nomor Span Tower <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="spantower"
                    className="w-[70%] p-2 text-sm font-medium placeholder-gray-400 transition duration-300 ease-in-out bg-white border-2 border-gray-400 rounded-md mr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                    placeholder="Masukkan span tower"
                  />
                </div>
                <div className="flex justify-between w-full mt-[-7px]">
                  <div className="w-4/12"></div>
                  <div
                    id="spantower-error"
                    className="w-11/12 text-red-500 text-[12px]"
                  >
                    <span>{state?.Error?.spantower}</span>
                  </div>
                </div>
              </div>
              <div className="h-full pb-1 bg-color9">
                <div className="flex items-center justify-between h-16 px-4 row-container">
                  <label className="block ml-3 text-base font-semibold text-black">
                    Tanggal Pelaksanaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="tanggal"
                    className="w-[70%] px-2 py-1 text-sm font-medium placeholder-gray-400 transition duration-300 ease-in-out bg-white border-2 border-gray-400 rounded-md mr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                    placeholder="Masukkan tanggal pelaksanaan"
                  />
                </div>
                <div className="flex justify-between w-full mt-[-7px]">
                  <div className="w-4/12"></div>
                  <div
                    id="tanggal-error"
                    className="w-11/12 text-red-500 text-[12px]"
                  >
                    <span>{state?.Error?.tanggal}</span>
                  </div>
                </div>
              </div>
              <div className="h-full pb-2 bg-white">
                <div className="flex items-center justify-between h-16 px-4 row-container">
                  <label className="block ml-3 text-base font-semibold text-black">
                    Hasil Foto Udara <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="fotoudara"
                    accept=".pdf, .doc, .docx, .xls, .xlsx"
                    className="w-[70%] p-2 mr-14 text-sm transition duration-300 ease-in-out bg-white border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 file:py-1 file:px-3 file:mr-2 file:rounded-sm file:border-0 file:bg-gray-200 hover:file:bg-blue-200 file:cursor-pointer file:text-sm file:font-medium file:text-gray-700 file:shadow-md"
                  />
                </div>
                <div className="flex justify-between w-full mt-[-6px]">
                  <div className="w-4/12"></div>
                  <div
                    id="fotoudara-error"
                    className="w-11/12 text-red-500 text-[12px]"
                  >
                    <span>{state?.Error?.fotoudara}</span>
                  </div>
                </div>
              </div>
              <div className="h-full px-4 pt-3 pb-4 bg-color9">
                <div className="grid grid-cols-1 gap-12 pl-3 pr-1 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col">
                    <label className="block pb-2 text-base font-semibold text-black">
                      Evidence 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      name="file"
                      accept=".png, .jpg, .jpeg"
                      className="w-full min-w-0 p-2 text-sm bg-white border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 file:py-1 file:px-3 file:mr-2 file:rounded-sm file:border-0 file:bg-gray-200 hover:file:bg-blue-200 file:cursor-pointer file:text-sm file:font-medium file:text-gray-700 file:shadow-md"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block pt-[3px] pb-2 text-base font-semibold text-black">
                      Nama Pemilik
                    </label>
                    <input
                      type="text"
                      name="namaPemilik"
                      className="w-full min-w-0 py-[9px] px-2 text-sm font-medium placeholder-gray-400 bg-white border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                      placeholder="Masukkan nama pemilik"
                    />
                  </div>
                  <div className="flex items-center">
                    <div className="flex flex-col flex-grow">
                      <label className="block pb-2 text-base font-semibold text-black">
                        No. Bidang Lahan
                      </label>
                      <input
                        type="number"
                        name="bidangLahan"
                        className="w-full min-w-0 p-2 text-sm font-medium placeholder-gray-400 bg-white border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                        placeholder="Masukkan nomor bidang lahan"
                      />
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
                <div key={input.id} className="h-full px-4 pt-3 pb-4 bg-color9">
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
                        className="w-full min-w-0 p-2 text-sm bg-white border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 file:py-1 file:px-3 file:mr-2 file:rounded-sm file:border-0 file:bg-gray-200 hover:file:bg-blue-200 file:cursor-pointer file:text-sm file:font-medium file:text-gray-700 file:shadow-md"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="block pt-[3px] pb-2 text-base font-semibold text-black">
                        Nama Pemilik
                      </label>
                      <input
                        type="text"
                        name={`namaPemilik-${index}`}
                        className="w-full min-w-0 py-[9px] px-2 text-sm font-medium placeholder-gray-400 bg-white border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                        placeholder="Masukkan nama pemilik"
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="flex flex-col flex-grow">
                        <label className="block pb-2 text-base font-semibold text-black">
                          No. Bidang Lahan
                        </label>
                        <input
                          type="number"
                          name={`bidangLahan-${index}`}
                          className="w-full min-w-0 p-2 text-sm font-medium placeholder-gray-400 bg-white border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                          placeholder="Masukkan nomor bidang lahan"
                        />
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
      </div>
    </div>
  );
};

export default FormIdentifikasiAwal;
