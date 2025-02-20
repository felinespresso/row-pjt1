"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";
import { MdOutlineEdit } from "react-icons/md";
import { FaFileImage, FaRegTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export const SubmitButton = ({ label }: { label: string }) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`transition ease-in-out duration-200 ${
        pending
          ? "bg-gray-400"
          : "bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3"
      }
        px-9 py-2 text-white rounded-lg font-semibold`}
    >
      {label === "save" ? (
        <span>{pending ? "MENYIMPAN..." : "SIMPAN"}</span>
      ) : (
        <span className="uppercase">
          {pending ? "MEMPERBARUI..." : "PERBARUI"}
        </span>
      )}
    </button>
  );
};

export const EditButton = ({ id }: { id: string }) => {
  const params = useParams(); 
  const projectId = params.id;
  return (
    <Link
      href={`/identifikasi-awal/${projectId}/edit/${id}`}
      title="Edit"
      className="flex px-[6px] py-1 transition duration-100 ease-in-out rounded-md bg-color5 hover:-translate-y-1 hover:shadow-lg"
    >
      <MdOutlineEdit className="text-xl text-white" />
    </Link>
  );
};

export const Delete = ({ id }: { id: string }) => {
  return (
    <Link
      href={`/delete/${id}`}
      title="Delete"
      className="flex px-2 py-[6px] transition duration-100 ease-in-out bg-red-500 rounded-md hover:-translate-y-1 hover:shadow-lg"
    >
      <FaRegTrashAlt className="text-lg text-white" />
    </Link>
  );
};

export const EvidenceButton = ({
  id,
  itemId,
}: {
  id: string;
  itemId: string;
}) => {
  return (
    <Link
      href={`/identifikasi-awal/${itemId}/evidence/${id}`}
      target="_self"
      rel="noopener noreferrer"
    >
      <button className="px-4 py-2 text-white transition duration-200 ease-in-out rounded-lg bg-color3 hover:bg-color8">
        <div className="flex items-center space-x-3 text-sm font-semibold uppercase">
          <FaFileImage className="text-xl" />
          <span className="text-sm">Lihat Evidence</span>
        </div>
      </button>
    </Link>
  );
};

export const EditEvidence = ({ id }: { id: string }) => {
  return (
    <Link
      href={`/identifikasi-awal/evidence/edit/${id}`}
      title="Edit"
      className="w-full py-3 text-sm text-center bg-gray-100 border-t border-r border-gray-200 cursor-pointer rounded-bl-md hover:bg-gray-200 focus:bg-gray-200"
    >
      Edit
    </Link>
  );
};
