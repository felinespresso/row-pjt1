export async function getData() {
  try {
    const identifikasi = await prisma.identifikasi.findMany({
      include: {
        evidence: true,
      },
      orderBy: [
        {
          id: 'desc' // Gunakan ID untuk pengurutan
        }
      ],
    });

    // Format tanggal dan data lainnya jika diperlukan
    const formattedData = identifikasi.map(item => ({
      ...item,
      tanggal: item.tanggal ? new Date(item.tanggal).toLocaleDateString() : '-',
    }));

    return formattedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data");
  }
} 