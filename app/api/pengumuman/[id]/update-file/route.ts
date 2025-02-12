import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { del, put } from "@vercel/blob"; // Pastikan import fungsi yang benar

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json(
      { error: "ID pengumuman tidak ditemukan" },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    const beritaAcara = formData.get("beritaAcara") as File | null;

    if (!beritaAcara) {
      return NextResponse.json(
        { error: "File berita acara tidak ditemukan" },
        { status: 400 }
      );
    }

    // Cari data pengumuman lama
    const existingPengumuman = await prisma.pengumuman.findUnique({
      where: { id: params.id },
    });

    if (!existingPengumuman) {
      return NextResponse.json(
        { error: "Data pengumuman tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus file lama jika ada
    if (existingPengumuman.beritaAcara) {
      await del(new URL(existingPengumuman.beritaAcara).pathname);
    }

    // Upload file baru ke storage
    const { url } = await put(beritaAcara.name, beritaAcara, {
      access: "public",
      contentType: beritaAcara.type,
    });

    // Update URL file di database
    const updatedPengumuman = await prisma.pengumuman.update({
      where: { id: params.id },
      data: { beritaAcara: url },
    });

    return NextResponse.json({
      success: true,
      data: updatedPengumuman,
    });
  } catch (error) {
    console.error("Error updating file:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate file" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json(
      { error: "ID pengumuman tidak ditemukan" },
      { status: 400 }
    );
  }

  try {
    // Cari data pengumuman yang akan dihapus
    const existingPengumuman = await prisma.pengumuman.findUnique({
      where: { id: params.id },
    });

    if (!existingPengumuman) {
      return NextResponse.json(
        { error: "Data pengumuman tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus file beritaAcara dari storage jika ada
    if (existingPengumuman.beritaAcara) {
      await del(new URL(existingPengumuman.beritaAcara).pathname);
    }

    // Hapus pengumuman dari database
    const deletedPengumuman = await prisma.pengumuman.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Pengumuman berhasil dihapus",
      data: deletedPengumuman,
    });
  } catch (error) {
    console.error("Error saat menghapus pengumuman:", error);
    return NextResponse.json(
      { error: "Gagal menghapus pengumuman" },
      { status: 500 }
    );
  }
}
