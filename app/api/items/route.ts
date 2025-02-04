// app/api/items/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from '@prisma/client';

// Handler untuk GET request
export async function GET(request: Request) {
  try {
    const items = await prisma.item.findMany({
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        namaproyek: true,
        nomorkontrak: true,
        kodeproyek: true,
        tanggalkontrak: true,
        tanggalakhirkontrak: true,
      },
    });

    return new NextResponse(JSON.stringify(items), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch items" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Handler untuk POST request
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const item = await prisma.item.create({
      data: {
        namaproyek: body.namaproyek,
        nomorkontrak: body.nomorkontrak,
        kodeproyek: body.kodeproyek,
        tanggalkontrak: new Date(body.tanggalkontrak),
        tanggalakhirkontrak: body.tanggalakhirkontrak 
          ? new Date(body.tanggalakhirkontrak) 
          : null,
        password: body.password,
      },
    });

    const { password, ...itemWithoutPassword } = item;
    return new NextResponse(JSON.stringify(itemWithoutPassword), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating item:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create item" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Tambahkan handler untuk PUT request
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    const updateData = {
      namaproyek: body.namaproyek,
      nomorkontrak: body.nomorkontrak,
      kodeproyek: body.kodeproyek,
      tanggalkontrak: new Date(body.tanggalkontrak),
      tanggalakhirkontrak: body.tanggalakhirkontrak 
        ? new Date(body.tanggalakhirkontrak) 
        : null,
      password: body.password,
    };

    const item = await prisma.item.update({
      where: { id: body.id },
      data: updateData,
    });

    const { password, ...itemWithoutPassword } = item;
    return new NextResponse(JSON.stringify(itemWithoutPassword), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating item:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to update item" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Tambahkan handler untuk DELETE request
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await prisma.item.delete({
      where: { id: parseInt(id) },
    });

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to delete item" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
