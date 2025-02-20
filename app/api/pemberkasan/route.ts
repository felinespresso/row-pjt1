import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { del, put } from "@vercel/blob";

const baseUrl = "http://localhost:3000/uploads/";

// GET: Ambil semua data pemberkasan
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const itemId = searchParams.get("itemId") ?? "0";
    const identifikasiId = searchParams.get("identifikasiId");

    // Jika ada `identifikasiId`, ambil bidang lahan & nama pemilik dari `Evidences`
    if (identifikasiId) {
      const evidences = await prisma.evidences.findMany({
        where: {
          desaId: identifikasiId,
        },
        select: {
          id: true,
          bidangLahan: true,
          namaPemilik: true,
        },
      });

      return NextResponse.json(evidences);
    }

    // Jika tidak ada `identifikasiId`, ambil semua data pember
    const pemberkasan = await prisma.pemberkasan.findMany({
      where: {
        itemId: parseInt(itemId),
      },
      include: {
        identifikasi: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const serializedData = pemberkasan.map((item) => ({
      id: item.id,
      namaDesa: item.identifikasi.namadesa,
      spanTower: item.identifikasi.spantower,
      bidangLahan: item.bidangLahan || "Tidak ada data", // Ambil langsung dari model pember
      namaPemilik: item.namaPemilik || "Tidak ada data", // Ambil langsung dari model pember
      tanggalPelaksanaan: item.tanggalPelaksanaan.toISOString(),
      keterangan: item.keterangan,
      ktp: item.ktp ? `${baseUrl}${item.ktp}` : null,
      kartukeluarga: item.kartukeluarga
        ? `${baseUrl}${item.kartukeluarga}`
        : null,
      alashak: item.alashak ? `${baseUrl}${item.kartukeluarga}` : null,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));

    console.log("Data yang dikembalikan oleh API:", serializedData); // Debugging

    return NextResponse.json(serializedData);
  } catch (error) {
    console.error("Error fetching pember:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pemberkasan" },
      { status: 500 }
    );
  }
}

// POST: Simpan data pemberkasan baru
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const identifikasiId = formData.get("identifikasiId") as string;
    const identifikasi = await prisma.identifikasi.findUnique({
      where: { id: identifikasiId },
    });

    if (!identifikasi) {
      return NextResponse.json(
        { error: "Data identifikasi tidak ditemukan" },
        { status: 404 }
      );
    }

    const itemId = identifikasi.itemId;
    if (!itemId) {
      return NextResponse.json(
        { error: "Identifikasi tidak terkait dengan proyek manapun" },
        { status: 400 }
      );
    }

    // Ambil bidang lahan dan nama pemilik dari evidences berdasarkan identifikasiId
    const bidangLahanId = formData.get("bidangLahanId") as string;
    const selectedEvidence = await prisma.evidences.findUnique({
      where: { id: bidangLahanId },
      select: { bidangLahan: true, namaPemilik: true },
    });

    if (!selectedEvidence) {
      return NextResponse.json(
        { error: "Data bidang lahan tidak ditemukan" },
        { status: 404 }
      );
    }

    const ktp = formData.get("ktp") as File | null;
    const kartukeluarga = formData.get("kartukeluarga") as File | null;
    const alashak = formData.get("alashak") as File | null;

    let ktpUrl = null;
    let kartukeluargaUrl = null;
    let alashakUrl = null;

    if (ktp) {
      const { url } = await put(ktp.name, ktp, {
        access: "public",
        contentType: ktp.type,
      });
      ktpUrl = url;
    }

    if (kartukeluarga) {
      const { url } = await put(kartukeluarga.name, kartukeluarga, {
        access: "public",
        contentType: kartukeluarga.type,
      });
      kartukeluargaUrl = url;
    }

    if (alashak) {
      const { url } = await put(alashak.name, alashak, {
        access: "public",
        contentType: alashak.type,
      });
      alashakUrl = url;
    }


    const pemberkasan = await prisma.pemberkasan.create({
      data: {
        itemId,
        identifikasiId,
        namaDesa: identifikasi.namadesa,
        spanTower: identifikasi.spantower,
        bidangLahan: selectedEvidence.bidangLahan ?? "", // Perbaikan: Pastikan null diubah ke string kosong
        namaPemilik: selectedEvidence.namaPemilik ?? "", // Perbaikan: Pastikan null diubah ke string kosong
        tanggalPelaksanaan: new Date(
          formData.get("tanggalPelaksanaan") as string
        ),
        keterangan: (formData.get("keterangan") as string) || "-",
        ktp: ktpUrl,
        alashak: alashakUrl,
      },
    });

    return NextResponse.json({ success: true, data: pemberkasan });
  } catch (error) {
    console.error("Error creating pemberkasan:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data pemberkasan" },
      { status: 500 }
    );
  }
}

// DELETE: Hapus data pemberkasan berdasarkan ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pemberkasanId = searchParams.get("id");

    if (!pemberkasanId) {
      return NextResponse.json(
        { error: "ID pemberkasan tidak ditemukan" },
        { status: 400 }
      );
    }

    await prisma.pemberkasan.delete({
      where: { id: pemberkasanId },
    });

    return NextResponse.json({ message: "Data pemberkasan berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting pemberkasan:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data pemberkasan" },
      { status: 500 }
    );
  }
}
