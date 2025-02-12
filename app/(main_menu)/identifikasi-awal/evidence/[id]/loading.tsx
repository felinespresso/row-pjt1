import Link from "next/link";
import { MdAddCircleOutline } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";

const LoadingEvidence = () => {
    return(
        <div className="pt-4">
        <Link href="/identifikasi-awal">
        <button title="Back" className="relative flex items-center justify-center p-2 mr-2 rounded-full hover:bg-gray-300 focus:bg-gray-300 focus:bg-opacity-85 focus:outline-none">
                <FaArrowLeft className="text-3xl text-gray-500"/>
        </button>
        </Link>
        <div className="max-w-screen-xl px-10 pt-3 mx-auto">
            <div className="flex items-end justify-between">
                <div className="space-y-2">
                <div className="w-40 h-5 rounded bg-color9"></div>
                <div className="w-32 h-5 rounded bg-color9"></div>
                </div>
                <Link href="#">
                    <div className="px-4 py-2 text-white transition duration-200 ease-in-out rounded-xl bg-color3 hover:-translate-x-1 hover:-translate-y-1 hover:scale-110 hover:bg-color8">
                        <div className="flex items-center ml-auto space-x-3 text-sm font-semibold uppercase">
                            <MdAddCircleOutline className="text-[22px]"/>
                            <span>Add Evidence</span>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="grid gap-5 mt-12 md:grid-cols-3">
                <div className="max-w-sm transition-shadow duration-300 bg-white rounded-md shadow hover:shadow-lg">
                    <div className="rounded w-96 h-52 bg-color9"></div>
                    <div className="p-5">
                        <div className="w-32 rounded h-7 bg-color9"></div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                        <button title="Edit" className="w-full py-3 text-sm text-center bg-gray-100 border-t border-r border-gray-200 pointer-events-none rounded-bl-md">
                            Edit
                        </button>
                        <button type="submit" title="Delete" className="w-full px-10 py-3 text-sm text-center bg-gray-100 border-t border-l border-gray-200 pointer-events-none rounded-br-md">
                            Delete
                        </button>
                    </div>
                </div>
                <div className="max-w-sm transition-shadow duration-300 bg-white rounded-md shadow hover:shadow-lg">
                    <div className="rounded w-96 h-52 bg-color9"></div>
                    <div className="p-5">
                        <div className="w-32 rounded h-7 bg-color9"></div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                        <button title="Edit" className="w-full py-3 text-sm text-center bg-gray-100 border-t border-r border-gray-200 pointer-events-none rounded-bl-md">
                            Edit
                        </button>
                        <button type="submit" title="Delete" className="w-full px-10 py-3 text-sm text-center bg-gray-100 border-t border-l border-gray-200 pointer-events-none rounded-br-md">
                            Delete
                        </button>
                    </div>
                </div>
                <div className="max-w-sm transition-shadow duration-300 bg-white rounded-md shadow hover:shadow-lg">
                    <div className="rounded w-96 h-52 bg-color9"></div>
                    <div className="p-5">
                        <div className="w-32 rounded h-7 bg-color9"></div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                        <button title="Edit" className="w-full py-3 text-sm text-center bg-gray-100 border-t border-r border-gray-200 pointer-events-none rounded-bl-md">
                            Edit
                        </button>
                        <button type="submit" title="Delete" className="w-full px-10 py-3 text-sm text-center bg-gray-100 border-t border-l border-gray-200 pointer-events-none rounded-br-md">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default LoadingEvidence;