import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 });
  }

  try {
    const id = parseInt(params.id);

    const inventarisasi = await prisma.inventarisasi.findUnique({
      where: { id },
      select: {
        formulir: true,
      },
    });

    if (!inventarisasi) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    // Jika tidak ada formulir, kirim response khusus
    if (!inventarisasi.formulir) {
      return NextResponse.json(
        { message: "Tidak ada formulir yang diupload" },
        { status: 200 }
      );
    }

    // Kirim file PDF jika ada
    return new NextResponse(inventarisasi.formulir, {
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  } catch (error) {
    console.error("Error mengambil formulir:", error);
    return NextResponse.json(
      { error: "Gagal mengambil formulir" },
      { status: 500 }
    );
  }
}
