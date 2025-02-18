import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { del, put } from "@vercel/blob";

const baseUrl = "http://localhost:3000/uploads/";

// GET: Ambil semua data sosialisasi
export async function GET() {
  try {
    const sosialisasi = await prisma.sosialisasi.findMany({
      include: {
        identifikasi: true,
        evidence: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const serializedData = sosialisasi.map((item) => ({
      ...item,
      namaDesa: item.identifikasi.namadesa,
      spanTower: item.identifikasi.spantower,
      beritaAcara: item.beritaAcara ? `${baseUrl}${item.beritaAcara}` : null,
      daftarHadir: item.daftarHadir ? `${baseUrl}${item.daftarHadir}` : null,
      tanggalPelaksanaan: item.tanggalPelaksanaan.toISOString(),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      evidence: item.evidence.map((ev) => ({
        id: ev.id,
        file: ev.file,
        fileName: ev.fileName,
      })),
    }));

    return NextResponse.json(serializedData);
  } catch (error) {
    console.error(
      "Error fetching sosialisasi:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      { error: "Gagal mengambil data sosialisasi" },
      { status: 500 }
    );
  }
}

// POST: Simpan data sosialisasi baru
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const identifikasiId = formData.get("identifikasiId") as string;

    // Ambil identifikasi berdasarkan ID
    const identifikasi = await prisma.identifikasi.findUnique({
      where: { id: identifikasiId },
      select: { id: true, itemId: true, namadesa: true, spantower: true },
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

    const beritaAcara = formData.get("beritaAcara") as File | null;
    const daftarHadir = formData.get("daftarHadir") as File | null;

    let beritaAcaraUrl = null;
    let daftarHadirUrl = null;

    if (beritaAcara) {
      const { url } = await put(beritaAcara.name, beritaAcara, {
        access: "public",
        contentType: beritaAcara.type,
      });
      beritaAcaraUrl = url;
    }

    if (daftarHadir) {
      const { url } = await put(daftarHadir.name, daftarHadir, {
        access: "public",
        contentType: daftarHadir.type,
      });
      daftarHadirUrl = url;
    }

    const sosialisasi = await prisma.sosialisasi.create({
      data: {
        itemId, // Tambahkan itemId
        identifikasiId,
        namaDesa: identifikasi.namadesa,
        spanTower: identifikasi.spantower,
        tanggalPelaksanaan: new Date(
          formData.get("tanggalPelaksanaan") as string
        ),
        keterangan: (formData.get("keterangan") as string) || "-",
        beritaAcara: beritaAcaraUrl,
        daftarHadir: daftarHadirUrl,
      },
    });

    // Handle evidence files
    await handleEvidence(formData, sosialisasi.id);

    return NextResponse.json({ success: true, data: sosialisasi });
  } catch (error) {
    console.error("Error creating sosialisasi:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data sosialisasi" },
      { status: 500 }
    );
  }
}

// PUT: Update file beritaAcara atau daftarHadir
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const beritaAcara = formData.get("beritaAcara") as File | null;
    const daftarHadir = formData.get("daftarHadir") as File | null;

    const existingData = await prisma.sosialisasi.findUnique({
      where: { id: params.id },
    });

    if (!existingData) {
      return NextResponse.json(
        { error: "Data sosialisasi tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateData: {
      beritaAcara?: string | null;
      daftarHadir?: string | null;
    } = {};

    if (beritaAcara) {
      if (existingData.beritaAcara) {
        await del(new URL(existingData.beritaAcara).pathname);
      }
      const { url } = await put(beritaAcara.name, beritaAcara, {
        access: "public",
        contentType: beritaAcara.type,
      });
      updateData.beritaAcara = url;
    }

    if (daftarHadir) {
      if (existingData.daftarHadir) {
        await del(new URL(existingData.daftarHadir).pathname);
      }
      const { url } = await put(daftarHadir.name, daftarHadir, {
        access: "public",
        contentType: daftarHadir.type,
      });
      updateData.daftarHadir = url;
    }

    const result = await prisma.sosialisasi.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating file:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate file" },
      { status: 500 }
    );
  }
}

// Handle evidence files
const handleEvidence = async (formData: FormData, sosialisasiId: string) => {
  const evidenceFiles = formData.getAll("evidence") as File[];
  const evidencePromises = evidenceFiles.map(async (file) => {
    const buffer = await file.arrayBuffer();
    return prisma.evidenceSosialisasi.create({
      data: {
        file: Buffer.from(buffer).toString("base64"),
        fileName: file.name,
        sosialisasiId: sosialisasiId,
      },
    });
  });

  // Tunggu semua promise selesai
  await Promise.all(evidencePromises);
};
