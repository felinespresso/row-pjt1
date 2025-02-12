import { motion, AnimatePresence } from "framer-motion";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

interface SuccessPopupProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const SuccessPopup = ({ message, isVisible, onClose }: SuccessPopupProps) => {
  if (isVisible) {
    setTimeout(onClose, 3000);
  }

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
          <div className="flex items-center gap-3 w-[90%] max-w-md px-4 py-3 rounded-lg shadow-lg bg-white border-l-4 border-r-4 border-t-2 border-b-2 border-green-500 border-opacity-50">
            <IoMdCheckmarkCircleOutline className="w-6 h-6 text-green-500" />
            <p className="flex-1 text-sm font-semibold text-gray-600">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessPopup; 