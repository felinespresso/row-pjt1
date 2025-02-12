import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";

interface AlertPopupProps {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
}

const AlertPopup = ({ message, type, isVisible, onClose }: AlertPopupProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-4 left-0 right-0 mx-auto z-50 flex justify-center"
        >
          <div
            className="flex items-center gap-3 w-[90%] max-w-md px-4 py-3 rounded-lg shadow-lg bg-white border-l-4 border-r-4 border-t-2 border-b-2 border-opacity-50"
            style={{
              borderColor: type === "success" ? "#22c55e" : "#ef4444",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div className="flex items-center gap-3 w-[90%] max-w-md px-4 py-3 rounded-lg shadow-lg bg-white border-l-4 border-r-4 border-t-2 border-b-2 border-green-500 border-opacity-50">
              {type === "success" ? (
                <IoMdCheckmarkCircleOutline className="w-6 h-6 text-green-500" />
              ) : (
                <MdErrorOutline className="w-6 h-6 text-red-500" />
              )}
            </div>
            <p className="flex-1 text-sm font-semibold text-gray-600">
              {message}
            </p>
            <button
              onClick={onClose}
              className="px-3 py-1 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              OK
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertPopup;
