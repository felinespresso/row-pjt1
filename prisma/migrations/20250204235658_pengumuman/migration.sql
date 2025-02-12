-- DropForeignKey
ALTER TABLE "Sosialisasi" DROP CONSTRAINT "Sosialisasi_identifikasiId_fkey";

-- AlterTable
ALTER TABLE "EvidenceSosialisasi" ADD COLUMN     "fileName" TEXT;

-- CreateTable
CREATE TABLE "Pengumuman" (
    "id" TEXT NOT NULL,
    "identifikasiId" TEXT NOT NULL,
    "namaDesa" TEXT NOT NULL,
    "spanTower" TEXT NOT NULL,
    "tanggalPelaksanaan" TIMESTAMP(3) NOT NULL,
    "beritaAcara" BYTEA,
    "keterangan" TEXT NOT NULL DEFAULT '-',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pengumuman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidencePengumuman" (
    "id" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "fileName" TEXT,
    "pengumumanId" TEXT NOT NULL,

    CONSTRAINT "EvidencePengumuman_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Pengumuman_identifikasiId_idx" ON "Pengumuman"("identifikasiId");

-- CreateIndex
CREATE INDEX "EvidencePengumuman_pengumumanId_idx" ON "EvidencePengumuman"("pengumumanId");

-- CreateIndex
CREATE INDEX "EvidenceSosialisasi_sosialisasiId_idx" ON "EvidenceSosialisasi"("sosialisasiId");

-- CreateIndex
CREATE INDEX "Sosialisasi_identifikasiId_idx" ON "Sosialisasi"("identifikasiId");

-- AddForeignKey
ALTER TABLE "Sosialisasi" ADD CONSTRAINT "Sosialisasi_identifikasiId_fkey" FOREIGN KEY ("identifikasiId") REFERENCES "Identifikasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengumuman" ADD CONSTRAINT "Pengumuman_identifikasiId_fkey" FOREIGN KEY ("identifikasiId") REFERENCES "Identifikasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidencePengumuman" ADD CONSTRAINT "EvidencePengumuman_pengumumanId_fkey" FOREIGN KEY ("pengumumanId") REFERENCES "Pengumuman"("id") ON DELETE CASCADE ON UPDATE CASCADE;
