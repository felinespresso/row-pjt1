/*
  Warnings:

  - Added the required column `itemId` to the `Identifikasi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Musyawarah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Pembayaran` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Pemberkasan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Penebangan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Pengumuman` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Sosialisasi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `inventarisasi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Identifikasi" ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Musyawarah" ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Pembayaran" ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Pemberkasan" ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Penebangan" ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Pengumuman" ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Sosialisasi" ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "inventarisasi" ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "inventarisasi" ADD CONSTRAINT "inventarisasi_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Identifikasi" ADD CONSTRAINT "Identifikasi_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sosialisasi" ADD CONSTRAINT "Sosialisasi_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengumuman" ADD CONSTRAINT "Pengumuman_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Musyawarah" ADD CONSTRAINT "Musyawarah_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pembayaran" ADD CONSTRAINT "Pembayaran_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pemberkasan" ADD CONSTRAINT "Pemberkasan_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penebangan" ADD CONSTRAINT "Penebangan_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
