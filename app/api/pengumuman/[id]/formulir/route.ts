import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");

    if (!type || !["beritaAcara", "daftarHadir"].includes(type)) {
      return NextResponse.json(
        { error: "Tipe file tidak valid" },
        { status: 400 }
      );
    }

    const pengumuman = await prisma.pengumuman.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        [type]: true, // Mengambil kolom beritaAcara atau daftarHadir sesuai parameter
      },
    });

    if (!pengumuman || !pengumuman[type]) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ url: pengumuman[type] }); // Mengembalikan URL file langsung
  } catch (error) {
    console.error("Error mengambil file:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil file" },
      { status: 500 }
    );
  }
}
