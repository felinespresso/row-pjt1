import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const bangunan = await prisma.jenisbangunan.findMany();
    return NextResponse.json(bangunan);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data bangunan" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Set nilai default jika kosong
    const namabangunan = data.namabangunan || "-";
    const luasbangunan = data.luasbangunan || "-";

    const bangunan = await prisma.jenisbangunan.create({
      data: {
        namabangunan,
        luasbangunan,
      },
    });

    return NextResponse.json(bangunan, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menambah data bangunan" },
      { status: 500 }
    );
  }
}
