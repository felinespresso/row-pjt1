import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [
      identifikasiCount,
      sosialisasiCount,
      inventarisasiCount,
      pengumumanCount,
      musyawarahCount,
    //   pemberkasanCount,
    //   pembayaranCount,
    //   penebanganCount
    ] = await Promise.all([
      prisma.identifikasi.count(),
      prisma.sosialisasi.count(),
      prisma.inventarisasi.count(),
      prisma.pengumuman.count(), // Sesuaikan dengan model musyawarah Anda
      prisma.musyawarah.count(), // Sesuaikan dengan model musyawarah Anda
    //   prisma.pemberkasan.count(), // Sesuaikan dengan model pemberkasan Anda
    //   prisma.pembayaran.count(), // Sesuaikan dengan model pembayaran Anda
    //   prisma.penebangan.count() // Sesuaikan dengan model penebangan Anda
    ]);

    return NextResponse.json({
      identifikasi: identifikasiCount,
      sosialisasi: sosialisasiCount,
      inventarisasi: inventarisasiCount,
      pengumuman: pengumumanCount,
      musyawarah: musyawarahCount,
    //   pemberkasan: pemberkasanCount,
    //   pembayaran: pembayaranCount,
    //   penebangan: penebanganCount
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
} 