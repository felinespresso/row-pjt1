import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Handler untuk POST
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Set nilai default jika kosong
    const namatanaman = data.namatanaman || "-";
    const produktif = data.produktif || "-";
    const besar = data.besar || "-";
    const kecil = data.kecil || "-";

    // Validasi input
    if (!namatanaman || typeof namatanaman !== "string") {
      return NextResponse.json(
        { error: "Field 'namatanaman' wajib diisi dan harus berupa string" },
        { status: 400 }
      );
    }
    if (!produktif || typeof produktif !== "string") {
      return NextResponse.json(
        { error: "Field 'produktif' wajib diisi dan harus berupa string" },
        { status: 400 }
      );
    }
    if (!besar || typeof besar !== "string") {
      return NextResponse.json(
        { error: "Field 'besar' wajib diisi dan harus berupa string" },
        { status: 400 }
      );
    }
    if (!kecil || typeof kecil !== "string") {
      return NextResponse.json(
        { error: "Field 'kecil' wajib diisi dan harus berupa string" },
        { status: 400 }
      );
    }

    // Simpan jenis tanaman ke database
    const tanaman = await prisma.jenistanaman.create({
      data: {
        namatanaman,
        produktif,
        besar,
        kecil,
      },
    });

    return NextResponse.json(tanaman, { status: 201 });
  } catch (error: any) {
    console.error("Error saving jenis tanaman:", error.message);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan jenis tanaman" },
      { status: 500 }
    );
  }
}

// Handler untuk GET
export async function GET() {
  try {
    const tanaman = await prisma.jenistanaman.findMany();
    return NextResponse.json(tanaman);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data tanaman" },
      { status: 500 }
    );
  }
}
