import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    // Pastikan file memiliki nama yang valid
    if (!file.name) {
      return NextResponse.json(
        { error: "File harus memiliki nama" },
        { status: 400 }
      );
    }

    console.log("📤 Mengunggah file formulir:", file.name);

    const uploadResult = await put(file.name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN, // Gunakan token yang benar
    });

    return NextResponse.json({ url: uploadResult.url });
  } catch (error) {
    console.error("❌ Error mengunggah formulir:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah formulir" },
      { status: 500 }
    );
  }
}
