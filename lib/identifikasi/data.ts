import prisma from "../prisma";
 
export const getData = async () => { 
    try { 
        const identifikasiData = await prisma.identifikasi.findMany({ 
            include: { 
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
    } catch (error:any) { 
        // console.error("Error fetching data:", error); // Log error detail 
        throw new Error(`Failed to fetch identification data: ${error.message}`); 
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
    } catch (error:any) { 
        throw new Error(`Failed to fetch data by ID: ${error.message}`); 
    } 
};

export const getEvidence = async (desaId: string) => { 
    try { 
        const result = await prisma.evidences.findMany({ 
            where: { desaId }, 
            select: { 
                desaId: true, 
                id: true, 
                file: true, 
                namaPemilik: true, 
            }, 
        }); 
        return result; 
    } catch (error) { 
        throw new Error("Failed to fetch data"); 
    } 
}