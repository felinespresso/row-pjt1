import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { del, put } from "@vercel/blob";

// Base URL untuk file
const baseUrl = "http://localhost:3000/uploads/";

// GET: Ambil semua data inventarisasi
export async function GET() {
  try {
    const invents = await prisma.inventarisasi.findMany({
      include: {
        jnsbangunan: {
          include: {
            jnsbangunan: true,
          },
        },
        jnstanaman: {
          include: {
            jnstanaman: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    const serializedData = invents.map((item) => ({
      ...item,
      formulir: item.formulir ? `${baseUrl}${item.formulir}` : null,
      pelaksanaan: item.pelaksanaan.toISOString(),
    }));

    return NextResponse.json(serializedData, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching inventarisasi:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data inventarisasi" },
      { status: 500 }
    );
  }
}

// 📌 POST: Unggah file formulir & Simpan URL ke Database
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const inventarisasi = await prisma.inventarisasi.create({
      data: {
        span: formData.get("span") as string,
        bidanglahan: formData.get("bidanglahan") as string,
        namapemilik: formData.get("namapemilik") as string,
        nik: formData.get("nik") as string,
        ttl: formData.get("ttl") as string,
        desakelurahan: formData.get("desakelurahan") as string,
        kecamatan: formData.get("kecamatan") as string,
        kabupatenkota: formData.get("kabupatenkota") as string,
        pekerjaan: formData.get("pekerjaan") as string,
        alashak: formData.get("alashak") as string,
        luastanah: formData.get("luastanah") as string,
        pelaksanaan: new Date(formData.get("pelaksanaan") as string),
        formulir: formData.get("formulir") as string | null, // Simpan URL formulir
      },
    });

    return NextResponse.json({ success: true, data: inventarisasi });
  } catch (error) {
    console.error("❌ Error menyimpan inventarisasi:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data inventarisasi" },
      { status: 500 }
    );
  }
}

// DELETE: Hapus data inventarisasi dan file formulir jika ada
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const existingInvent = await prisma.inventarisasi.findUnique({
      where: { id },
    });

    if (!existingInvent) {
      return NextResponse.json(
        { success: false, error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    // Jika ada file formulir, hapus dari storage
    if (existingInvent.formulir) {
      console.log("🗑️ Menghapus file formulir:", existingInvent.formulir);
      await del(existingInvent.formulir);
    }

    await prisma.inventarisasi.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting inventarisasi:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus data inventarisasi" },
      { status: 500 }
    );
  }
}
