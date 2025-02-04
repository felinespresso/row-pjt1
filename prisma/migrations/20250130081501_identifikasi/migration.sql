-- CreateTable
CREATE TABLE "Identifikasi" (
    "id" TEXT NOT NULL,
    "namadesa" TEXT NOT NULL,
    "spantower" TEXT NOT NULL,
    "tanggal" TEXT,
    "fotoudara" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Identifikasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidences" (
    "id" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "namaPemilik" TEXT NOT NULL,
    "desaId" TEXT NOT NULL,

    CONSTRAINT "Evidences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Evidences" ADD CONSTRAINT "Evidences_desaId_fkey" FOREIGN KEY ("desaId") REFERENCES "Identifikasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
