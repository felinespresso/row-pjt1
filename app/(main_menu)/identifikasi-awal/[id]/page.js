import { auth } from "@/auth";
import Image from "next/image";
import { MdAddCircleOutline } from "react-icons/md";
import { getDataPages, getDataExcel } from "@/lib/identifikasi/data";
import Link from "next/link";
import Pagination from "@/app/_components/pagination";
import { Suspense } from "react";
import { TableSkeleton } from "@/app/_components/skeleton";
import IdentifikasiAwal from "@/app/_components/identifikasi-table";
import ExportToExcel from "@/app/_components/export/ExportToExcel";
import { motion, AnimatePresence } from "framer-motion";

export default async function page({ params, searchParams }) {
  const session = await auth();
  const { id } = params; // Pastikan mengambil ID dari URL
  const page = Number(searchParams.page) || 1;
  const query = searchParams.query || "";
  const totalPages = await getDataPages(query, id);
  const dataIdentifikasi = await getDataExcel();
  const fileName = "Tabel Data Identifikasi";

  console.log(params, searchParams);

  return (
    <div className="px-6 pt-32 pb-20">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet"
      />
      <div className="p-6 bg-white rounded-lg shadow-lg">
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-white rounded-lg shadow-lg"
        > */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Tabel Identifikasi Awal
          </h1>
          {session.user.role === "admin" ? (
            <div className="flex space-x-4">
              <ExportToExcel apiData={dataIdentifikasi} fileName={fileName} />
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
          <IdentifikasiAwal searchParams={searchParams} itemId={parseInt(id)} />
        </Suspense>
        <div className="mx-8 mt-8">
          <Pagination totalPages={totalPages} />
        </div>
        {/* </motion.div> */}
      </div>
    </div>
  );
}
