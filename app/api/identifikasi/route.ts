import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { saveIdentifikasi } from "@/lib/identifikasi/action";

export async function GET(request: any, { params }: any) {
  const { id } = params; // Ambil ID proyek dari URL
  try {
    const identifikasi = await prisma.identifikasi.findMany({
      where: { itemId: parseInt(id) }, // Hanya ambil data sesuai proyek
      select: {
        id: true,
        namadesa: true,
        spantower: true,
      },
      orderBy: {
        namadesa: "asc",
      },
    });

    return NextResponse.json(identifikasi);
  } catch (error) {
    console.error("Error fetching identifikasi:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data identifikasi" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const response = await saveIdentifikasi(null, formData);

    if (response.Error) {
      return NextResponse.json(response, { status: 400 });
    }

    return NextResponse.json(
      { success: true, data: response },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json({ status: 500 });
  }
}
