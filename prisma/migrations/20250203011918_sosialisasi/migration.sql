-- CreateTable
CREATE TABLE "Sosialisasi" (
    "id" TEXT NOT NULL,
    "identifikasiId" TEXT NOT NULL,
    "tanggalPelaksanaan" TIMESTAMP(3) NOT NULL,
    "beritaAcara" BYTEA,
    "daftarHadir" BYTEA,
    "keterangan" TEXT NOT NULL DEFAULT '-',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sosialisasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceSosialisasi" (
    "id" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "sosialisasiId" TEXT NOT NULL,

    CONSTRAINT "EvidenceSosialisasi_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sosialisasi" ADD CONSTRAINT "Sosialisasi_identifikasiId_fkey" FOREIGN KEY ("identifikasiId") REFERENCES "Identifikasi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceSosialisasi" ADD CONSTRAINT "EvidenceSosialisasi_sosialisasiId_fkey" FOREIGN KEY ("sosialisasiId") REFERENCES "Sosialisasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
