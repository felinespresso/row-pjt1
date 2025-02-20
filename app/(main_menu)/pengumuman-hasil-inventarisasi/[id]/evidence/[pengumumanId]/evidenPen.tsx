"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaRegTrashAlt } from "react-icons/fa";
import { MdAddCircleOutline, MdOutlineEdit } from "react-icons/md";
import { motion } from "framer-motion";
import { useAlert } from "@/app/_context/AlertContext";
import LoadingIndicator from "@/app/_components/LoadingIndicator";
import DeleteConfirmationModal from "@/app/_components/DeleteConfirmationModal";
import SuccessPopup from "@/app/_components/SuccessPopup";

interface Evidence {
  id: string;
  file: string;
  fileName: string;
}

interface PengumumanData {
  id: string;
  namaDesa: string;
  spanTower: string;
  evidence: Evidence[];
}

export default function EvidencePage({ session }: { session: any }) {
  const { id, pengumumanId } = useParams();
  const router = useRouter();
  const { showAlert } = useAlert();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<PengumumanData | null>(null);
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedEditId, setSelectedEditId] = useState<string | null>(null);

  const fetchEvidenceData = async (pageNum: number) => {
    try {
      const response = await fetch(
        `/api/pengumuman/${pengumumanId}/evidence?page=${pageNum}&limit=9`
      );
      if (!response.ok) throw new Error("Failed to fetch evidence");

      const result = await response.json();
      setEvidenceList((prev) =>
        pageNum === 1 ? result.evidence : [...prev, ...result.evidence]
      );
      setHasMore(result.currentPage < result.totalPages);
    } catch (error) {
      console.error("Error fetching evidence:", error);
      setError(error instanceof Error ? error.message : "Terjadi kesalahan");
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const pengumumanResponse = await fetch(
          `/api/pengumuman/${pengumumanId}`
        );
        if (!pengumumanResponse.ok)
          throw new Error("Failed to fetch pengumuman data");

        const pengumumanData = await pengumumanResponse.json();
        setData(pengumumanData);

        await fetchEvidenceData(1); // Ambil evidence setelah data pengumuman berhasil dimuat
      } catch (error) {
        console.error("Error:", error);
        setError(error instanceof Error ? error.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [pengumumanId]);

  const handleAddEvidence = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !pengumumanId) return;

    const formData = new FormData();
    Array.from(e.target.files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(`/api/pengumuman/${pengumumanId}/evidence`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();
      setEvidenceList((prev) => [...prev, ...result.evidence]);
      setSuccessMessage("Evidence berhasil ditambahkan");
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error:", error);
      showAlert("Gagal mengunggah evidence", "error");
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId || !pengumumanId) return;

    try {
      const response = await fetch(
        `/api/pengumuman/${pengumumanId}/evidence/${deleteTargetId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Delete failed");

      setEvidenceList((prev) => prev.filter((ev) => ev.id !== deleteTargetId));
      setSuccessMessage("Evidence berhasil dihapus");
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error:", error);
      showAlert("Gagal menghapus evidence", "error");
    } finally {
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedEditId) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `/api/pengumuman/${pengumumanId}/evidence/${selectedEditId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Gagal memperbarui evidence");

      const updatedEvidence = await response.json();
      setEvidenceList((prev) =>
        prev.map((ev) =>
          ev.id === selectedEditId ? { ...ev, fileName: file.name } : ev
        )
      );

      setSuccessMessage("Evidence berhasil diperbarui, silakan refresh!");
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error:", error);
      showAlert("Gagal memperbarui evidence", "error");
    } finally {
      setSelectedEditId(null);
    }
  };

  const handleEdit = (id: string) => {
    setSelectedEditId(id);
    editFileInputRef.current?.click();
  };

  const loadMore = async () => {
    if (!pengumumanId) return;

    try {
      const nextPage = page + 1;
      await fetchEvidenceData(nextPage);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more evidence:", error);
      showAlert("Gagal memuat lebih banyak evidence", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-6 pt-32 pb-20"
    >
      <div className="flex items-center justify-between mb-6">
        <Link href={`/pengumuman-hasil-inventarisasi/${id}`}>
          <button className="flex items-center gap-2 text-blue-3 hover:text-blue-4">
            <FaArrowLeft /> Kembali
          </button>
        </Link>
        {session.user.role === "admin" ? (
          <button
            onClick={handleAddEvidence}
            className="px-4 py-2 text-white transition duration-200 ease-in-out bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3 rounded-xl"
          >
            <div className="flex items-center space-x-3 text-sm font-semibold uppercase">
              <MdAddCircleOutline className="text-xl" />
              <span>TAMBAH EVIDENCE</span>
            </div>
          </button>
        ) : null}
      </div>

      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Evidence {data?.namaDesa}</h1>
          <h2 className="text-sm font-semibold text-color3">
            {data?.spanTower}
          </h2>
        </div>

        {evidenceList.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-xl text-gray-500">Tidak ada evidence</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {evidenceList.map((item) => (
              <div key={item.id} className="group">
                <div className="overflow-hidden bg-white rounded-lg shadow-md">
                  <div className="relative">
                    <img
                      src={`/api/pengumuman/${pengumumanId}/evidence/${item.id}`}
                      alt={item.fileName || "Evidence"}
                      className="object-cover w-full h-64 transition-transform duration-300 cursor-pointer group-hover:scale-105"
                      onClick={() => {
                        setSelectedImage(
                          `/api/pengumuman/${pengumumanId}/evidence/${item.id}`
                        );
                        setSelectedTitle(item.fileName || null);
                      }}
                    />
                    {session.user.role === "admin" ? (
                      <div className="absolute z-10 flex gap-2 transition-opacity duration-300 opacity-0 bottom-2 right-2 group-hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item.id);
                          }}
                          className="p-2 transition-colors duration-200 rounded-md shadow-lg bg-color5 hover:bg-color8"
                        >
                          <MdOutlineEdit className="text-xl text-white" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(item.id);
                          }}
                          className="p-2 transition-colors duration-200 bg-red-500 rounded-md shadow-lg hover:bg-red-600"
                        >
                          <FaRegTrashAlt className="text-lg text-white" />
                        </button>
                      </div>
                    ) : null}
                  </div>

                  <div className="p-3 border-t">
                    <p
                      className="text-sm text-gray-600 truncate"
                      title={item.fileName || "Untitled"}
                    >
                      {item.fileName || "Untitled"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasMore && (
          <div className="mt-4 text-center">
            <button
              onClick={loadMore}
              className="px-4 py-2 font-semibold text-white transition duration-200 ease-in-out rounded-lg bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3"
            >
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        multiple
        accept="image/*"
      />

      <input
        type="file"
        ref={editFileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
          onClick={() => {
            setSelectedImage(null);
            setSelectedTitle(null);
          }}
        >
          <div className="relative max-width-4xl">
            <img
              src={selectedImage}
              alt="Evidence Preview"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute w-10 h-10 p-2 text-xl font-bold text-white bg-black bg-opacity-50 rounded-full top-4 right-4 hover:bg-opacity-75"
              onClick={() => {
                setSelectedImage(null);
                setSelectedTitle(null);
              }}
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus Evidence"
        message="Apakah Anda yakin ingin menghapus evidence ini?"
      />

      <SuccessPopup
        message={successMessage}
        isVisible={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
      />
    </motion.div>
  );
}
