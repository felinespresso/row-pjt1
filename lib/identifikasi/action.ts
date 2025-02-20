"use server";

import { z } from "zod";
import { del, put } from "@vercel/blob";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDataById, getEvidenceById, getEvidence } from "./data";

const IdentifikasiSchema = z.object({
    itemId: z.string().min(1), // Tambahkan validasi itemId
    namadesa: z.string().min(1),
    spantower: z.string().min(6),
    tanggal: z
        .string()
        .min(1, { message: "Tanggal Pelaksanaan must be filled" }),
    evidences: z
        .array(
            z.object({
                file: z
                    .instanceof(File)
                    .refine((file) => file.size > 0, {
                        message: "File is required",
                        path: ["file"],
                    })
                    .refine(
                        (file) =>
                            file.size === 0 || file.type.startsWith("image/"),
                        {
                            message: "Only images are allowed",
                            path: ["file"],
                        }
                    )
                    .refine((file) => file.size < 8000000, {
                        message: "File must less than 8MB",
                        path: ["file"],
                    }),
                namaPemilik: z.string().min(1),
                bidangLahan: z.string().min(1),
            })
        )
        .refine((evidences) => evidences.length > 0, {
            message: "Data must not be empty!",
            path: [],
        }),
    fotoudara: z
        .instanceof(File)
        .refine((file) => file.size > 0, { message: "File is required" })
        .refine(
            (file) =>
                file.size === 0 ||
                [
                    "image/",
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "application/vnd.ms-excel",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ].some((type) => file.type.startsWith(type)),
            {
                message:
                    "Unsupported file format. Ensure your file is in the correct format and try again.",
            }
        )
        .refine((file) => file.size < 8000000, {
            message: "File must less than 8MB",
        }),
});

const UpdateSchema = z.object({
    namadesa: z.string().min(1),
    spantower: z.string().min(6),
    tanggal: z
        .string()
        .min(1, { message: "Tanggal Pelaksanaan must be filled" }),
    fotoudara: z
        .instanceof(File)
        .refine(
            (file) =>
                file.size === 0 ||
                [
                    "image/",
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "application/vnd.ms-excel",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ].some((type) => file.type.startsWith(type)),
            {
                message:
                    "Unsupported file format. Ensure your file is in the correct format and try again.",
            }
        )
        .refine((file) => file.size < 8000000, {
            message: "File must less than 8MB",
        })
        .optional(),
});

const UploadSchema = z.object({
    file: z
        .instanceof(File)
        .refine((file) => file.size > 0, {
            message: "File is required",
            path: ["file"],
        })
        .refine((file) => file.size === 0 || file.type.startsWith("image/"), {
            message: "Only images are allowed",
            path: ["file"],
        })
        .refine((file) => file.size < 8000000, {
            message: "File must less than 8MB",
            path: ["file"],
        }),
    namaPemilik: z.string().min(1),
    bidangLahan: z.string().min(1),
});

const EvidenceSchema = z.object({
    file: z
        .instanceof(File)
        .refine((file) => file.size === 0 || file.type.startsWith("image/"), {
            message: "Only images are allowed",
        })
        .refine((file) => file.size < 8000000, {
            message: "File must less than 8MB",
        })
        .optional(),
    namaPemilik: z.string().min(1),
    bidangLahan: z.string().min(1),
});

// Save data identifikasi
export const saveIdentifikasi = async (prevState: any, formData: FormData) => {
    const itemId = formData.get("itemId")
        ? String(formData.get("itemId"))
        : null; // Simpan sebagai string

    if (!itemId) {
        console.error("ID proyek tidak ditemukan atau tidak valid!");
        return { message: "ID proyek wajib ada dan harus berupa string" };
    }

    const evidences = [];

    // Masukkan evidence utama
    const mainFile = formData.get("file") as File;
    const mainNamaPemilik = formData.get("namaPemilik") as string;
    const mainBidangLahan = formData.get("bidangLahan") as string;
    if (mainFile && mainNamaPemilik && mainBidangLahan) {
        evidences.push({
            file: mainFile,
            namaPemilik: mainNamaPemilik,
            bidangLahan: mainBidangLahan,
        });
    }

    // Iterasi evidence tambahan dari FormData
    formData.forEach((value, key) => {
        if (key.startsWith("file-")) {
            const index = parseInt(key.split("-")[1], 10);
            const namaPemilik = formData.get(`namaPemilik-${index}`) as string;
            const bidangLahan = formData.get(`bidangLahan-${index}`) as string;
            if (value instanceof File && namaPemilik && bidangLahan) {
                evidences.push({ file: value, namaPemilik, bidangLahan });
            }
        }
    });

    // Hilangkan duplikasi evidences
    const uniqueEvidences = Array.from(
        new Map(
            evidences.map((evidence) => [
                `${evidence.file.name}-${evidence.namaPemilik}-${evidence.bidangLahan}`,
                evidence,
            ])
        ).values()
    );

    const validatedFields = IdentifikasiSchema.safeParse({
        ...Object.fromEntries(formData.entries()),
        evidences: uniqueEvidences,
        itemId,
    });

    if (!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error);
        return {
            Error: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { evidences: evidenceList, fotoudara } = validatedFields.data;

    try {
        // Upload foto udara terlebih dahulu
        const { url: fotoUdaraUrl } = await put(fotoudara.name, fotoudara, {
            access: "public",
            multipart: true,
        });

        // Upload semua evidence files
        const evidenceUrls = await Promise.all(
            evidenceList.map(async (evidence) => {
                const { url: fileUrl } = await put(
                    evidence.file.name,
                    evidence.file,
                    {
                        access: "public",
                        multipart: true,
                    }
                );
                return {
                    file: fileUrl,
                    namaPemilik: evidence.namaPemilik,
                    bidangLahan: evidence.bidangLahan,
                };
            })
        );

        const identifikasi = await prisma.identifikasi.create({
            data: {
                item: { connect: { id: parseInt(itemId) } }, // Konversi kembali ke number saat digunakan di Prisma
                namadesa: validatedFields.data.namadesa,
                spantower: validatedFields.data.spantower,
                tanggal: validatedFields.data.tanggal,
                fotoudara: fotoUdaraUrl,
            },
        });

        await prisma.evidences.createMany({
            data: evidenceUrls.map((evidence) => ({
                ...evidence,
                desaId: identifikasi.id,
            })),
        });

        console.log("Data berhasil disimpan:", identifikasi);

        revalidatePath(`/identifikasi-awal/${itemId}`);
        redirect(`/identifikasi-awal/${itemId}`);
    } catch (error) {
        console.error("Error when saving data", error);
        return { message: "Failed to create data" };
    }
};

//Update data identifikasi
export const editIdentifikasi = async (id:string, itemId:string, prevState: any, formData: FormData) => {
  const validatedFields = UpdateSchema.safeParse(
      Object.fromEntries(formData.entries()),
  );
  
  if (!validatedFields.success) {
      console.error("Validation failed:", validatedFields.error);
      return {
          Error: validatedFields.error.flatten().fieldErrors,
      };
  };
  
  const data = await getDataById(id);
  if (!data) return {message: "No Data Found"};

    const { fotoudara } = validatedFields.data;
    let fotoudaraPath;
    if (!fotoudara || fotoudara.size <= 0) {
        fotoudaraPath = data.fotoudara;
    } else {
        await del(data.fotoudara!);
        const { url: fotoUdaraUrl } = await put(fotoudara.name, fotoudara, {
            access: "public",
            multipart: true,
        });
        fotoudaraPath = fotoUdaraUrl;
    }

    try {
        await prisma.identifikasi.update({
            data: {
                namadesa: validatedFields.data.namadesa,
                spantower: validatedFields.data.spantower,
                tanggal: validatedFields.data.tanggal,
                fotoudara: fotoudaraPath,
            },
            where: { id },
        });
    } catch (error) {
        console.error("Error when update data", error);
        return { message: "Failed to update data" };
    }

  revalidatePath(`/identifikasi-awal/${itemId}`);
  redirect(`/identifikasi-awal/${itemId}`);
};

//Delete data identifikasi
export const deleteIdentifikasi = async (id: string) => {
    const data = await getDataById(id);
    if (!data) return { message: "No data found" };

    for (const evidence of data.evidence) {
        await del(evidence.file);
    }
    if (data.fotoudara) {
        await del(data.fotoudara);
    }

    try {
        await prisma.identifikasi.delete({
            where: { id },
        });
        revalidatePath("/identifikasi-awal");
        return { success: true };
    } catch (error) {
        return { success: false, message: "Failed to delete data" };
    }
};

//Delete data evidence
export const deleteEvidences = async (id: string) => {
    const data = await getEvidenceById(id);
    if (!data) return { message: "No data found" };

    await del(data.file);
    try {
        await prisma.evidences.delete({
            where: { id },
        });
    } catch (error) {
        return { message: "Failed to delete data" };
    }
    revalidatePath("/evidence");
};

//Update data evidence
export const editEvidence = async (
    id: string,
    desaId: string,
    prevState: any,
    formData: FormData
) => {
    const validatedFields = EvidenceSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error);
        return {
            Error: validatedFields.error.flatten().fieldErrors,
        };
    }

    const images = await getEvidenceById(id);
    if (!images) return { message: "No Data Found" };

    const { file, namaPemilik, bidangLahan } = validatedFields.data;
    let filePath;
    if (!file || file.size <= 0) {
        filePath = images.file;
    } else {
        await del(images.file);
        const { url: fileUrl } = await put(file.name, file, {
            access: "public",
            multipart: true,
        });
        filePath = fileUrl;
    }

    try {
        await prisma.evidences.update({
            data: {
                file: filePath,
                namaPemilik,
                bidangLahan,
            },
            where: { id },
        });
    } catch (error) {
        // console.error("Error when update data", error);
        return { message: "Failed to update data" };
    }

    revalidatePath(`/identifikasi-awal/evidence/${desaId}`);
    redirect(`/identifikasi-awal/evidence/${desaId}`);
};

//Save data evidence
export const uploadEvidence = async (prevState: any, formData: FormData) => {
    console.log("Received formData:", Object.fromEntries(formData.entries()));
    const validatedFields = UploadSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        // console.error("Validation failed:", validatedFields.error);
        return {
            Error: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { file, namaPemilik, bidangLahan } = validatedFields.data;
    const desaId = formData.get("desaId") as string;
    const id = formData.get("id") as string;
    const { url: fileUrl } = await put(file.name, file, {
        access: "public",
        multipart: true,
    });

    try {
        const desaExists = await prisma.identifikasi.findUnique({
            where: { id: desaId },
        });

        if (!desaExists) {
            return {
                message:
                    "Desa dengan ID tersebut tidak ditemukan di Identifikasi",
            };
        }

        await prisma.evidences.create({
            data: {
                file: fileUrl,
                namaPemilik,
                bidangLahan,
                desaId,
            },
        });
    } catch (error) {
        console.error("Error when saving data", error);
        return { message: "Failed to create data" };
    }
    revalidatePath(`/identifikasi-awal/${id}/evidence/${desaId}`);
    redirect(`/identifikasi-awal/${id}/evidence/${desaId}`);
};
