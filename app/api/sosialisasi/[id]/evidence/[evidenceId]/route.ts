import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; evidenceId: string } }
) {
  try {
    const evidence = await prisma.evidenceSosialisasi.findUnique({
      where: {
        id: params.evidenceId,
        sosialisasiId: params.id,
      },
    });

    if (!evidence) {
      return NextResponse.json(
        { error: "Evidence tidak ditemukan" },
        { status: 404 }
      );
    }

    const imageBuffer = Buffer.from(evidence.file, 'base64');

    // Deteksi tipe gambar
    const imageType = evidence.file.startsWith('/9j/') ? 'image/jpeg' : 'image/png';

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": imageType,
        "Cache-Control": "public, max-age=31536000",
        "Content-Disposition": `inline; filename="evidence-${params.evidenceId}.${imageType.split('/')[1]}"`,
      },
    });
  } catch (error) {
    console.error("Error mengambil evidence:", error);
    return NextResponse.json(
      { error: "Gagal mengambil evidence" },
      { status: 500 }
    );
  }
} 