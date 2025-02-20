"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

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

export default function EditInventarisasi() {
  const router = useRouter();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bangunanOptions, setBangunanOptions] = useState<JenisBangunan[]>([]);
  const [tanamanOptions, setTanamanOptions] = useState<JenisTanaman[]>([]);
  const [form, setForm] = useState({
    span: "",
    bidanglahan: "",
    formulir: "",
    pelaksanaan: "",
    namapemilik: "",
    nik: "",
    ttl: "",
    desakelurahan: "",
    kecamatan: "",
    kabupatenkota: "",
    alashak: "",
    luastanah: "",
    jnsbangunan: [] as JenisBangunan[],
    jnstanaman: [] as JenisTanaman[],
  });

  useEffect(() => {
    const fetchInventarisasi = async () => {
      try {
        const response = await fetch(`/api/invents/${id}`);
        const data = await response.json();

        setForm({
          ...data,
          pelaksanaan: data.pelaksanaan
            ? new Date(data.pelaksanaan).toISOString().split("T")[0]
            : "",
          jnsbangunan: data.relevantBangunan,
          jnstanaman: data.relevantTanaman,
          formulir: data.formulir,
        });
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

    if (id) {
      fetchInventarisasi();
      fetchOptions();
    }
  }, [id]);

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

      formData.append("jnsbangunan", JSON.stringify(form.jnsbangunan));
      formData.append("jnstanaman", JSON.stringify(form.jnstanaman));

      if (selectedFile) {
        formData.append("formulir", selectedFile);
      }

      const response = await fetch(`/api/invents/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Gagal mengupdate data");
      }

      router.push("/inventarisasi");
      router.refresh();
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
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="bg-transparent rounded-md border-2 border-gray-400">
            <div className="flex justify-between items-center m-4">
              <h2 className="text-2xl font-bold">Edit Data Inventarisasi</h2>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => router.push("/inventarisasi")}
                  className="transition ease-in-out duration-200 bg-white hover:-translate-1 hover:scale-110 hover:bg-gray-200 duration-300 px-4 py-2 text-gray-500 border-2 border-gray-500 rounded-lg font-semibold w-32"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="transition ease-in-out duration-200 bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3 px-4 py-2 text-white rounded-lg font-semibold w-32"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
            {/* Halaman 1: Data Inventarisasi */}
            <div>
              <div className="row-container flex justify-between items-center">
                <label className="block text-sm font-semibold text-black ml-3">
                  Span Tower
                </label>
                <input
                  type="text"
                  value={form.span}
                  onChange={(e) => setForm({ ...form, span: e.target.value })}
                  className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  placeholder="Masukkan span tower"
                />
              </div>
              <div className="row-container flex justify-between items-center">
                <label className="block text-sm font-semibold text-black ml-3">
                  No. Bidang Lahan
                </label>
                <input
                  type="text"
                  value={form.bidanglahan}
                  onChange={(e) =>
                    setForm({ ...form, bidanglahan: e.target.value })
                  }
                  className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  placeholder="Masukkan nomor bidang lahan"
                />
              </div>
              <div className="row-container flex justify-between items-center">
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
                  {form.formulir && (
                    <p className="mt-1 text-sm text-gray-500">
                      File sebelumnya: {form.formulir}
                    </p>
                  )}
                </div>
              </div>
              <div className="row-container flex justify-between items-center">
                <label className="block text-sm font-semibold text-black ml-3">
                  Nama Pemilik
                </label>
                <input
                  type="text"
                  value={form.namapemilik}
                  onChange={(e) =>
                    setForm({ ...form, namapemilik: e.target.value })
                  }
                  className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  placeholder="Masukkan nama pemilik"
                />
              </div>
              <div className="row-container flex justify-between items-center">
                <label className="block text-sm font-semibold text-black ml-3">
                  NIK
                </label>
                <input
                  type="number"
                  value={form.nik}
                  onChange={(e) => setForm({ ...form, nik: e.target.value })}
                  className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  placeholder="Masukkan NIK"
                />
              </div>
              <div className="row-container flex justify-between items-center">
                <label className="block text-sm font-semibold text-black ml-3">
                  Tempat Tanggal Lahir
                </label>
                <input
                  type="text"
                  value={form.ttl}
                  onChange={(e) => setForm({ ...form, ttl: e.target.value })}
                  className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  placeholder="Masukkan tempat tanggal lahir"
                />
              </div>
              <div className="row-container flex justify-between items-center">
                <label className="block text-sm font-semibold text-black ml-3">
                  Desa/Kelurahan
                </label>
                <input
                  type="text"
                  value={form.desakelurahan}
                  onChange={(e) =>
                    setForm({ ...form, desakelurahan: e.target.value })
                  }
                  className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  placeholder="Masukkan nama desa/kelurahan"
                />
              </div>
              <div className="row-container flex justify-between items-center">
                <label className="block text-sm font-semibold text-black ml-3">
                  Kecamatan
                </label>
                <input
                  type="text"
                  value={form.kecamatan}
                  onChange={(e) =>
                    setForm({ ...form, kecamatan: e.target.value })
                  }
                  className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  placeholder="Masukkan nama kecamatan"
                />
              </div>
              <div className="row-container flex justify-between items-center">
                <label className="block text-sm font-semibold text-black ml-3">
                  Kabupaten/Kota
                </label>
                <input
                  type="text"
                  value={form.kabupatenkota}
                  onChange={(e) =>
                    setForm({ ...form, kabupatenkota: e.target.value })
                  }
                  className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  placeholder="Masukkan nama kabupaten/kota"
                />
              </div>
              <div className="row-container flex justify-between items-center rounded-b">
                <label className="block text-sm font-semibold text-black ml-3">
                  Tanggal Pelaksanaan
                </label>
                <input
                  type="date"
                  value={form.pelaksanaan}
                  onChange={(e) =>
                    setForm({ ...form, pelaksanaan: e.target.value })
                  }
                  className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  placeholder="Masukkan tanggal pelaksanaan"
                />
              </div>
            </div>

            {/* Halaman 2: Jenis Bangunan */}
            <div>
              <div className="row-container flex justify-between items-center">
                <label className="block text-sm font-semibold text-black ml-3">
                  Alas Hak
                </label>
                <input
                  type="text"
                  value={form.alashak}
                  onChange={(e) =>
                    setForm({ ...form, alashak: e.target.value })
                  }
                  className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  placeholder="Masukkan alas hak"
                />
              </div>
              <div className="row-container flex justify-between items-center">
                <label className="block text-sm font-semibold text-black ml-3">
                  Luas Tanah
                </label>
                <input
                  type="text"
                  value={form.luastanah}
                  onChange={(e) =>
                    setForm({ ...form, luastanah: e.target.value })
                  }
                  className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  placeholder="Masukkan luas tanah"
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">Jenis Bangunan</h2>
              <select
                multiple
                value={form.jnsbangunan.map((b) => b.id)}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions)
                    .map((option) => {
                      const selectedBangunan = bangunanOptions.find(
                        (b) => b.id === parseInt(option.value)
                      );
                      return selectedBangunan ? selectedBangunan : null;
                    })
                    .filter(Boolean) as JenisBangunan[];
                  setForm({ ...form, jnsbangunan: selectedOptions });
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                {bangunanOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.namabangunan}
                  </option>
                ))}
              </select>
            </div>

            {/* Halaman 3: Jenis Tanaman */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Jenis Tanaman</h2>
              <select
                multiple
                value={form.jnstanaman.map((t) => t.id)}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions)
                    .map((option) => {
                      const selectedTanaman = tanamanOptions.find(
                        (t) => t.id === parseInt(option.value)
                      );
                      return selectedTanaman ? selectedTanaman : null;
                    })
                    .filter(Boolean) as JenisTanaman[];
                  setForm({ ...form, jnstanaman: selectedOptions });
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                {tanamanOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.namatanaman}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
