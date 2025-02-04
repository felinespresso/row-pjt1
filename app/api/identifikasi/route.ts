import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const identifikasi = await prisma.identifikasi.findMany({
      select: {
        id: true,
        namadesa: true,
        spantower: true,
      },
      orderBy: {
        namadesa: 'asc',
      },
    });

    return NextResponse.json(identifikasi);
  } catch (error) {
    console.error("Error fetching identifikasi:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data identifikasi" },
      { status: 500 }
    );
  }
} 