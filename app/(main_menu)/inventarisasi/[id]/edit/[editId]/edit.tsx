"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import "./invents.css";
import SaveLoading from "@/app/_components/SaveLoading";
import SuccessPopup from "@/app/_components/SuccessPopup";
import { FaArrowLeft } from "react-icons/fa";

type JenisBangunan = {
  id: number;
  namabangunan: string;
  luasbangunan: string;
};

type JenisTanaman = {
  id: number;
  namatanaman: string;
  produktif: string;
  besar: string;
  kecil: string;
  bibit: string;
};

interface FormData {
  span: string;
  bidanglahan: string;
  formulir: string | null;
  pelaksanaan: string;
  namapemilik: string;
  nik: string;
  ttl: string;
  desakelurahan: string;
  kecamatan: string;
  kabupatenkota: string;
  alashak: string;
  luastanah: string;
  jnsbangunan: {
    bangunanId: number;
    jnsbangunan: JenisBangunan;
  }[];
  jnstanaman: {
    tanamanId: number;
    jnstanaman: JenisTanaman;
  }[];
  pekerjaan: string;
}

export default function EditInventarisasi({ session }: { session: any }) {
  const router = useRouter();
  const { id, editId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bangunanOptions, setBangunanOptions] = useState<JenisBangunan[]>([]);
  const [tanamanOptions, setTanamanOptions] = useState<JenisTanaman[]>([]);
  const [form, setForm] = useState<FormData>({
    span: "",
    bidanglahan: "",
    formulir: null,
    pelaksanaan: "",
    namapemilik: "",
    nik: "",
    ttl: "",
    desakelurahan: "",
    kecamatan: "",
    kabupatenkota: "",
    alashak: "",
    luastanah: "",
    jnsbangunan: [],
    jnstanaman: [],
    pekerjaan: "",
  });

  // Tambahkan state untuk mengelola data bangunan dan tanaman
  const [bangunanData, setBangunanData] = useState<
    {
      id: number;
      namabangunan: string;
      luasbangunan: string;
    }[]
  >([]);

  const [tanamanData, setTanamanData] = useState<
    {
      id: number;
      namatanaman: string;
      produktif: string;
      besar: string;
      kecil: string;
    }[]
  >([]);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const fetchInventarisasi = async () => {
      try {
        const response = await fetch(`/api/invents/${editId}`);
        const data = await response.json();

        setForm({
          span: data.span || "",
          bidanglahan: data.bidanglahan || "",
          formulir: data.formulir || null,
          pelaksanaan: data.pelaksanaan
            ? new Date(data.pelaksanaan).toISOString().split("T")[0]
            : "",
          namapemilik: data.namapemilik || "",
          nik: data.nik || "",
          ttl: data.ttl || "",
          desakelurahan: data.desakelurahan || "",
          kecamatan: data.kecamatan || "",
          kabupatenkota: data.kabupatenkota || "",
          alashak: data.alashak || "",
          luastanah: data.luastanah || "",
          jnsbangunan: data.jnsbangunan || [],
          jnstanaman: data.jnstanaman || [],
          pekerjaan: data.pekerjaan || "",
        });

        // Set data bangunan dan tanaman dari response
        const bangunanInitial = data.jnsbangunan.map((b: any) => ({
          id: b.jnsbangunan.id,
          namabangunan: b.jnsbangunan.namabangunan,
          luasbangunan: b.jnsbangunan.luasbangunan,
        }));
        setBangunanData(bangunanInitial);

        const tanamanInitial = data.jnstanaman.map((t: any) => ({
          id: t.jnstanaman.id,
          namatanaman: t.jnstanaman.namatanaman,
          produktif: t.jnstanaman.produktif,
          besar: t.jnstanaman.besar,
          kecil: t.jnstanaman.kecil,
        }));
        setTanamanData(tanamanInitial);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchOptions = async () => {
      try {
        const [bangunanRes, tanamanRes] = await Promise.all([
          fetch("/api/jenisbangunan"),
          fetch("/api/jenistanaman"),
        ]);

        const bangunanData = await bangunanRes.json();
        const tanamanData = await tanamanRes.json();

        setBangunanOptions(bangunanData);
        setTanamanOptions(tanamanData);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    if (editId) {
      fetchInventarisasi();
      fetchOptions();
    }
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append("span", form.span);
      formData.append("bidanglahan", form.bidanglahan);
      formData.append("pelaksanaan", form.pelaksanaan);
      formData.append("namapemilik", form.namapemilik);
      formData.append("nik", form.nik);
      formData.append("ttl", form.ttl);
      formData.append("desakelurahan", form.desakelurahan);
      formData.append("kecamatan", form.kecamatan);
      formData.append("kabupatenkota", form.kabupatenkota);
      formData.append("alashak", form.alashak);
      formData.append("luastanah", form.luastanah);
      formData.append("pekerjaan", form.pekerjaan);

      formData.append("jnsbangunan", JSON.stringify(form.jnsbangunan));
      formData.append("jnstanaman", JSON.stringify(form.jnstanaman));

      if (selectedFile) {
        formData.append("formulir", selectedFile);
      }

      // PENTING: Tambahkan data bangunan dan tanaman sebagai JSON string
      formData.append("bangunanData", JSON.stringify(bangunanData));
      formData.append("tanamanData", JSON.stringify(tanamanData));

      const response = await fetch(`/api/invents/${editId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Gagal mengupdate data");
      }

      setShowSuccessPopup(true);
      
      // Tunggu sebentar sebelum redirect
      setTimeout(() => {
        router.push(`/inventarisasi/${id}`);
        router.refresh();
      }, 2000);

    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengupdate data. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="px-6 pt-32 pb-20">
            {session.user.role === "admin" ? (
      <div>
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
        <form onSubmit={handleSubmit}>
          <div className="bg-transparent border-2 border-gray-400 rounded-md">
            <div className="flex items-center justify-between m-4">
              <h2 className="text-xl font-bold">Edit Data Inventarisasi</h2>
              <div className="flex justify-end space-x-4">
                <Link href={`/inventarisasi/${id}`}>
                  <button
                    type="button"
                    className="w-32 px-4 py-2 font-semibold text-gray-500 transition duration-200 ease-in-out bg-white border-2 border-gray-500 rounded-lg hover:-translate-1 hover:scale-110 hover:bg-gray-200"
                  >
                    BATAL
                  </button>
                </Link>
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
              <div className="flex items-center justify-between row">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Span Tower
                </label>
                <div className="w-8/12 mr-3">
                  <input
                    type="text"
                    value={form.span}
                    onChange={(e) => setForm({ ...form, span: e.target.value })}
                    className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between row">
                <label className="block ml-3 text-sm font-semibold text-black">
                  No. Bidang Lahan
                </label>
                <div className="w-8/12 mr-3">
                  <input
                    type="text"
                    value={form.bidanglahan}
                    onChange={(e) =>
                      setForm({ ...form, bidanglahan: e.target.value })
                    }
                    className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  />
                </div>
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
                </div>
              </div>

              <div className="flex items-center justify-between row">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Tanggal Pelaksanaan
                </label>
                <div className="w-8/12 mr-3">
                  <input
                    type="date"
                    value={form.pelaksanaan}
                    onChange={(e) =>
                      setForm({ ...form, pelaksanaan: e.target.value })
                    }
                    className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between row">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Nama Pemilik
                </label>
                <div className="w-8/12 mr-3">
                  <input
                    type="text"
                    value={form.namapemilik}
                    onChange={(e) =>
                      setForm({ ...form, namapemilik: e.target.value })
                    }
                    className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between row">
                <label className="block ml-3 text-sm font-semibold text-black">
                  NIK
                </label>
                <div className="w-8/12 mr-3">
                  <input
                    type="number"
                    value={form.nik}
                    onChange={(e) => setForm({ ...form, nik: e.target.value })}
                    className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between row">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Tempat Tanggal Lahir
                </label>
                <div className="w-8/12 mr-3">
                  <input
                    type="text"
                    value={form.ttl}
                    onChange={(e) => setForm({ ...form, ttl: e.target.value })}
                    className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between row">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Desa/Kelurahan
                </label>
                <div className="w-8/12 mr-3">
                  <input
                    type="text"
                    value={form.desakelurahan}
                    onChange={(e) =>
                      setForm({ ...form, desakelurahan: e.target.value })
                    }
                    className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between row">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Kecamatan
                </label>
                <div className="w-8/12 mr-3">
                  <input
                    type="text"
                    value={form.kecamatan}
                    onChange={(e) =>
                      setForm({ ...form, kecamatan: e.target.value })
                    }
                    className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between row">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Kabupaten/Kota
                </label>
                <div className="w-8/12 mr-3">
                  <input
                    type="text"
                    value={form.kabupatenkota}
                    onChange={(e) =>
                      setForm({ ...form, kabupatenkota: e.target.value })
                    }
                    className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between row">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Pekerjaan
                </label>
                <div className="w-8/12 mr-3">
                  <input
                    type="text"
                    value={form.pekerjaan}
                    onChange={(e) =>
                      setForm({ ...form, pekerjaan: e.target.value })
                    }
                    className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between row">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Alas Hak
                </label>
                <div className="w-8/12 mr-3">
                  <input
                    type="text"
                    value={form.alashak}
                    onChange={(e) => setForm({ ...form, alashak: e.target.value })}
                    className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between row">
                <label className="block ml-3 text-sm font-semibold text-black">
                  Luas Tanah
                </label>
                <div className="w-8/12 mr-3">
                  <input
                    type="text"
                    value={form.luastanah}
                    onChange={(e) => setForm({ ...form, luastanah: e.target.value })}
                    className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="mb-2 ml-3 text-lg font-semibold">Jenis Bangunan</h3>
              {bangunanData.map((bangunan, index) => (
                <div key={index} className="p-4 mx-3 mb-4 border-2 border-gray-400 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-black">
                        Nama Bangunan
                      </label>
                      <input
                        type="text"
                        value={bangunan.namabangunan}
                        onChange={(e) => {
                          const newBangunanData = [...bangunanData];
                          newBangunanData[index].namabangunan = e.target.value;
                          setBangunanData(newBangunanData);
                        }}
                        className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-black">
                        Luas Bangunan
                      </label>
                      <input
                        type="text"
                        value={bangunan.luasbangunan}
                        onChange={(e) => {
                          const newBangunanData = [...bangunanData];
                          newBangunanData[index].luasbangunan = e.target.value;
                          setBangunanData(newBangunanData);
                        }}
                        className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h3 className="mb-2 ml-3 text-lg font-semibold">Jenis Tanaman</h3>
              {tanamanData.map((tanaman, index) => (
                <div key={index} className="p-4 mx-3 mb-4 border-2 border-gray-400 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-black">
                        Nama Tanaman
                      </label>
                      <input
                        type="text"
                        value={tanaman.namatanaman}
                        onChange={(e) => {
                          const newTanamanData = [...tanamanData];
                          newTanamanData[index].namatanaman = e.target.value;
                          setTanamanData(newTanamanData);
                        }}
                        className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-black">
                        Produktif
                      </label>
                      <input
                        type="text"
                        value={tanaman.produktif}
                        onChange={(e) => {
                          const newTanamanData = [...tanamanData];
                          newTanamanData[index].produktif = e.target.value;
                          setTanamanData(newTanamanData);
                        }}
                        className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-black">
                        Besar
                      </label>
                      <input
                        type="text"
                        value={tanaman.besar}
                        onChange={(e) => {
                          const newTanamanData = [...tanamanData];
                          newTanamanData[index].besar = e.target.value;
                          setTanamanData(newTanamanData);
                        }}
                        className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-black">
                        Kecil
                      </label>
                      <input
                        type="text"
                        value={tanaman.kecil}
                        onChange={(e) => {
                          const newTanamanData = [...tanamanData];
                          newTanamanData[index].kecil = e.target.value;
                          setTanamanData(newTanamanData);
                        }}
                        className="w-full p-2 transition duration-300 ease-in-out border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </motion.div>

      {isSubmitting && <SaveLoading />}

      <SuccessPopup
        message="Data berhasil disimpan"
        isVisible={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
      />
    </div>
      ) : (
        <div>
          <Link href={`/inventarisasi/${id}`}>
            <button className="flex items-center gap-2 text-blue-3 hover:text-blue-4">
              <FaArrowLeft /> Kembali
            </button>
          </Link>
          <p className="flex items-center justify-center py-48 m-4 text-2xl font-bold text-center text-gray-500">
            404 | HALAMAN TIDAK DITEMUKAN
          </p>
        </div>
      )}
    </div>
  );
}
