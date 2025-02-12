"use client";
import Link from "next/link";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";

const Pagination = ({ totalPages }: { totalPages: number }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const visiblePages = 3;
    const startPage = Math.max(1, Math.min(currentPage - Math.floor(visiblePages / 2), totalPages - visiblePages + 1));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    return (
        <div className="flex items-center justify-between mt-4">
            <p className="text-sm font-bold text-color3">
                Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center space-x-2">
                {/* Tombol First */}
                {/* {currentPage > 3 && (
                    <>
                        <Link href={createPageURL(1)}
                            className="text-white transition duration-200 ease-in-out scale-110 shadow-lg bg-color8">
                            1
                        </Link>
                        <span className="text-gray-500">...</span>
                    </>
                )} */}
                
                {/* Tombol Previous */}
                <Link href={createPageURL(currentPage - 1)}
                    className={clsx("px-2 py-[5px] rounded bg-color3 text-white hover:bg-color8", {
                        "pointer-events-none opacity-70": currentPage <= 1
                    })}>
                    <div className="text-center border-2 border-white rounded-full">
                        <MdChevronLeft className="text-lg text-white" />
                    </div>
                </Link>

                {/* Navigasi Angka Halaman */}
                {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                    <Link key={page} href={createPageURL(page)}
                        className={clsx("px-3 py-1 rounded-md", {
                            "bg-color8 text-white scale-110 transition duration-200 ease-in-out shadow-lg": currentPage === page,
                            "bg-color3 hover:bg-color8 text-white hover:scale-110 transition duration-300 ease-in-out": currentPage !== page,
                        })}>
                        {page}
                    </Link>
                ))}

                {/* Tombol Next */}
                <Link href={createPageURL(currentPage + 1)}
                    className={clsx("px-2 py-[5px] rounded bg-color3 text-white hover:bg-color8", {
                        "pointer-events-none opacity-70": currentPage >= totalPages
                    })}>
                    <div className="text-center border-2 border-white rounded-full">
                        <MdChevronRight className="text-lg text-white" />
                    </div>
                </Link>

                {/* Tombol Last */}
                {/* {currentPage < totalPages - 2 && (
                    <>
                        <span className="text-gray-500">...</span>
                        <Link href={createPageURL(totalPages)}
                            className="px-3 py-1 text-white rounded-md bg-color3 hover:bg-color8">
                            {totalPages}
                        </Link>
                    </>
                )} */}
            </div>
        </div>
    );
};

export default Pagination;