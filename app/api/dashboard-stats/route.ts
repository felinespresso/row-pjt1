import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Definisikan tipe parameter untuk request
export async function GET(request: Request) {
  try {
    // Ambil query parameter 'id'
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "", 10);

    // Validasi apakah id valid
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid or missing ID parameter" },
        { status: 400 }
      );
    }

    // Query ke database dengan filter 'itemId'
    const [
      identifikasiCount,
      sosialisasiCount,
      inventarisasiCount,
      pengumumanCount,
      musyawarahCount,
      pemberkasanCount,
      pembayaranCount,
      penebanganCount,
    ] = await Promise.all([
      prisma.identifikasi.count({ where: { itemId: id } }),
      prisma.sosialisasi.count({ where: { itemId: id } }),
      prisma.inventarisasi.count({ where: { itemId: id } }),
      prisma.pengumuman.count({ where: { itemId: id } }),
      prisma.musyawarah.count({ where: { itemId: id } }),
      prisma.pemberkasan.count({ where: { itemId: id } }),
      prisma.pembayaran.count({ where: { itemId: id } }),
      prisma.penebangan.count({ where: { itemId: id } }),
    ]);

    // Mengembalikan response JSON
    return NextResponse.json({
      identifikasi: identifikasiCount,
      sosialisasi: sosialisasiCount,
      inventarisasi: inventarisasiCount,
      pengumuman: pengumumanCount,
      musyawarah: musyawarahCount,
      pemberkasan: pemberkasanCount,
      pembayaran: pembayaranCount,
      penebangan: penebanganCount,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
