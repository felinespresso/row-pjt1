import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Ambil semua data penebangan
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

    // Jika tidak ada `identifikasiId`, ambil semua data pembayaran
    const penebangan = await prisma.penebangan.findMany({
      where: {
        itemId: parseInt(itemId),
      },
      include: {
        identifikasi: true,
        evidence: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const serializedData = penebangan.map((item) => ({
      id: item.id,
      namaDesa: item.identifikasi.namadesa,
      spanTower: item.identifikasi.spantower,
      bidangLahan: item.bidangLahan || "Tidak ada data", // Ambil langsung dari model Penebangan
      namaPemilik: item.namaPemilik || "Tidak ada data", // Ambil langsung dari model Penebangan
      tanggalPelaksanaan: item.tanggalPelaksanaan.toISOString(),
      keterangan: item.keterangan,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      evidence: item.evidence.map((ev) => ({
        id: ev.id,
        file: ev.file,
        fileName: ev.fileName ?? "",
      })),
    }));

    console.log("Data yang dikembalikan oleh API:", serializedData); // Debugging

    return NextResponse.json(serializedData);
  } catch (error) {
    console.error("Error fetching penebangan:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data penebangan" },
      { status: 500 }
    );
  }
}

// POST: Simpan data penebangan baru
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

    const itemId = identifikasi.itemId;
    if (!itemId) {
      return NextResponse.json(
        { error: "Identifikasi tidak terkait dengan proyek manapun" },
        { status: 400 }
      );
    }

    const penebangan = await prisma.penebangan.create({
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
      },
    });

    // ✅ Panggil handleEvidence untuk menyimpan file
    await handleEvidence(formData, penebangan.id);

    return NextResponse.json({ success: true, data: penebangan });
  } catch (error) {
    console.error("Error creating penebangan:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data penebangan" },
      { status: 500 }
    );
  }
}

// DELETE: Hapus data penebangan berdasarkan ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const penebanganId = searchParams.get("id");

    if (!penebanganId) {
      return NextResponse.json(
        { error: "ID penebangan tidak ditemukan" },
        { status: 400 }
      );
    }

    // Hapus semua evidence terkait sebelum menghapus data penebangan
    await prisma.evidencePenebangan.deleteMany({
      where: { penebanganId },
    });

    await prisma.penebangan.delete({
      where: { id: penebanganId },
    });

    return NextResponse.json({ message: "Data penebangan berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting penebangan:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data penebangan" },
      { status: 500 }
    );
  }
}

// Handle evidence files
const handleEvidence = async (formData: FormData, penebanganId: string) => {
  const evidenceFiles = formData.getAll("evidenceFiles") as File[];

  const evidencePromises = evidenceFiles.map(async (file) => {
    if (!file) return;

    const buffer = await file.arrayBuffer();
    const base64File = Buffer.from(buffer).toString("base64");

    await prisma.evidencePenebangan.create({
      data: {
        file: base64File,
        fileName: file.name,
        penebanganId: penebanganId,
      },
    });
  });

  // Tunggu semua promise selesai
  await Promise.all(evidencePromises);
};
