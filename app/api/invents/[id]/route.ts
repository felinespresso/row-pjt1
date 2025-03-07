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

// PUT: Update data inventarisasi
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const formData = await request.formData();

    // Ambil dan validasi data bangunan & tanaman
    let bangunanData, tanamanData;
    try {
      bangunanData = JSON.parse(formData.get("bangunanData")?.toString() || "[]");
      tanamanData = JSON.parse(formData.get("tanamanData")?.toString() || "[]");
      
      if (!Array.isArray(bangunanData) || !Array.isArray(tanamanData)) {
        throw new Error("Format data tidak valid");
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Format data bangunan/tanaman tidak valid" },
        { status: 400 }
      );
    }

    // Ambil data yang ada
    const existingInvent = await prisma.inventarisasi.findUnique({
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

    if (!existingInvent) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    // Handle formulir
    let formulirUrl = existingInvent.formulir;
    const formulirFile = formData.get("formulir") as File | null;

    if (formulirFile) {
      if (existingInvent.formulir) {
        await del(existingInvent.formulir);
      }
      const { url } = await put(`/uploads/${formulirFile.name}`, formulirFile, {
        access: "public",
      });
      formulirUrl = url;
    }

    // Update dalam transaksi
    await prisma.$transaction(async (prisma) => {
      // Update bangunan
      for (const bangunan of bangunanData) {
        if (!bangunan.id) continue;
        
        // Cek apakah bangunan terkait dengan inventarisasi ini
        const existingBangunan = await prisma.inventbangunan.findFirst({
          where: {
            inventId: id,
            bangunanId: bangunan.id
          }
        });

        if (existingBangunan) {
          await prisma.jenisbangunan.update({
            where: { 
              id: bangunan.id 
            },
            data: {
              namabangunan: bangunan.namabangunan || "-",
              luasbangunan: bangunan.luasbangunan || "-"
            }
          });
        }
      }

      // Update tanaman
      for (const tanaman of tanamanData) {
        if (!tanaman.id) continue;

        // Cek apakah tanaman terkait dengan inventarisasi ini
        const existingTanaman = await prisma.inventtanaman.findFirst({
          where: {
            inventId: id,
            tanamanId: tanaman.id
          }
        });

        if (existingTanaman) {
          await prisma.jenistanaman.update({
            where: { 
              id: tanaman.id 
            },
            data: {
              namatanaman: tanaman.namatanaman || "-",
              produktif: tanaman.produktif || "-",
              besar: tanaman.besar || "-",
              kecil: tanaman.kecil || "-"
            }
          });
        }
      }

      // Update data inventarisasi
      await prisma.inventarisasi.update({
        where: { id },
        data: {
          span: formData.get("span")?.toString() || "",
          bidanglahan: formData.get("bidanglahan")?.toString() || "",
          namapemilik: formData.get("namapemilik")?.toString() || "",
          nik: formData.get("nik")?.toString() || "",
          ttl: formData.get("ttl")?.toString() || "",
          desakelurahan: formData.get("desakelurahan")?.toString() || "",
          kecamatan: formData.get("kecamatan")?.toString() || "",
          kabupatenkota: formData.get("kabupatenkota")?.toString() || "",
          pekerjaan: formData.get("pekerjaan")?.toString() || "",
          alashak: formData.get("alashak")?.toString() || "",
          luastanah: formData.get("luastanah")?.toString() || "",
          pelaksanaan: new Date(formData.get("pelaksanaan")?.toString() || new Date()),
          formulir: formulirUrl,
        },
      });
    });

    return NextResponse.json(
      { success: true, message: "Data berhasil diupdate" },
      { status: 200 }
    );
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
