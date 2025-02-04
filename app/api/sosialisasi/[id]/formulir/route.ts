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
        { error: "ID atau tipe tidak ditemukan" },
        { status: 400 }
      );
    }

    const sosialisasi = await prisma.sosialisasi.findUnique({
      where: { id: params.id },
      select: {
        beritaAcara: type === "beritaAcara",
        daftarHadir: type === "daftarHadir",
      },
    });

    if (!sosialisasi) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    const file = type === "beritaAcara" ? sosialisasi.beritaAcara : sosialisasi.daftarHadir;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 404 }
      );
    }

    // Menggunakan Buffer.from dengan encoding yang tepat
    let buffer;
    if (typeof file === 'string') {
      // Jika file adalah string base64
      buffer = Buffer.from(file, 'base64');
    } else {
      // Jika file adalah Uint8Array atau Buffer
      buffer = Buffer.from(file);
    }

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${type}.pdf"`,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Error mengambil file:", error);
    return NextResponse.json(
      { error: "Gagal mengambil file" },
      { status: 500 }
    );
  }
}
