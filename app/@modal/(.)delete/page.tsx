'use client';
import { MdErrorOutline } from "react-icons/md";
import Modal from "@/app/_components/core/Modal";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { useRouter } from "next/navigation";
import { DeleteButton } from "@/app/_components/button";
import { use } from "react";

export default function IdentifikasiDel({ params }: { params: Promise<{ id: string }> }) {
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
    
    return(
        <Modal>
            <div className="flex items-center justify-center">
                <MdErrorOutline className="text-red-500 text-8xl"/>
            </div>
            <p className="mt-4 text-lg font-bold text-center text-black">Are you sure you want <br/>to delete this data?</p>
            <div className="flex justify-center gap-4 mt-6 mb-3">
                <DeleteButton id={id}/>
                <button className="px-5 py-1 text-red-500 border-red-500 rounded-lg border-[3px] hover:bg-red-500 hover:text-white hover:scale-105 transition-transform duration-300"
                onClick={() => router.back()}>Cancel</button>
            </div>
        </Modal>
    );
}