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
    const existingData = await prisma.penebangan.findUnique({
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

    // Hapus data sosialisasi
    // Evidence akan terhapus otomatis karena onDelete: Cascade
    const deletedData = await prisma.penebangan.delete({
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

// Tambahkan juga GET untuk single item jika diperlukan
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const penebangan = await prisma.penebangan.findUnique({
      where: { id: params.id },
      include: {
        evidence: true,
        identifikasi: true,
      },
    });

    if (!penebangan) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(penebangan);
  } catch (error) {
    console.error("Error fetching penebangan:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data penebangan" },
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
      tanggalPelaksanaan: new Date(formData.get("tanggalPelaksanaan") as string),
      keterangan: formData.get("keterangan") as string,
    };

    const updatedPenebangan = await prisma.penebangan.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedPenebangan,
    });
  } catch (error) {
    console.error("Error updating penebangan:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate data penebangan" },
      { status: 500 }
    );
  }
}
