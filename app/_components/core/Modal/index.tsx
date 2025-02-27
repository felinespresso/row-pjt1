"use client";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useRef, ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ children }: { children: ReactNode }) {
  const overlay = useRef(null);
  const router = useRouter();

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const close: MouseEventHandler = (e) => {
    if (e.target === overlay.current) {
      router.back();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      ref={overlay}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={close}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="p-6 bg-white rounded-md shadow-lg"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
