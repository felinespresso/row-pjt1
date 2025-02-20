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
    const ktp = formData.get("ktp") as File | null;
    const kartukeluarga = formData.get("kartukeluarga") as File | null;
    const alashak = formData.get("alashak") as File | null;

    const existingData = await prisma.pemberkasan.findUnique({
      where: { id: params.id },
    });

    if (!existingData) {
      return NextResponse.json(
        { error: "Data pemberkasan tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateData: {
      ktp?: string | null;
      kartukeluarga?: string | null;
      alashak?: string | null;
    } = {};

    if (ktp) {
      if (existingData.ktp) {
        await del(existingData.ktp);
      }
      const { url } = await put(ktp.name, ktp, {
        access: "public",
        contentType: ktp.type,
      });
      updateData.ktp = url;
    }

    if (kartukeluarga) {
      if (existingData.kartukeluarga) {
        await del(existingData.kartukeluarga);
      }
      const { url } = await put(kartukeluarga.name, kartukeluarga, {
        access: "public",
        contentType: kartukeluarga.type,
      });
      updateData.kartukeluarga = url;
    }

    if (alashak) {
      if (existingData.alashak) {
        await del(existingData.alashak);
      }
      const { url } = await put(alashak.name, alashak, {
        access: "public",
        contentType: alashak.type,
      });
      updateData.alashak = url;
    }

    const result = await prisma.pemberkasan.update({
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

// DELETE untuk menghapus file ktp atau kartukeluarga
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 });
  }

  try {
    const searchParams = new URL(request.url).searchParams;
    const fileType = searchParams.get("type"); // 'ktp', 'kartukeluarga' atau 'alashak'

    const pemberkasan = await prisma.pemberkasan.findUnique({
      where: { id: params.id },
      select: { ktp: true, kartukeluarga: true, alashak: true },
    });

    if (!pemberkasan) {
      return NextResponse.json(
        { error: "Data pemberkasan tidak ditemukan" },
        { status: 404 }
      );
    }

    if (fileType === "ktp" && pemberkasan.ktp) {
      await del(pemberkasan.ktp);
      await prisma.pemberkasan.update({
        where: { id: params.id },
        data: { ktp: null },
      });
    } else if (fileType === "kartukeluarga" && pemberkasan.kartukeluarga) {
      await del(pemberkasan.kartukeluarga);
      await prisma.pemberkasan.update({
        where: { id: params.id },
        data: { kartukeluarga: null },
      });
    } else if (fileType === "alashak" && pemberkasan.alashak) {
      await del(pemberkasan.alashak);
      await prisma.pemberkasan.update({
        where: { id: params.id },
        data: { alashak: null },
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
