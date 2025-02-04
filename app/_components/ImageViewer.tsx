"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageViewerProps {
  src: string;
  alt: string;
}

export default function ImageViewer({ src, alt }: ImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => setIsOpen(true)}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder-image.jpg";
          target.alt = "Gagal memuat gambar";
        }}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                className="absolute top-4 right-4 text-white text-xl bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 