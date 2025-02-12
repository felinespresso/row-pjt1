import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
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

    // Ambil jenis bangunan dan tanaman yang relevan
    const relevantBangunan = await prisma.jenisbangunan.findMany({
      where: {
        id: {
          in: inventarisasi.jnsbangunan.map((b) => b.bangunanId),
        },
      },
    });

    const relevantTanaman = await prisma.jenistanaman.findMany({
      where: {
        id: {
          in: inventarisasi.jnstanaman.map((t) => t.tanamanId),
        },
      },
    });

    return NextResponse.json({
      ...inventarisasi,
      relevantBangunan,
      relevantTanaman,
    });
  } catch (error) {
    console.error("Error fetching inventarisasi:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data inventarisasi" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const formData = await request.formData();

    // Ambil data dari FormData
    const span = (formData.get("span") as string) || "";
    const bidanglahan = (formData.get("bidanglahan") as string) || "";
    const formulir = formData.get("formulir") as File | null;
    const namapemilik = (formData.get("namapemilik") as string) || "";
    const nik = (formData.get("nik") as string) || "";
    const ttl = (formData.get("ttl") as string) || "";
    const desakelurahan = (formData.get("desakelurahan") as string) || "";
    const kecamatan = (formData.get("kecamatan") as string) || "";
    const kabupatenkota = (formData.get("kabupatenkota") as string) || "";
    const alashak = (formData.get("alashak") as string) || "";
    const luastanah = (formData.get("luastanah") as string) || "";
    const pelaksanaan = (formData.get("pelaksanaan") as string) || "";
    const pekerjaan = (formData.get("pekerjaan") as string) || "";

    // Parse JSON string untuk data bangunan dan tanaman
    const jnsbangunanStr = formData.get("jnsbangunan");
    const jnstanamanStr = formData.get("jnstanaman");

    const jnsbangunan = jnsbangunanStr
      ? JSON.parse(jnsbangunanStr as string)
      : [];
    const jnstanaman = jnstanamanStr ? JSON.parse(jnstanamanStr as string) : [];

    // Konversi file ke buffer jika ada
    let formulirBuffer: Buffer | null = null;
    if (formulir) {
      const arrayBuffer = await formulir.arrayBuffer();
      formulirBuffer = Buffer.from(arrayBuffer);
    }

    // Hapus relasi yang ada
    await prisma.inventbangunan.deleteMany({
      where: { inventId: id },
    });
    await prisma.inventtanaman.deleteMany({
      where: { inventId: id },
    });

    // Update data inventarisasi
    const updatedInventarisasi = await prisma.inventarisasi.update({
      where: { id },
      data: {
        span,
        bidanglahan,
        formulir: formulirBuffer,
        pelaksanaan: pelaksanaan ? new Date(pelaksanaan) : undefined,
        namapemilik,
        nik,
        ttl,
        desakelurahan,
        kecamatan,
        kabupatenkota,
        alashak,
        luastanah,
        pekerjaan,
        jnsbangunan: {
          create: jnsbangunan.map((bangunan: { id: number }) => ({
            bangunanId: bangunan.id,
          })),
        },
        jnstanaman: {
          create: jnstanaman.map((tanaman: { id: number }) => ({
            tanamanId: tanaman.id,
          })),
        },
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
    });

    return NextResponse.json(updatedInventarisasi);
  } catch (error) {
    console.error("Error updating inventarisasi:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate data inventarisasi" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 });
  }

  try {
    const id = parseInt(params.id);

    // Cek apakah data exists
    const existingData = await prisma.inventarisasi.findUnique({
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

    if (!existingData) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    // Kumpulkan ID bangunan dan tanaman yang akan dihapus
    const bangunanIds = existingData.jnsbangunan.map((b) => b.bangunanId);
    const tanamanIds = existingData.jnstanaman.map((t) => t.tanamanId);

    // Gunakan transaction untuk menghapus semua data terkait
    await prisma.$transaction(async (tx) => {
      // 1. Hapus relasi di inventbangunan
      await tx.inventbangunan.deleteMany({
        where: { inventId: id },
      });

      // 2. Hapus relasi di inventtanaman
      await tx.inventtanaman.deleteMany({
        where: { inventId: id },
      });

      // 3. Hapus data jenisbangunan
      if (bangunanIds.length > 0) {
        await tx.jenisbangunan.deleteMany({
          where: { id: { in: bangunanIds } },
        });
      }

      // 4. Hapus data jenistanaman
      if (tanamanIds.length > 0) {
        await tx.jenistanaman.deleteMany({
          where: { id: { in: tanamanIds } },
        });
      }

      // 5. Hapus data inventarisasi
      await tx.inventarisasi.delete({
        where: { id },
      });
    });

    return NextResponse.json(
      { message: "Data berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error menghapus data:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data" },
      { status: 500 }
    );
  }
}
