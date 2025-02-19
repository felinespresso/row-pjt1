import prisma from "../prisma";

const ITEMS_PER_PAGE = 10;

export const getData = async (page: number, query: string, itemId: number) => {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    try {
        const identifikasiData = await prisma.identifikasi.findMany({
            where: {
                itemId: itemId, // Tambahkan filter berdasarkan proyek (itemId)
                OR: [
                    { namadesa: { contains: query, mode: "insensitive" } },
                    { spantower: { contains: query, mode: "insensitive" } },
                    { tanggal: { contains: query, mode: "insensitive" } },
                    { fotoudara: { contains: query, mode: "insensitive" } },
                ],
            },
            skip: offset,
            take: ITEMS_PER_PAGE,
            include: {
                item: true, // Pastikan `itemId` dikembalikan
                evidence: true,
            },
        });
        identifikasiData.sort((a, b) => {
            const desaA = a.namadesa.toLowerCase();
            const desaB = b.namadesa.toLowerCase();
            if (desaA < desaB) return -1;
            if (desaA > desaB) return 1;
            return a.spantower.localeCompare(b.spantower);
        });
        return identifikasiData;
    } catch (error: any) {
        // console.error("Error fetching data:", error); // Log error detail
        throw new Error(
            `Failed to fetch identification data: ${error.message}`
        );
    }
};

export const getDataPages = async (query: string, itemId: number) => {
    try {
        const identifikasiData = await prisma.identifikasi.count({
            where: {
                itemId: Number(itemId),
                OR: [
                    { namadesa: { contains: query, mode: "insensitive" } },
                    { spantower: { contains: query, mode: "insensitive" } },
                    { tanggal: { contains: query, mode: "insensitive" } },
                    { fotoudara: { contains: query, mode: "insensitive" } },
                ],
            },
        });
        const totalPages = Math.ceil(Number(identifikasiData) / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error: any) {
        // console.error("Error fetching data:", error); // Log error detail
        throw new Error(
            `Failed to fetch identification data: ${error.message}`
        );
    }
};

export const getDesaById = async (id: string) => {
    try {
        const identifikasi = await prisma.identifikasi.findUnique({
            where: { id },
            select: {
                id: true,
                namadesa: true,
                spantower: true,
            },
        });
        return identifikasi;
    } catch (error: any) {
        throw new Error(`Failed to fetch data by ID: ${error.message}`);
    }
};

export const getDataById = async (id: string) => {
    try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const identifikasi = await prisma.identifikasi.findUnique({
            where: { id },
            include: {
                evidence: true,
            },
        });
        return identifikasi;
    } catch (error: any) {
        throw new Error(
            `Failed to fetch identification data: ${error.message}`
        );
    }
};

export const getEvidence = async (desaId: string) => {
    try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const result = await prisma.evidences.findMany({
            where: { desaId },
            select: {
                desaId: true,
                id: true,
                file: true,
                namaPemilik: true,
                bidangLahan: true,
            },
        });
        return result;
    } catch (error) {
        throw new Error("Failed to fetch data");
    }
};

export const getEvidenceById = async (id: string) => {
    try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const result = await prisma.evidences.findUnique({
            where: { id },
            include: {
                desa: true,
            },
        });
        return result;
    } catch (error) {
        throw new Error("Failed to fetch data");
    }
};
