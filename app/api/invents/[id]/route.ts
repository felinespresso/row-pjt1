import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { del, put } from "@vercel/blob";

// GET: Ambil satu data inventarisasi berdasarkan ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const inventarisasi = await prisma.inventarisasi.findUnique({
      where: { id },
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
    });

    if (!inventarisasi) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(inventarisasi);
  } catch (error) {
    console.error("❌ Error fetching inventarisasi:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data inventarisasi" },
      { status: 500 }
    );
  }
}

// PUT: Perbarui data inventarisasi (termasuk file formulir)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const formData = await request.formData();

    const getValue = (key: string) => {
      const value = formData.get(key);
      return value ? value.toString() : "";
    };

    // Ambil data formulir yang ada
    const existingInvent = await prisma.inventarisasi.findUnique({
      where: { id },
      select: { formulir: true },
    });

    let formulirUrl: string | null = existingInvent?.formulir || null;
    const formulirFile = formData.get("formulir") as File | null;

    if (formulirFile) {
      // Jika ada file lama, hapus sebelum menyimpan yang baru
      if (existingInvent?.formulir) {
        console.log(
          "🗑️ Menghapus file formulir lama:",
          existingInvent.formulir
        );
        await del(existingInvent.formulir);
      }

      console.log("📤 Mengunggah formulir baru:", formulirFile.name);
      const uploadResult = await put(formulirFile.name, formulirFile, {
        access: "public",
      });
      formulirUrl = uploadResult.url;
    }

    // Perbarui data inventarisasi
    const updatedInventarisasi = await prisma.inventarisasi.update({
      where: { id },
      data: {
        span: getValue("span"),
        bidanglahan: getValue("bidanglahan"),
        namapemilik: getValue("namapemilik"),
        nik: getValue("nik"),
        ttl: getValue("ttl"),
        desakelurahan: getValue("desakelurahan"),
        kecamatan: getValue("kecamatan"),
        kabupatenkota: getValue("kabupatenkota"),
        pekerjaan: getValue("pekerjaan"),
        alashak: getValue("alashak"),
        luastanah: getValue("luastanah"),
        pelaksanaan: new Date(getValue("pelaksanaan")),
        formulir: formulirUrl, // Simpan URL file formulir, bukan file langsung
      },
    });

    return NextResponse.json({ success: true, data: updatedInventarisasi });
  } catch (error) {
    console.error("❌ Error updating inventarisasi:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate data inventarisasi" },
      { status: 500 }
    );
  }
}

// DELETE: Hapus data inventarisasi
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const existingData = await prisma.inventarisasi.findUnique({
      where: { id },
      select: { formulir: true },
    });

    if (!existingData) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus file formulir jika ada
    if (existingData.formulir) {
      console.log("🗑️ Menghapus file formulir:", existingData.formulir);
      await del(existingData.formulir);
    }

    // Hapus data dari database
    await prisma.inventarisasi.delete({ where: { id } });

    return NextResponse.json(
      { message: "Data berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting inventarisasi:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data inventarisasi" },
      { status: 500 }
    );
  }
}
