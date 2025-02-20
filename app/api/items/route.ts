import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      // Ambil proyek berdasarkan ID dan include identifikasi
      const item = await prisma.item.findUnique({
        where: { id: parseInt(id) },
        include: {
          identifikasi: true, // Pastikan data identifikasi ikut terhubung
        },
      });

      if (!item) {
        return NextResponse.json(
          { error: "Proyek tidak ditemukan" },
          { status: 404 }
        );
      }
      return NextResponse.json(item);
    } else {
      // Ambil semua proyek jika tidak ada ID
      const items = await prisma.item.findMany({
        include: {
          identifikasi: true, // Biar setiap proyek otomatis bawa data identifikasinya
        },
        orderBy: {
          tanggalkontrak: "asc",
        },
      });
      return NextResponse.json(items);
    }
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data proyek" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received body in /api/items:", body);

    if (
      !body.namaproyek ||
      !body.nomorkontrak ||
      !body.kodeproyek ||
      !body.password
    ) {
      return NextResponse.json(
        {
          error:
            "Nama proyek, nomor kontrak, kode proyek, dan password wajib diisi",
        },
        { status: 400 }
      );
    }

    const item = await prisma.item.create({
      data: {
        namaproyek: body.namaproyek,
        nomorkontrak: body.nomorkontrak,
        kodeproyek: body.kodeproyek,
        tanggalkontrak: new Date(body.tanggalkontrak),
        tanggalakhirkontrak: body.tanggalakhirkontrak
          ? new Date(body.tanggalakhirkontrak)
          : null,
        password: body.password,
      },
      include: {
        identifikasi: true, // Supaya langsung kelihatan ada identifikasinya atau belum
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Gagal membuat proyek baru" },
      { status: 500 }
    );
  }
}

// Verifikasi Password
export async function VERIFY(request: Request) {
  try {
    const body = await request.json();
    const { itemId, password } = body;

    if (!itemId || !password) {
      return NextResponse.json(
        { error: "ID dan password wajib" },
        { status: 400 }
      );
    }

    const item = await prisma.item.findUnique({
      where: { id: parseInt(itemId) },
      select: { password: true },
    });

    if (!item || item.password !== password) {
      return NextResponse.json({ isValid: false }, { status: 401 });
    }

    return NextResponse.json({ isValid: true });
  } catch (error) {
    console.error("Error verifying password:", error);
    return NextResponse.json(
      { error: "Gagal memverifikasi password" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    await prisma.item.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal menghapus data", error },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      namaproyek,
      nomorkontrak,
      kodeproyek,
      tanggalkontrak,
      tanggalakhirkontrak,
      password,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID proyek wajib diisi" },
        { status: 400 }
      );
    }

    // Periksa apakah proyek dengan ID ini ada
    const existingItem = await prisma.item.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingItem) {
      return NextResponse.json(
        { error: "Proyek tidak ditemukan" },
        { status: 404 }
      );
    }

    const updatedItem = await prisma.item.update({
      where: { id: parseInt(id) },
      data: {
        namaproyek,
        nomorkontrak,
        kodeproyek,
        tanggalkontrak: new Date(tanggalkontrak),
        tanggalakhirkontrak: tanggalakhirkontrak
          ? new Date(tanggalakhirkontrak)
          : null,
        password,
      },
      include: {
        identifikasi: true,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui proyek" },
      { status: 500 }
    );
  }
}
