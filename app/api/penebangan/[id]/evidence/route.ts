import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
      prisma.evidencePenebangan.findMany({
        where: {
          penebanganId: params.id,
        },
        select: {
          id: true,
          fileName: true,
          file: false,
        },
        skip,
        take: limit,
      }),
      prisma.evidencePenebangan.count({
        where: {
          penebanganId: params.id,
        },
      }),
    ]);

    return NextResponse.json({
      evidence,
      total,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error("Error fetching evidence:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data evidence" },
      { status: 500 }
    );
  }
}

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
      return prisma.evidencePenebangan.create({
        data: {
          file: Buffer.from(buffer).toString("base64"),
          fileName: file.name,
          penebanganId: params.id,
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
