import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Ambil evidence berdasarkan ID pengumuman dengan paginasi
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const skip = (page - 1) * limit;

    const [evidence, total] = await Promise.all([
      prisma.evidencePengumuman.findMany({
        where: {
          pengumumanId: params.id,
        },
        select: {
          id: true,
          fileName: true,
          file: false, // Jangan kembalikan data file (base64)
        },
        skip,
        take: limit,
      }),
      prisma.evidencePengumuman.count({
        where: {
          pengumumanId: params.id,
        },
      }),
    ]);

    return NextResponse.json({
      evidence,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching evidence:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data evidence" },
      { status: 500 }
    );
  }
}

// POST: Tambah evidence baru untuk pengumuman
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    const evidencePromises = files.map(async (file) => {
      const buffer = await file.arrayBuffer();
      return prisma.evidencePengumuman.create({
        data: {
          file: Buffer.from(buffer).toString("base64"),
          fileName: file.name,
          pengumumanId: params.id,
        },
      });
    });

    const newEvidence = await Promise.all(evidencePromises);

    return NextResponse.json({
      message: "Evidence berhasil ditambahkan",
      evidence: newEvidence.map((ev) => ({
        id: ev.id,
        fileName: ev.fileName,
      })),
    });
  } catch (error) {
    console.error("Error adding evidence:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan evidence" },
      { status: 500 }
    );
  }
}
