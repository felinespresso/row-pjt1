import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET PengumumanEvidence dengan file gambar
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; evidenceId: string } }
) {
  try {
    const evidence = await prisma.evidencePengumuman.findUnique({
      where: { id: params.evidenceId },
    });

    if (!evidence) {
      return NextResponse.json(
        { error: "Evidence tidak ditemukan" },
        { status: 404 }
      );
    }

    const imageBuffer = Buffer.from(evidence.file, "base64");
    const imageType = evidence.file.startsWith("/9j/")
      ? "image/jpeg"
      : "image/png";

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": imageType,
        "Cache-Control": "public, max-age=31536000",
        "Content-Disposition": `inline; filename="${
          evidence.fileName || "evidence"
        }.${imageType.split("/")[1]}"`,
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

// DELETE PengumumanEvidence
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; evidenceId: string } }
) {
  try {
    const deletedEvidence = await prisma.evidencePengumuman.delete({
      where: { id: params.evidenceId },
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

// PUT PengumumanEvidence untuk memperbarui file
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
    const existingEvidence = await prisma.evidencePengumuman.findUnique({
      where: {
        id: params.evidenceId,
        pengumumanId: params.id,
      },
    });

    if (!existingEvidence) {
      return NextResponse.json(
        { error: "Evidence tidak ditemukan" },
        { status: 404 }
      );
    }

    const buffer = await file.arrayBuffer();
    const base64File = Buffer.from(buffer).toString("base64");

    const updatedEvidence = await prisma.evidencePengumuman.update({
      where: { id: params.evidenceId },
      data: {
        file: base64File,
        fileName: file.name,
      },
    });

    return NextResponse.json({
      message: "Evidence berhasil diperbarui",
      evidence: {
        id: updatedEvidence.id,
        fileName: updatedEvidence.fileName,
      },
    });
  } catch (error) {
    console.error("Error memperbarui evidence:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui evidence" },
      { status: 500 }
    );
  }
}
