import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!params.id || !type) {
      return NextResponse.json(
        { error: "ID atau tipe file tidak ditemukan" },
        { status: 400 }
      );
    }

    const musyawarah = await prisma.musyawarah.findUnique({
      where: { id: params.id },
      select: {
        beritaAcara: true,
        daftarHadir: true,
      },
    });

    if (!musyawarah) {
      return NextResponse.json(
        { error: "Data musyawarah tidak ditemukan" },
        { status: 404 }
      );
    }

    const fileUrl =
      type === "beritaAcara"
        ? musyawarah.beritaAcara
        : musyawarah.daftarHadir;

    if (!fileUrl) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 404 }
      );
    }

    // Kembalikan URL file sebagai JSON response
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Error mengambil file:", error);
    return NextResponse.json(
      { error: "Gagal mengambil file" },
      { status: 500 }
    );
  }
}
