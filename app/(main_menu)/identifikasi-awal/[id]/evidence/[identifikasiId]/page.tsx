import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getDesaById, getEvidence } from "@/lib/identifikasi/data";
import Link from "next/link";
import { MdAddCircleOutline } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import Card from "@/app/_components/card";
import MotionDiv from "@/app/_components/motion-div";
import { Suspense } from "react";
import LoadingIndicator from "@/app/_components/LoadingIndicator";

export default async function EvidencePage({
  params,
}: {
  params: { id: string; identifikasiId: string };
}) {
  const session = await auth();
  const { id: itemId, identifikasiId: id } = params;

  if (!session) {
    redirect("/");
  }

  const data = await getDesaById(id);
  const images = await getEvidence(id);
  // if (!data) {
  //     return (
  //         <div className="max-w-screen-lg mx-auto py-14">
  //             <h1 className="text-2xl font-bold">Data Tidak Ditemukan</h1>
  //         </div>
  //     );
  // }

  return (
    <div className="px-6 pt-32 pb-19">
      <div className="flex items-center justify-between mb-6">
        <Link href={`/identifikasi-awal/${itemId}`}>
          <button className="flex items-center gap-2 text-blue-3 hover:text-blue-4">
            <FaArrowLeft /> Kembali
          </button>
        </Link>
        {session?.user?.role === "admin" ? (
          <Link href={`/identifikasi-awal/${itemId}/evidence/form/${id}`}>
            <div className="px-4 py-2 text-white transition duration-200 ease-in-out bg-blue-2 hover:-translate-1 hover:scale-110 hover:bg-blue-3 rounded-xl">
              <div className="flex items-center ml-auto space-x-3 text-sm font-semibold uppercase">
                <MdAddCircleOutline className="text-[22px]" />
                <span>Tambah Evidence</span>
              </div>
            </div>
          </Link>
        ) : null}
      </div>
      <Suspense fallback={<LoadingIndicator />}>
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-white rounded-lg shadow-lg"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              Evidence <span>{data?.namadesa}</span>
            </h1>
            <h2 className="text-sm font-semibold text-color3">
              {data!.spantower}
            </h2>
          </div>
          <div className="grid gap-5 mt-12 md:grid-cols-3">
            {images.length > 0 ? (
              images.map((item: any) => (
                <Card
                  key={item.id}
                  data={item}
                  itemId={itemId}
                  identifikasiId={id}
                />
              ))
            ) : (
              <p className="flex items-center justify-center w-full col-span-3 text-xl text-center text-gray-500 py-9">
                Tidak ada evidence
              </p>
            )}
          </div>
        </MotionDiv>
      </Suspense>
    </div>
  );
}
