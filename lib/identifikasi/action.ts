"use server";

import { z } from "zod";
import { put } from "@vercel/blob";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const IdentifikasiSchema = z.object({
  namadesa: z.string().min(1),
  spantower: z.string().min(6),
  tanggal: z.string().min(1, { message: "Tanggal Pelaksanaan must be filled" }),
  evidences: z
    .array(
      z.object({
        file: z
          .instanceof(File)
          .refine((file) => file.size > 0, { message: "File is required" })
          .refine((file) => file.size === 0 || file.type.startsWith("image/"), {
            message: "Only images are allowed",
          })
          .refine((file) => file.size < 8000000, {
            message: "File must less than 8MB",
          }),

        namaPemilik: z.string().min(1),
      })
    )
    .refine((evidences) => evidences.length > 0, {
      message: "Evidence & Nama Pemilik is required",
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

//Save data identifikasi
export const saveIdentifikasi = async (prevState: any, formData: FormData) => {
  const evidences = [];

  // Masukkan evidence utama
  const mainFile = formData.get("file") as File;
  const mainNamaPemilik = formData.get("namaPemilik") as string;
  if (mainFile && mainNamaPemilik) {
    evidences.push({ file: mainFile, namaPemilik: mainNamaPemilik });
  }

  // Iterasi evidence tambahan dari FormData
  formData.forEach((value, key) => {
    if (key.startsWith("file-")) {
      const index = parseInt(key.split("-")[1], 10);
      const namaPemilik = formData.get(`namaPemilik-${index}`);
      if (value instanceof File && namaPemilik) {
        evidences.push({ file: value, namaPemilik });
      }
    }
  });

  // Hilangkan duplikasi evidences
  const uniqueEvidences = Array.from(
    new Map(
      evidences.map((evidence) => [
        `${evidence.file.name}-${evidence.namaPemilik}`,
        evidence,
      ])
    ).values()
  );

  const validatedFields = IdentifikasiSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    evidences: uniqueEvidences,
  });

  // console.log("Evidences Data:", validatedFields.data.evidences);
  // console.log(validatedFields);
  // console.log(data);
  // console.log("File (Evidence):", formData.get("file"));
  // console.log("File (Foto Udara):", formData.get("fotoudara"));

  // console.log("FormData Entries:", Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    console.error("Validation failed:", validatedFields.error);
    return {
      Error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { evidences: evidenceList, fotoudara } = validatedFields.data;

  const evidenceUrls = await Promise.all(
    evidenceList.map(async (evidence) => {
      const { url: fileUrl } = await put(evidence.file.name, evidence.file, {
        access: "public",
        multipart: true,
      });
      return { file: fileUrl, namaPemilik: evidence.namaPemilik };
    })
  );
  const { url: fotoUdaraUrl } = await put(fotoudara.name, fotoudara, {
    access: "public",
    multipart: true,
  });

  try {
    const identifikasi = await prisma.identifikasi.create({
      data: {
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
  } catch (error) {
    console.error("Error when saving data", error);
    return { message: "Failed to create data" };
  }

  revalidatePath("/identifikasi-awal");
  redirect("/identifikasi-awal");
};

//Delete data identifikasi
export const deleteIdentifikasi = async (id: string) => {
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
