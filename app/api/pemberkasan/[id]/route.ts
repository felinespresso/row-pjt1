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
    const existingData = await prisma.pemberkasan.findUnique({
      where: { id: params.id },
    });

    if (!existingData) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus data pemberkasan
    // Evidence akan terhapus otomatis karena onDelete: Cascade
    const deletedData = await prisma.pemberkasan.delete({
      where: {
        id: params.id,
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
    const pemberkasan = await prisma.pemberkasan.findUnique({
      where: { id: params.id },
      include: {
        identifikasi: true,
      },
    });

    if (!pemberkasan) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(pemberkasan);
  } catch (error) {
    console.error("Error fetching pemberkasan:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pemberkasan" },
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

    // Handle file updates
    const ktp = formData.get("ktp") as File | null;
    const kartukeluarga = formData.get("kartukeluarga") as File | null;
    const alashak = formData.get("alashak") as File | null;

    if (ktp) {
      const buffer = await ktp.arrayBuffer();
      updateData.ktp = Buffer.from(buffer);
    }

    if (kartukeluarga) {
      const buffer = await kartukeluarga.arrayBuffer();
      updateData.kartukeluarga = Buffer.from(buffer);
    }

    if (alashak) {
      const buffer = await alashak.arrayBuffer();
      updateData.alashak = Buffer.from(buffer);
    }

    const updatedPemberkasan = await prisma.pemberkasan.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedPemberkasan,
    });
  } catch (error) {
    console.error("Error updating pemberkasan:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate data pemberkasan" },
      { status: 500 }
    );
  }
}
