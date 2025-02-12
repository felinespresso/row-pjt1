import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 });
  }

  try {
    // Cek apakah data exists
    const existingData = await prisma.pengumuman.findUnique({
      where: { id: params.id },
      include: {
        evidence: true,
      },
    });

    if (!existingData) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus data pengumuman
    // Evidence akan terhapus otomatis karena onDelete: Cascade
    const deletedData = await prisma.pengumuman.delete({
      where: {
        id: params.id,
      },
      include: {
        evidence: true,
      },
    });

    return NextResponse.json({
      message: "Data berhasil dihapus",
      deletedData,
    });
  } catch (error) {
    console.error("Error saat menghapus data:", error);

    // Log error detail untuk debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        error: "Gagal menghapus data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET untuk single item jika diperlukan
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pengumuman = await prisma.pengumuman.findUnique({
      where: { id: params.id },
      include: {
        evidence: true,
        identifikasi: true,
      },
    });

    if (!pengumuman) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(pengumuman);
  } catch (error) {
    console.error("Error fetching pengumuman:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pengumuman" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();

    const updateData: any = {
      tanggalPelaksanaan: new Date(
        formData.get("tanggalPelaksanaan") as string
      ),
      keterangan: formData.get("keterangan") as string,
    };

    // Handle file updates
    const beritaAcara = formData.get("beritaAcara") as File | null;

    if (beritaAcara) {
      const buffer = await beritaAcara.arrayBuffer();
      updateData.beritaAcara = Buffer.from(buffer);
    }

    const updatedPengumuman = await prisma.pengumuman.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedPengumuman,
    });
  } catch (error) {
    console.error("Error updating pengumuman:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate data pengumuman" },
      { status: 500 }
    );
  }
}
