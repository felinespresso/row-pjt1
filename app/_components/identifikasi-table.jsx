// "use client";
// import { useRouter } from "next/navigation";
import { auth } from "@/auth";
import { Delete, EditButton, EvidenceButton } from "./buttons";
import { getData } from "@/lib/identifikasi/data";
import { FaFileAlt } from "react-icons/fa";
import { getDataByProjectId } from "@/lib/identifikasi/data";

const IdentifikasiAwal = async ({ searchParams, itemId }) => {
    const session = await auth();
    const page = Number(searchParams.page) || 1;
    const query = searchParams.query || "";
    const data = await getData(page, query, itemId);

    console.log(data);
    // const totalPages = await getDataPages(query);

    return (
        <div className="bg-transparent border-2 border-gray-400 rounded-md mx-7">
            <div className="overflow-x-auto rounded [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <table className="min-w-full divide-y-2 divide-gray-400">
                    <thead className="bg-gray-50">
                        <tr className="text-xs divide-x-2 divide-gray-400">
                            <th className="px-1 py-2 font-semibold tracking-wider text-center text-gray-700 uppercase">
                                No.
                            </th>
                            <th className="px-10 py-2 font-semibold tracking-wider text-center text-gray-700 uppercase">
                                Nama Desa
                            </th>
                            <th className="px-3 py-2 font-semibold tracking-wider text-center text-gray-700 uppercase">
                                Nomor Span Tower
                            </th>
                            <th className="px-3 py-2 font-semibold tracking-wider text-center text-gray-700 uppercase">
                                Tanggal Pelaksanaan
                            </th>
                            <th className="px-8 py-2 font-semibold tracking-wider text-center text-gray-700 uppercase">
                                Evidence
                            </th>
                            <th className="px-2 py-2 font-semibold tracking-wider text-center text-gray-700 uppercase">
                                Hasil Foto Udara
                            </th>
                            {session.user.role === "admin" ? (
                                <th className="px-6 py-2 font-semibold tracking-wider text-center text-gray-700 uppercase">
                                    Action
                                </th>
                            ) : null}
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-400">
                        {data.map((identifikasi, index) => (
                            <tr
                                key={identifikasi.id}
                                className={` text-sm divide-x-2 divide-gray-400 ${
                                    index % 2 === 0 ? "bg-gray-200" : "bg-white"
                                } h-4`}
                            >
                                <td className="px-6 py-3 text-center align-middle whitespace-nowrap">
                                    {(page - 1) * 10 + (index + 1)}
                                </td>
                                <td className="px-6 py-3 text-center whitespace-normal">
                                    {identifikasi.namadesa}
                                </td>
                                <td className="px-6 py-3 text-center whitespace-nowrap">
                                    {identifikasi.spantower}
                                </td>
                                <td className="px-6 py-3 text-center whitespace-nowrap">
                                    {identifikasi.tanggal}
                                </td>
                                <td className="px-6 py-3 text-center whitespace-nowrap">
                                    <EvidenceButton id={identifikasi.id} />
                                </td>
                                <td className="px-6 py-3 text-center whitespace-nowrap">
                                    <a
                                        href={identifikasi.fotoudara}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <button className="px-4 py-2 text-white transition duration-200 ease-in-out rounded-lg bg-color3 hover:bg-color8">
                                            <div className="flex items-center space-x-3 text-sm font-semibold uppercase">
                                                <FaFileAlt className="text-xl" />
                                                <span className="text-sm">
                                                    Lihat File
                                                </span>
                                            </div>
                                        </button>
                                    </a>
                                </td>
                                {session.user.role === "admin" ? (
                                    <td className="px-2 py-3 text-center whitespace-nowrap">
                                        <div className="flex justify-center gap-x-7">
                                            <EditButton id={identifikasi.id} />
                                            <Delete id={identifikasi.id} />
                                        </div>
                                    </td>
                                ) : null}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IdentifikasiAwal;
