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

    const formulir = formData.get("formulir");
    const itemId = formData.get("itemId")?.toString();

    if (!itemId) {
      return NextResponse.json(
        { error: "itemId diperlukan" }, // 🔹 Perbaikan pesan error
        { status: 400 }
      );
    }

    let formulirUrl: string | null = null;
    if (formulir instanceof File) {
      // 🔹 Perbaikan validasi file
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

    console.log("Formulir URL:", formulirUrl);

    // 🔹 Parsing dan validasi bangunanList & tanamanList
    let bangunanList = [];
    let tanamanList = [];

    try {
      bangunanList = JSON.parse(
        (formData.get("bangunanList") as string) || "[]"
      );
      tanamanList = JSON.parse((formData.get("tanamanList") as string) || "[]");

      if (!Array.isArray(bangunanList) || !Array.isArray(tanamanList)) {
        throw new Error(
          "Format data bangunanList atau tanamanList tidak valid"
        );
      }
    } catch (error) {
      console.error("❌ Error parsing bangunanList/tanamanList:", error);
      return NextResponse.json(
        { error: "Format bangunanList/tanamanList tidak valid" },
        { status: 400 }
      );
    }

    const pelaksanaanRaw = formData.get("pelaksanaan")?.toString();
    const pelaksanaanDate = pelaksanaanRaw
      ? new Date(pelaksanaanRaw)
      : new Date(); // 🔹 Perbaikan parsing tanggal

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
          pelaksanaan: pelaksanaanDate,
          formulir: formulirUrl,
        },
      });
      
       // 🔹 2. Simpan `bangunanList` ke `jenisbangunan`
    for (const b of bangunanList) {
      await prisma.jenisbangunan.create({
        data: {
          namabangunan: b.namabangunan || "-",
          luasbangunan: b.luasbangunan || "-",
          invent: {
            create: {
              inventId: inventarisasi.id,
            },
          },
        },
      });
    }

    // 🔹 3. Simpan `tanamanList` ke `jenistanaman`
    for (const t of tanamanList) {
      await prisma.jenistanaman.create({
        data: {
          namatanaman: t.namatanaman || "-",
          produktif: t.produktif || "-",
          besar: t.besar || "-",
          kecil: t.kecil || "-",
          invent: {
            create: {
              inventId: inventarisasi.id,
            },
          },
        },
      });
    }
      

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
