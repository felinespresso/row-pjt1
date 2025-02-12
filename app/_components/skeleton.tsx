import { auth } from "@/auth";

export const TableSkeleton = async() => {
    const session = await auth();
    
    return (
      <div className="bg-transparent border-2 border-gray-400 rounded-md mx-7">
        <div className="overflow-x-auto rounded [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <table className="min-w-full divide-y-2 divide-gray-400">
            <thead className="bg-gray-50">
              <tr className="text-xs divide-x-2 divide-gray-400">
                <th className="px-1 py-2 font-semibold tracking-wider text-center text-gray-700 uppercase">No.</th>
                <th className="px-10 py-2 font-semibold tracking-wider text-center text-gray-700 uppercase">Nama Desa</th>
                <th className="px-3 py-2 font-semibold tracking-wider text-center text-gray-700 uppercase">Nomor Span Tower</th>
                <th className="px-3 py-2 font-semibold tracking-wider text-center text-gray-700 uppercase">Tanggal Pelaksanaan</th>
                <th className="px-8 py-2 font-semibold tracking-wider text-center text-gray-700 uppercase">Evidence</th>
                <th className="px-2 py-2 font-semibold tracking-wider text-center text-gray-700 uppercase">Hasil Foto Udara</th>
                {session?.user.role === "admin" ? (<th className="px-6 py-2 font-semibold tracking-wider text-center text-gray-700 uppercase">Action</th>): null}
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-400 animate-pulse">
              <tr className="text-sm bg-white divide-x-2 divide-gray-400">
                <td className="px-6 py-3 text-center align-middle whitespace-nowrap">
                  <div className="h-5 rounded w-7 bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-normal">
                  <div className="w-32 h-5 rounded bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <div className="w-32 h-5 rounded bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <div className="w-32 h-5 rounded bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <div className="w-32 rounded h-7 bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <div className="w-32 rounded h-7 bg-color9"></div>
                </td>
                {session?.user.role === "admin" ? (
                <td className="px-2 py-3 text-center whitespace-nowrap">
                  <div className="flex justify-center gap-x-7">
                    <div className="w-8 rounded-sm bg-color9 h-7"></div>
                    <div className="w-8 rounded-sm bg-color9 h-7"></div>
                  </div>
                </td>
                ): null}
              </tr>
            </tbody>
            <tbody className="divide-y-2 divide-gray-400 animate-pulse">
              <tr className="text-sm bg-white divide-x-2 divide-gray-400">
                <td className="px-6 py-3 text-center align-middle whitespace-nowrap">
                  <div className="h-5 rounded w-7 bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-normal">
                  <div className="w-32 h-5 rounded bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <div className="w-32 h-5 rounded bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <div className="w-32 h-5 rounded bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <div className="w-32 rounded h-7 bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <div className="w-32 rounded h-7 bg-color9"></div>
                </td>
                {session?.user.role === "admin" ? (
                <td className="px-2 py-3 text-center whitespace-nowrap">
                  <div className="flex justify-center gap-x-7">
                    <div className="w-8 rounded-sm bg-color9 h-7"></div>
                    <div className="w-8 rounded-sm bg-color9 h-7"></div>
                  </div>
                </td>
                ): null}
              </tr>
            </tbody>
            <tbody className="divide-y-2 divide-gray-400 animate-pulse">
              <tr className="text-sm bg-white divide-x-2 divide-gray-400">
                <td className="px-6 py-3 text-center align-middle whitespace-nowrap">
                  <div className="h-5 rounded w-7 bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-normal">
                  <div className="w-32 h-5 rounded bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <div className="w-32 h-5 rounded bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <div className="w-32 h-5 rounded bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <div className="w-32 rounded h-7 bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <div className="w-32 rounded h-7 bg-color9"></div>
                </td>
                {session?.user.role === "admin" ? (
                <td className="px-2 py-3 text-center whitespace-nowrap">
                  <div className="flex justify-center gap-x-7">
                    <div className="w-8 rounded-sm bg-color9 h-7"></div>
                    <div className="w-8 rounded-sm bg-color9 h-7"></div>
                  </div>
                </td>
                ): null}
              </tr>
            </tbody>
            <tbody className="divide-y-2 divide-gray-400 animate-pulse">
              <tr className="text-sm bg-white divide-x-2 divide-gray-400">
                <td className="px-6 py-3 text-center align-middle whitespace-nowrap">
                  <div className="h-5 rounded w-7 bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-normal">
                  <div className="w-32 h-5 rounded bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <div className="w-32 h-5 rounded bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <div className="w-32 h-5 rounded bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <div className="w-32 rounded h-7 bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <div className="w-32 rounded h-7 bg-color9"></div>
                </td>
                {session?.user.role === "admin" ? (
                <td className="px-2 py-3 text-center whitespace-nowrap">
                  <div className="flex justify-center gap-x-7">
                    <div className="w-8 rounded-sm bg-color9 h-7"></div>
                    <div className="w-8 rounded-sm bg-color9 h-7"></div>
                  </div>
                </td>
                ): null}
              </tr>
            </tbody>
            <tbody className="divide-y-2 divide-gray-400 animate-pulse">
              <tr className="text-sm bg-white divide-x-2 divide-gray-400">
                <td className="px-6 py-3 text-center align-middle whitespace-nowrap">
                  <div className="h-5 rounded w-7 bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-normal">
                  <div className="w-32 h-5 rounded bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <div className="w-32 h-5 rounded bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <div className="w-32 h-5 rounded bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <div className="w-32 rounded h-7 bg-color9"></div>
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  <div className="w-32 rounded h-7 bg-color9"></div>
                </td>
                {session?.user.role === "admin" ? (
                <td className="px-2 py-3 text-center whitespace-nowrap">
                  <div className="flex justify-center gap-x-7">
                    <div className="w-8 rounded-sm bg-color9 h-7"></div>
                    <div className="w-8 rounded-sm bg-color9 h-7"></div>
                  </div>
                </td>
                ): null}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
};