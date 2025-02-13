import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; evidenceId: string } }
) {
  try {
    const evidence = await prisma.evidenceMusyawarah.findUnique({
      where: {
        id: params.evidenceId,
        musyawarahId: params.id,
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

// Hapus evidence
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; evidenceId: string } }
) {
  try {
    const deletedEvidence = await prisma.evidenceMusyawarah.delete({
      where: {
        id: params.evidenceId,
        musyawarahId: params.id,
      },
    });

    return NextResponse.json({
      message: "Evidence berhasil dihapus",
      deletedEvidence,
    });
  } catch (error) {
    console.error("Error menghapus evidence:", error);
    return NextResponse.json(
      { error: "Gagal menghapus evidence" },
      { status: 500 }
    );
  }
}

// Update evidence
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; evidenceId: string } }
) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    // Verifikasi evidence yang akan diupdate
    const existingEvidence = await prisma.evidenceMusyawarah.findUnique({
      where: {
        id: params.evidenceId,
        musyawarahId: params.id,
      },
    });

    if (!existingEvidence) {
      return NextResponse.json(
        { error: "Evidence tidak ditemukan" },
        { status: 404 }
      );
    }

    const buffer = await file.arrayBuffer();
    const base64File = Buffer.from(buffer).toString('base64');

    const updatedEvidence = await prisma.evidenceMusyawarah.update({
      where: {
        id: params.evidenceId,
        musyawarahId: params.id,
      },
      data: {
        file: base64File,
        fileName: file.name,
      },
    });

    return NextResponse.json({
      message: "Evidence berhasil diperbarui",
      evidence: {
        id: updatedEvidence.id,
        fileName: updatedEvidence.fileName
      }
    });
  } catch (error) {
    console.error("Error memperbarui evidence:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui evidence" },
      { status: 500 }
    );
  }
} 