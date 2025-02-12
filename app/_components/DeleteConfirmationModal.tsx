import { motion } from "framer-motion";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "KONFIRMASI HAPUS",
  message = "Apakah Anda yakin ingin menghapus item ini?",
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white p-6 rounded-md shadow-lg"
      >
        <h2 className="text-lg font-semibold mb-4 text-red-500">{title}</h2>
        <p>{message}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="mt-2 mr-4 transition ease-in-out duration-200 bg-white border-2 border-gray-500 hover:-translate-1 hover:scale-110 hover:bg-gray-300 text-gray-500 px-4 py-2 rounded-xl font-semibold"
          >
            Tidak
          </button>
          <button
            onClick={onConfirm}
            className="mt-2 transition ease-in-out duration-200 bg-red-500 hover:-translate-1 hover:scale-110 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold"
          >
            Ya
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteConfirmationModal;
