import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const identifikasi = await prisma.identifikasi.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        namadesa: true,
        spantower: true,
      },
    });

    if (!identifikasi) {
      return NextResponse.json(
        { error: "Data identifikasi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(identifikasi);
  } catch (error) {
    console.error("Error fetching identifikasi:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data identifikasi" },
      { status: 500 }
    );
  }
} 