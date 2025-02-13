-- CreateTable
CREATE TABLE "Musyawarah" (
    "id" TEXT NOT NULL,
    "identifikasiId" TEXT NOT NULL,
    "namaDesa" TEXT NOT NULL,
    "spanTower" TEXT NOT NULL,
    "tanggalPelaksanaan" TIMESTAMP(3) NOT NULL,
    "beritaAcara" TEXT,
    "daftarHadir" TEXT,
    "keterangan" TEXT NOT NULL DEFAULT '-',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Musyawarah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceMusyawarah" (
    "id" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "fileName" TEXT,
    "musyawarahId" TEXT NOT NULL,

    CONSTRAINT "EvidenceMusyawarah_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Musyawarah_identifikasiId_idx" ON "Musyawarah"("identifikasiId");

-- CreateIndex
CREATE INDEX "EvidenceMusyawarah_musyawarahId_idx" ON "EvidenceMusyawarah"("musyawarahId");

-- AddForeignKey
ALTER TABLE "Musyawarah" ADD CONSTRAINT "Musyawarah_identifikasiId_fkey" FOREIGN KEY ("identifikasiId") REFERENCES "Identifikasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceMusyawarah" ADD CONSTRAINT "EvidenceMusyawarah_musyawarahId_fkey" FOREIGN KEY ("musyawarahId") REFERENCES "Musyawarah"("id") ON DELETE CASCADE ON UPDATE CASCADE;
