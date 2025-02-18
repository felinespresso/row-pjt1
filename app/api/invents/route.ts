import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

// POST: Simpan data inventarisasi dan file formulir langsung ke database
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const formulir = formData.get("formulir")?.toString() || null;

    const inventarisasi = await prisma.inventarisasi.create({
      data: {
        span: formData.get("span")?.toString() || "-",
        bidanglahan: formData.get("bidanglahan")?.toString() || "-",
        namapemilik: formData.get("namapemilik")?.toString() || "-",
        nik: formData.get("nik")?.toString() || "-",
        ttl: formData.get("ttl")?.toString() || "-",
        desakelurahan: formData.get("desakelurahan")?.toString() || "-",
        kecamatan: formData.get("kecamatan")?.toString() || "-",
        kabupatenkota: formData.get("kabupatenkota")?.toString() || "-",
        pekerjaan: formData.get("pekerjaan")?.toString() || "-",
        alashak: formData.get("alashak")?.toString() || "-",
        luastanah: formData.get("luastanah")?.toString() || "-",
        pelaksanaan: new Date(
          formData.get("pelaksanaan")?.toString() || Date.now()
        ),
        formulir: formulir, // Simpan file formulir sebagai Base64
      },
    });

    return NextResponse.json(
      { success: true, data: inventarisasi },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error menyimpan inventarisasi:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data inventarisasi" },
      { status: 500 }
    );
  }
}

// DELETE: Hapus data inventarisasi (file formulir tidak perlu dihapus dari storage eksternal)
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const existingInvent = await prisma.inventarisasi.findUnique({
      where: { id: Number(id) },
    });

    if (!existingInvent) {
      return NextResponse.json(
        { success: false, error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.inventarisasi.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting inventarisasi:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus data inventarisasi" },
      { status: 500 }
    );
  }
}
