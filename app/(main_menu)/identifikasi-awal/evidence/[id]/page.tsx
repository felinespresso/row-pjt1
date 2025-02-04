import { getDesaById, getEvidence } from "@/lib/identifikasi/data";
import Link from "next/link";
import { MdAddCircleOutline } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import Card from "@/app/_components/card";

export default async function EvidencePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
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
    <div className="pt-6">
      <Link href="/identifikasi-awal">
        <button
          title="Back"
          className="relative flex items-center justify-center p-2 mr-2 rounded-full hover:bg-gray-300 focus:bg-gray-300 focus:bg-opacity-85 focus:outline-none"
        >
          <FaArrowLeft className="text-3xl text-gray-500" />
        </button>
      </Link>
      <div className="max-w-screen-xl px-10 pt-3 mx-auto">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-base font-bold">
              Evidence <span>{data?.namadesa}</span>
            </h1>
            <h2 className="text-sm font-semibold text-color3">
              {data?.spantower}
            </h2>
          </div>
          <Link href="#">
            <div className="px-4 py-2 text-white transition duration-200 ease-in-out rounded-xl bg-color3 hover:-translate-x-1 hover:-translate-y-1 hover:scale-110 hover:bg-color8">
              <div className="flex items-center ml-auto space-x-3 text-sm font-semibold uppercase">
                <MdAddCircleOutline className="text-[22px]" />
                <span>Add Evidence</span>
              </div>
            </div>
          </Link>
        </div>
        <div className="grid gap-5 mt-10 md:grid-cols-3">
          {images.length > 0 ? (
            images.map((item) => <Card key={item.id} data={item} />)
          ) : (
            <p className="text-center text-gray-500">
              Tidak ada evidence untuk desa ini.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
