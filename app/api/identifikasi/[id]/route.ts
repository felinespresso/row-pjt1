import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Fetching identifikasi with ID:", params.id); // ✅ Debugging

    const identifikasi = await prisma.identifikasi.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        namadesa: true,
        spantower: true,
        itemId: true,
        item: {
          select: {
            id: true,
            namaproyek: true,
          },
        },
      },
    });

    if (!identifikasi) {
      console.log("Identifikasi tidak ditemukan untuk ID:", params.id); // ✅ Debugging
      return NextResponse.json(
        { error: "Data identifikasi tidak ditemukan" },
        { status: 404 }
      );
    }

    console.log("Identifikasi ditemukan:", identifikasi); // ✅ Debugging
    return NextResponse.json(identifikasi);
  } catch (error) {
    console.error("Error fetching identifikasi:", error); // ✅ Log lengkap
    return NextResponse.json(
      { error: "Gagal mengambil data identifikasi"},
      { status: 500 }
    );
  }
}

