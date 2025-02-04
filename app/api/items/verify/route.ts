import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemId, password } = body;

    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: { password: true },
    });

    if (!item) {
      return new NextResponse(
        JSON.stringify({ error: "Proyek tidak ditemukan" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const isPasswordValid = item.password === password;

    return new NextResponse(JSON.stringify({ isValid: isPasswordValid }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error verifying password:", error);
    return new NextResponse(
      JSON.stringify({ error: "Gagal memverifikasi password" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
