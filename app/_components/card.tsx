"use client";
import Image from "next/image";
import { EditEvidence } from "./buttons";
import { DeleteEvidence } from "./button";
import type { Evidences } from "@prisma/client";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useSession } from "next-auth/react";

const Card = ({
  data,
  itemId,
  identifikasiId,
}: {
  data: Evidences;
  itemId: string;
  identifikasiId: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      <div className="max-w-sm transition-shadow duration-300 bg-white border border-gray-200 rounded-md shadow hover:shadow-lg">
        <div className="relative aspect-video">
          <Image
            src={data.file}
            alt={`Evidence ${data.namaPemilik}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-in-out rounded-t-md hover:opacity-75"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
        <div className="p-5">
          <h1 className="text-lg font-bold text-gray-900 truncate">
            {data.namaPemilik}
          </h1>
        </div>
        {session?.user?.role === "admin" && (
          <div className="flex items-center justify-between">
            <EditEvidence
              id={data.id}
              itemId={itemId}
              identifikasiId={identifikasiId}
            />
            <DeleteEvidence id={data.id} />
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-75 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative flex items-center justify-center max-w-[95vw] max-h-[95vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-0 z-20 p-2 text-white bg-gray-500 rounded-full -top-2 hover:bg-gray-400 hover:shadow-custom"
            >
              <FaTimes size={24} />
            </button>
            <div className="relative flex items-center justify-center w-auto max-w-full max-h-full">
              <Image
                src={data.file}
                alt={`Evidence ${data.namaPemilik}`}
                width={750}
                height={600}
                className="object-contain max-w-full rounded-md max-h-[90vh]"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
