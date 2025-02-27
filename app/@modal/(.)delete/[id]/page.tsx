"use client";
import { MdErrorOutline } from "react-icons/md";
import Modal from "@/app/_components/core/Modal";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { DeleteButton } from "@/app/_components/button";
import { use } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IdentifikasiDel({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const pathname = usePathname();

  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    if (pathname !== `/delete/${id}`) {
      setIsModalOpen(false);
    }
  }, [pathname, id]);
  if (!isModalOpen) return null;

  return (
    <Modal>
          <h2 className="mb-4 text-lg font-semibold text-red-500">
            HAPUS DATA?
          </h2>
          <p>Apakah Anda yakin ingin menghapus data ini?</p>
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 mt-2 mr-4 font-semibold text-gray-500 transition duration-200 ease-in-out bg-white border-2 border-gray-500 hover:scale-110 hover:bg-gray-300 rounded-xl"
              onClick={() => router.back()}
            >
              Tidak
            </button>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl"
            >
              <DeleteButton id={id} />
            </motion.div>
          </div>
    </Modal>
  );
}
