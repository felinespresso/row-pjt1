import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const sosialisasi = await prisma.sosialisasi.findMany({
      include: {
        identifikasi: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const serializedData = sosialisasi.map(item => ({
      ...item,
      namaDesa: item.identifikasi.namadesa,
      spanTower: item.identifikasi.spantower,
      tanggalPelaksanaan: item.tanggalPelaksanaan.toISOString(),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));

    return NextResponse.json(serializedData);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data sosialisasi" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Dapatkan data identifikasi untuk nama desa dan span tower
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

    const result = await prisma.$transaction(async (tx) => {
      // Handle file uploads
      const beritaAcara = formData.get("beritaAcara") as File | null;
      const daftarHadir = formData.get("daftarHadir") as File | null;

      const beritaAcaraBuffer = beritaAcara ? 
        Buffer.from(await beritaAcara.arrayBuffer()) : 
        null;
      
      const daftarHadirBuffer = daftarHadir ? 
        Buffer.from(await daftarHadir.arrayBuffer()) : 
        null;

      // Create sosialisasi record
      const sosialisasi = await tx.sosialisasi.create({
        data: {
          identifikasiId,
          namaDesa: identifikasi.namadesa,
          spanTower: identifikasi.spantower,
          tanggalPelaksanaan: new Date(formData.get("tanggalPelaksanaan") as string),
          keterangan: formData.get("keterangan") as string || "-",
          beritaAcara: beritaAcaraBuffer,
          daftarHadir: daftarHadirBuffer,
        },
      });

      // Handle evidence files
      const evidenceFiles = formData.getAll("evidence") as File[];
      const evidencePromises = evidenceFiles.map(async (file) => {
        const buffer = await file.arrayBuffer();
        return tx.evidenceSosialisasi.create({
          data: {
            file: Buffer.from(buffer).toString('base64'),
            sosialisasiId: sosialisasi.id,
          },
        });
      });

      await Promise.all(evidencePromises);

      return sosialisasi;
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error creating sosialisasi:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data sosialisasi" },
      { status: 500 }
    );
  }
}
