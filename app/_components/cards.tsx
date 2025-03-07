"use client";
import { useState } from "react";
import { useAlert } from "@/app/_contexts/AlertContext";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import SuccessPopup from "./SuccessPopup";
import { FaRegTrashAlt } from "react-icons/fa";

interface CardProps {
  data: any;
  itemId: string;
  identifikasiId: string;
}

export default function Card({ data, itemId, identifikasiId }: CardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const { showAlert } = useAlert();

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `/api/identifikasi/${identifikasiId}/evidence/${data.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Gagal menghapus evidence");

      setShowSuccessPopup(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      showAlert("Gagal menghapus evidence", "error");
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="group">
        {/* ... existing card content ... */}
        <button
          onClick={handleDeleteClick}
          className="p-2 transition-colors duration-200 bg-red-500 rounded-md shadow-lg hover:bg-red-600"
        >
          <FaRegTrashAlt className="text-lg text-white" />
        </button>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="KONFIRMASI HAPUS EVIDENCE"
        message="Apakah Anda yakin ingin menghapus evidence ini?"
      />

      <SuccessPopup
        message="Evidence berhasil dihapus"
        isVisible={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
      />
    </>
  );
}