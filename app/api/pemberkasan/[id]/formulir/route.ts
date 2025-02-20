import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!params.id || !type) {
      return NextResponse.json(
        { error: "ID atau tipe file tidak ditemukan" },
        { status: 400 }
      );
    }

    const pemberkasan = await prisma.pemberkasan.findUnique({
      where: { id: params.id },
      select: {
        ktp: true,
        kartukeluarga: true,
        alashak: true,
      },
    });

    if (!pemberkasan) {
      return NextResponse.json(
        { error: "Data pemberkasan tidak ditemukan" },
        { status: 404 }
      );
    }

    const fileUrl =
    type === "ktp"
      ? pemberkasan.ktp
      : type === "kartukeluarga"
      ? pemberkasan.kartukeluarga
      : pemberkasan.alashak;
  

    if (!fileUrl) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 404 }
      );
    }

    // Kembalikan URL file sebagai JSON response
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Error mengambil file:", error);
    return NextResponse.json(
      { error: "Gagal mengambil file" },
      { status: 500 }
    );
  }
}
