"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from 'react';

type EditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type FormData = {
  namaproyek: string;
  nomorkontrak: string;
  kodeproyek: string;
  tanggalkontrak: string;
  tanggalakhirkontrak: string | null;
  password: string;
};

export default function EditPage({ params }: EditPageProps) {
  const router = useRouter();
  const resolvedParams = use(params); // Menggunakan React.use untuk unwrap params
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    namaproyek: "",
    nomorkontrak: "",
    kodeproyek: "",
    tanggalkontrak: "",
    tanggalakhirkontrak: null,
    password: "",
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/items/${resolvedParams.id}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
        // Memformat tanggal untuk input date
        const formatDate = (dateString: string) => {
          if (!dateString) return null;
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };

        setForm({
          namaproyek: data.namaproyek || "",
          nomorkontrak: data.nomorkontrak || "",
          kodeproyek: data.kodeproyek || "",
          tanggalkontrak: formatDate(data.tanggalkontrak) || "",
          tanggalakhirkontrak: formatDate(data.tanggalakhirkontrak),
          password: data.password || "",
        });
      } catch (error) {
        console.error("Error fetching item:", error);
        alert("Gagal memuat data. Silakan coba lagi.");
      }
    };

    if (resolvedParams.id) {
      fetchItem();
    }
  }, [resolvedParams.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/items`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          id: parseInt(resolvedParams.id),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Gagal memperbarui data. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-200 max-h-full min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <form onSubmit={handleSubmit}>
          <div className="bg-transparent rounded-md border-2 border-gray-400">
            <div className="flex justify-between items-center m-4">
              <h2 className="text-xl font-bold">Edit Proyek ROW</h2>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="transition ease-in-out duration-200 bg-white hover:-translate-1 hover:scale-110 hover:bg-gray-200 duration-300 px-4 py-2 text-gray-500 border-2 border-gray-500 rounded-lg font-semibold w-32"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`transition ease-in-out duration-200 ${
                    isSubmitting
                      ? "bg-gray-400"
                      : "bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3"
                  } px-4 py-2 text-white rounded-lg font-semibold w-32`}
                >
                  {isSubmitting ? "UPDATING..." : "UPDATE"}
                </button>
              </div>
            </div>
            <hr />
            <div>
              <div className="row-container flex justify-between items-center">
                <label className="block text-sm font-semibold text-black ml-3">
                  Nama Proyek
                </label>
                <input
                  type="text"
                  value={form.namaproyek}
                  onChange={(e) => setForm({ ...form, namaproyek: e.target.value })}
                  className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  required
                  placeholder="Masukkan nama proyek"
                />
              </div>
              <div className="row-container flex justify-between items-center">
                <label className="block text-sm font-semibold text-black ml-3">
                  Nomor Kontrak
                </label>
                <input
                  type="text"
                  value={form.nomorkontrak}
                  onChange={(e) => setForm({ ...form, nomorkontrak: e.target.value })}
                  className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  required
                  placeholder="Masukkan nomor kontrak"
                />
              </div>
              <div className="row-container flex justify-between items-center">
                <label className="block text-sm font-semibold text-black ml-3">
                  Kode Proyek
                </label>
                <input
                  type="text"
                  value={form.kodeproyek}
                  onChange={(e) => setForm({ ...form, kodeproyek: e.target.value })}
                  className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  placeholder="Masukkan kode proyek"
                />
              </div>
              <div className="row-container flex justify-between items-center">
                <label className="block text-sm font-semibold text-black ml-3">
                  Tanggal Kontrak
                </label>
                <input
                  type="date"
                  value={form.tanggalkontrak}
                  onChange={(e) => setForm({ ...form, tanggalkontrak: e.target.value })}
                  className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  required
                />
              </div>
              <div className="row-container rounded-b flex justify-between items-center">
                <label className="block text-sm font-semibold text-black ml-3">
                  Tanggal Berakhir Kontrak
                </label>
                <input
                  type="date"
                  value={form.tanggalakhirkontrak || ""}
                  onChange={(e) => setForm({ ...form, tanggalakhirkontrak: e.target.value || null })}
                  className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                />
              </div>
              <div className="row-container flex justify-between items-center rounded-b">
                <label className="block text-sm font-semibold text-black ml-3">
                  Password Proyek
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-8/12 mr-3 p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out hover:border-blue-400"
                  required
                  placeholder="Masukkan password proyek"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
