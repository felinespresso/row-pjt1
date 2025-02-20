import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { del, put } from "@vercel/blob";

const baseUrl = "http://localhost:3000/uploads/";

// GET: Ambil semua data pengumuman
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const itemId = searchParams.get("itemId") ?? "0";
    const pengumuman = await prisma.pengumuman.findMany({
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

    const serializedData = pengumuman.map((item) => ({
      ...item,
      namaDesa: item.identifikasi.namadesa,
      spanTower: item.identifikasi.spantower,
      beritaAcara: item.beritaAcara
        ? `${baseUrl}${item.beritaAcara}?t=${Date.now()}`
        : null,
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
      "Error fetching pengumuman:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      { error: "Gagal mengambil data pengumuman" },
      { status: 500 }
    );
  }
}

// POST: Simpan data pengumuman baru
export async function POST(request: NextRequest) {
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

    const beritaAcara = formData.get("beritaAcara") as File | null;
    let beritaAcaraUrl = null;

    if (beritaAcara) {
      const { url } = await put(beritaAcara.name, beritaAcara, {
        access: "public",
        contentType: beritaAcara.type,
      });
      beritaAcaraUrl = url;
    }

    const pengumuman = await prisma.pengumuman.create({
      data: {
        itemId,
        identifikasiId,
        namaDesa: identifikasi.namadesa,
        spanTower: identifikasi.spantower,
        tanggalPelaksanaan: new Date(
          formData.get("tanggalPelaksanaan") as string
        ),
        keterangan: (formData.get("keterangan") as string) || "-",
        beritaAcara: beritaAcaraUrl,
      },
    });

    // Handle evidence files
    await handleEvidence(formData, pengumuman.id);

    return NextResponse.json({ success: true, data: pengumuman });
  } catch (error) {
    console.error("Error creating pengumuman:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data pengumuman" },
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

    const existingData = await prisma.pengumuman.findUnique({
      where: { id: params.id },
    });

    if (!existingData) {
      return NextResponse.json(
        { error: "Data pengumuman tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateData: {
      beritaAcara?: string | null;
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

    const result = await prisma.pengumuman.update({
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
const handleEvidence = async (formData: FormData, pengumumanId: string) => {
  const evidenceFiles = formData.getAll("evidence") as File[];

  const evidencePromises = evidenceFiles.map(async (file) => {
    const buffer = await file.arrayBuffer();
    return prisma.evidencePengumuman.create({
      data: {
        file: Buffer.from(buffer).toString("base64"),
        fileName: file.name,
        pengumumanId: pengumumanId,
      },
    });
  });

  await Promise.all(evidencePromises);
};
