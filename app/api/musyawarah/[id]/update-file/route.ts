import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { del, put } from "@vercel/blob";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const beritaAcara = formData.get("beritaAcara") as File | null;
    const daftarHadir = formData.get("daftarHadir") as File | null;

    const existingData = await prisma.musyawarah.findUnique({
      where: { id: params.id },
    });

    if (!existingData) {
      return NextResponse.json(
        { error: "Data musyawarah tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateData: {
      beritaAcara?: string | null;
      daftarHadir?: string | null;
    } = {};

    if (beritaAcara) {
      if (existingData.beritaAcara) {
        await del(existingData.beritaAcara);
      }
      const { url } = await put(beritaAcara.name, beritaAcara, {
        access: "public",
        contentType: beritaAcara.type,
      });
      updateData.beritaAcara = url;
    }

    if (daftarHadir) {
      if (existingData.daftarHadir) {
        await del(existingData.daftarHadir);
      }
      const { url } = await put(daftarHadir.name, daftarHadir, {
        access: "public",
        contentType: daftarHadir.type,
      });
      updateData.daftarHadir = url;
    }

    const result = await prisma.musyawarah.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating file:", error);
    return NextResponse.json(
      {
        error: "Gagal mengupdate file",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE untuk menghapus file beritaAcara atau daftarHadir
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 });
  }

  try {
    const searchParams = new URL(request.url).searchParams;
    const fileType = searchParams.get("type"); // 'beritaAcara' atau 'daftarHadir'

    const musyawarah = await prisma.musyawarah.findUnique({
      where: { id: params.id },
      select: { beritaAcara: true, daftarHadir: true },
    });

    if (!musyawarah) {
      return NextResponse.json(
        { error: "Data sosialisasi tidak ditemukan" },
        { status: 404 }
      );
    }

    if (fileType === "beritaAcara" && musyawarah.beritaAcara) {
      await del(musyawarah.beritaAcara);
      await prisma.sosialisasi.update({
        where: { id: params.id },
        data: { beritaAcara: null },
      });
    } else if (fileType === "daftarHadir" && musyawarah.daftarHadir) {
      await del(musyawarah.daftarHadir);
      await prisma.sosialisasi.update({
        where: { id: params.id },
        data: { daftarHadir: null },
      });
    } else {
      return NextResponse.json(
        { error: `File ${fileType} tidak ditemukan atau sudah dihapus` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `File ${fileType} berhasil dihapus`,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      {
        error: "Gagal menghapus file",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
