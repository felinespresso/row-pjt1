import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.item.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    if (!item) {
      return new NextResponse(JSON.stringify({ error: "Item not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(JSON.stringify(item), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
} 