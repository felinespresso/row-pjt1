import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Handler untuk GET request
export async function GET() {
  try {
    const invents = await prisma.inventarisasi.findMany({
      include: {
        jnsbangunan: {
          include: {
            jnsbangunan: true,
          },
        },
        jnstanaman: {
          include: {
            jnstanaman: true,
          },
        },
      },
      orderBy: [
        {
          id: 'desc' // Gunakan ID sebagai alternatif jika tidak ada createdAt
        }
      ],
    });

    // Konversi data binary ke base64
    const serializedData = invents.map((item) => ({
      ...item,
      formulir: item.formulir
        ? Buffer.from(item.formulir).toString("base64")
        : null,
    }));

    return NextResponse.json(serializedData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching inventarisasi:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data inventarisasi" },
      { status: 500 }
    );
  }
}

// Handler untuk POST request
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Fungsi helper untuk mengambil nilai dari FormData
    const getValue = (key: string) => {
      const value = formData.get(key);
      return value ? value.toString() : "-";
    };

    // Proses file formulir jika ada
    let formulirBuffer: Buffer | null = null;
    const formulirFile = formData.get("formulir") as File | null;

    if (formulirFile instanceof File) {
      const arrayBuffer = await formulirFile.arrayBuffer();
      formulirBuffer = Buffer.from(arrayBuffer);
    }

    // Buat data inventarisasi
    const result = await prisma.$transaction(async (tx) => {
      // Buat record inventarisasi dengan formulir opsional
      const inventarisasi = await tx.inventarisasi.create({
        data: {
          span: getValue("span"),
          bidanglahan: getValue("bidanglahan"),
          namapemilik: getValue("namapemilik"),
          nik: getValue("nik"),
          ttl: getValue("ttl"),
          desakelurahan: getValue("desakelurahan"),
          kecamatan: getValue("kecamatan"),
          kabupatenkota: getValue("kabupatenkota"),
          alashak: getValue("alashak"),
          luastanah: getValue("luastanah"),
          pelaksanaan: new Date(
            getValue("pelaksanaan") || new Date().toISOString()
          ),
          ...(formulirBuffer ? { formulir: formulirBuffer } : {}), // Hanya tambahkan jika ada
        },
      });

      // Parse dan validasi data bangunan
      let bangunanData = [];
      const bangunanStr = formData.get("jnsbangunan");
      if (bangunanStr) {
        try {
          const parsedBangunan = JSON.parse(bangunanStr.toString());
          bangunanData = Array.isArray(parsedBangunan) ? parsedBangunan : [];
        } catch {
          bangunanData = [];
        }
      }

      // Parse dan validasi data tanaman
      let tanamanData = [];
      const tanamanStr = formData.get("jnstanaman");
      if (tanamanStr) {
        try {
          const parsedTanaman = JSON.parse(tanamanStr.toString());
          tanamanData = Array.isArray(parsedTanaman) ? parsedTanaman : [];
        } catch {
          tanamanData = [];
        }
      }

      // Proses data bangunan jika ada
      if (bangunanData.length > 0) {
        for (const bangunan of bangunanData) {
          const newBangunan = await tx.jenisbangunan.create({
            data: {
              namabangunan: bangunan.namabangunan || "-",
              luasbangunan: bangunan.luasbangunan || "-",
            },
          });

          await tx.inventbangunan.create({
            data: {
              inventId: inventarisasi.id,
              bangunanId: newBangunan.id,
            },
          });
        }
      }

      // Proses data tanaman jika ada
      if (tanamanData.length > 0) {
        for (const tanaman of tanamanData) {
          const newTanaman = await tx.jenistanaman.create({
            data: {
              namatanaman: tanaman.namatanaman || "-",
              produktif: tanaman.produktif || "-",
              besar: tanaman.besar || "-",
              kecil: tanaman.kecil || "-",
              bibit: tanaman.bibit || "-",
            },
          });

          await tx.inventtanaman.create({
            data: {
              inventId: inventarisasi.id,
              tanamanId: newTanaman.id,
            },
          });
        }
      }

      return inventarisasi;
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error("Error creating inventarisasi:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan data inventarisasi" },
      { status: 500 }
    );
  }
}
