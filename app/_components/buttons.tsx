"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";
import { MdOutlineEdit } from "react-icons/md";
import { FaFileImage, FaRegTrashAlt } from "react-icons/fa";
import { deleteIdentifikasi } from "@/lib/identifikasi/action";
import { useRouter } from "next/navigation";

export const SubmitButton = ({ label }: { label: string }) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`transition ease-in-out duration-200 ${
        pending
          ? "bg-gray-400"
          : "transition ease-in-out duration-200 bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3 px-4 py-2 text-white rounded-lg font-semibold w-32"
      } 
        px-9 py-2 text-white rounded-lg font-semibold`}
    >
      {label === "save" ? (
        <span>{pending ? "SAVING..." : "SAVE"}</span>
      ) : (
        <span className="uppercase">{pending ? "Updating..." : "Update"}</span>
      )}
    </button>
  );
};

export const EditButton = ({ id }: { id: string }) => {
  return (
    <Link
      href={`/identifikasi-awal/edit/${id}`}
      title="Edit"
      className="flex px-[6px] py-1 transition duration-100 ease-in-out rounded-md bg-color5 hover:-translate-1 hover:scale-110 hover:shadow-lg"
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
      className="flex px-2 py-[6px] transition duration-100 ease-in-out bg-red-500 rounded-md hover:-translate-1 hover:scale-110 hover:shadow-lg"
    >
      <FaRegTrashAlt className="text-lg text-white" />
    </Link>
  );
};

// export const DeleteButton = ({id}:{id:string}) => { 
//   const router = useRouter(); 
//   const DeleteDataWithId = deleteIdentifikasi.bind(null, id); 
//   return ( 
//       <form action={DeleteDataWithId}> 
//           <button onClick={() => router.push("/identifikasi-awal")} className="px-8 py-2 text-white transition-transform duration-300 rounded-lg bg-color3 hover:bg-blue-800 hover:scale-105">Yes</button> 
//       </form> 
//   ) 
// }

export const EvidenceButton = ({ id }: { id: string }) => {
  return (
    <Link
      href={`/identifikasi-awal/evidence/${id}`}
      target="_self"
      rel="noopener noreferrer"
    >
      <button className="px-4 py-2 text-white transition duration-200 ease-in-out rounded-lg bg-color3 hover:bg-color8">
        <div className="flex items-center space-x-3 text-sm font-semibold uppercase">
          <FaFileImage className="text-xl" />
          <span className="text-sm">Lihat File</span>
        </div>
      </button>
    </Link>
  );
};

export const EditEvidence = ({ id }: { id: string }) => {
  return (
    <Link
      href=""
      className="w-full py-3 text-sm text-center bg-gray-100 border-t border-r border-gray-200 rounded-bl-md hover:bg-gray-200"
    >
      Edit
    </Link>
  );
};

export const DeleteEvidence = ({ id }: { id: string }) => {
  return (
    <form className="w-full py-3 text-sm text-center bg-gray-100 border-t border-l border-gray-200 rounded-br-md hover:bg-gray-200">
      <button type="submit">Delete</button>
    </form>
  );
};
