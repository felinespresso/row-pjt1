'use client';
import { FaExclamationCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { DeleteButton } from "@/app/_components/button";
import { use } from "react";

export default function IdentifikasiDel({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const { id } = resolvedParams;
    const router = useRouter();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-300 font-montserrat">
            <div className="p-6 bg-white rounded-lg w-96 ring-2 ring-gray-700 ring-opacity-5">
                <div className="flex items-center justify-center gap-1">
                    <FaExclamationCircle className="text-red-500 text-8xl"/>
                </div>
                <p className="mt-4 text-lg font-bold text-center text-black">Are you sure you want to delete this data?</p>
                <div className="flex justify-center gap-4 mt-6 mb-3">
                    <DeleteButton id={id}/>
                    <button className="px-5 py-1 text-red-500 border-red-500 rounded-lg border-[3px] hover:bg-red-500 hover:text-white hover:scale-105 transition-transform duration-300"
                    onClick={() => router.back()}>Cancel</button>
                </div>
            </div>
        </div>
    );
}