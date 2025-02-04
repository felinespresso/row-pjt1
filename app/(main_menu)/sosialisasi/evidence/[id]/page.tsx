"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

interface Evidence {
  id: string;
  file: string;
}

interface SosialisasiData {
  id: string;
  namaDesa: string;
  spanTower: string;
  evidence: Evidence[];
}

export default function EvidencePage() {
  const params = useParams();
  const [data, setData] = useState<SosialisasiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/sosialisasi/${params.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.error) {
          throw new Error(result.error);
        }
        setData(result);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Link href="/sosialisasi">
          <button className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-800">
            <FaArrowLeft /> Kembali
          </button>
        </Link>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <Link href="/sosialisasi">
          <button className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-800">
            <FaArrowLeft /> Kembali
          </button>
        </Link>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Data tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <Link href="/sosialisasi">
        <button className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-800">
          <FaArrowLeft /> Kembali
        </button>
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Evidence {data.namaDesa}</h1>
          <p className="text-gray-600">{data.spanTower}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.evidence.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <img
                src={`/api/sosialisasi/${params.id}/evidence/${item.id}`}
                alt="Evidence"
                className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setSelectedImage(`/api/sosialisasi/${params.id}/evidence/${item.id}`)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-image.jpg";
                  target.alt = "Gagal memuat gambar";
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal untuk menampilkan gambar */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Evidence Preview"
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 text-white text-xl bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
