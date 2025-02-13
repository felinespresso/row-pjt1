import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 📌 GET: Mengembalikan URL formulir agar bisa dibuka di tab baru
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Cari data inventarisasi berdasarkan ID
    const inventarisasi = await prisma.inventarisasi.findUnique({
      where: { id },
      select: { formulir: true },
    });

    if (!inventarisasi || !inventarisasi.formulir) {
      return NextResponse.json(
        { error: "Formulir tidak ditemukan" },
        { status: 404 }
      );
    }

    // Redirect ke URL formulir agar bisa dibuka di tab baru
    return NextResponse.redirect(inventarisasi.formulir);
  } catch (error) {
    console.error("❌ Error membuka formulir:", error);
    return NextResponse.json(
      { error: "Gagal membuka formulir" },
      { status: 500 }
    );
  }
}
