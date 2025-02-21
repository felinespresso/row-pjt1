import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { del, put } from "@vercel/blob";

const baseUrl = "http://localhost:3000/uploads/";

// GET: Ambil semua data inventarisasi
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const itemId = searchParams.get("itemId") ?? "0";
    const invents = await prisma.inventarisasi.findMany({
      where: {
        itemId: parseInt(itemId),
      },
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
      formulir: item.formulir
      ? `${baseUrl}${item.formulir}?t=${Date.now()}`
      : null,
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
    if (!formData) {
      return NextResponse.json(
        { error: "Data form tidak ditemukan" },
        { status: 400 }
      );
    }

    console.log("oke");

    const formulir = formData.get("formulir") as File | null;
    const itemId = formData.get("itemId") as string;

    if (!itemId) {
      return NextResponse.json(
        { error: "identifikasiId diperlukan" },
        { status: 400 }
      );
    }

    let formulirUrl = null;
    if (formulir) {
      try {
        const { url } = await put(`/uploads/${formulir.name}`, formulir, {
          access: "public",
          contentType: formulir.type,
        });
        formulirUrl = url;
      } catch (uploadError) {
        console.error("❌ Error mengunggah formulir:", uploadError);
        return NextResponse.json(
          { error: "Gagal mengunggah file formulir" },
          { status: 500 }
        );
      }
    }

    console.log(formulirUrl);

    const inventarisasi = await prisma.inventarisasi.create({
      data: {
        itemId: parseInt(itemId),
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
        formulir: formulirUrl, // Simpan file formulir sebagai Base64
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
