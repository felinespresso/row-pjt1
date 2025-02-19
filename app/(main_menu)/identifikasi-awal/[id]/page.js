import { auth } from "@/auth";
import Image from "next/image";
import { MdAddCircleOutline } from "react-icons/md";
import { getDataPages } from "@/lib/identifikasi/data";
import Link from "next/link";
import Pagination from "@/app/_components/pagination";
import { Suspense } from "react";
import { TableSkeleton } from "@/app/_components/skeleton";
import IdentifikasiAwal from "@/app/_components/identifikasi-table";
import ExportButtonIdentifikasi from "@/app/_components/export/ExportButtonIdentifikasi";

export default async function page({ params, searchParams }) {
    const session = await auth();
    const { id } = params; // Pastikan mengambil ID dari URL
    const page = Number(searchParams.page) || 1;
    const query = searchParams.query || "";
    const totalPages = await getDataPages(query, id);

    return (
        <div>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link
                href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
                rel="stylesheet"
            />
            <main className="px-6 pt-32 pb-20 font-montserrat">
                <div className="h-full bg-white rounded-lg shadow-lg py-7">
                    <div className="flex items-center justify-between w-full pb-6 px-11">
                        <h1 className="flex items-center text-xl font-semibold text-gray-800">
                            Tabel Identifikasi Awal
                        </h1>
                        {session.user.role === "admin" ? (
                            <div className="flex items-center space-x-6">
                                {/* <ExportButtonIdentifikasi getDataPages={getDataPages}/> */}
                                <Link href={`/identifikasi-awal/${id}/form`}>
                                    <div className="px-4 py-2 text-white transition duration-200 ease-in-out bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3 rounded-xl">
                                        <div className="flex items-center ml-auto space-x-3 text-sm font-semibold uppercase">
                                            <MdAddCircleOutline className="text-[22px]" />
                                            <span>TAMBAH DATA</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ) : null}
                    </div>
                    <Suspense key={query + page} fallback={<TableSkeleton />}>
                        <IdentifikasiAwal
                            searchParams={searchParams}
                            itemId={parseInt(id)}
                        />
                    </Suspense>
                    <div className="mx-8 mt-8">
                        <Pagination totalPages={totalPages} />
                    </div>
                </div>
            </main>
        </div>
    );
}
