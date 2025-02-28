-- DropForeignKey
ALTER TABLE "inventbangunan" DROP CONSTRAINT "inventbangunan_bangunanId_fkey";

-- DropForeignKey
ALTER TABLE "inventbangunan" DROP CONSTRAINT "inventbangunan_inventId_fkey";

-- DropForeignKey
ALTER TABLE "inventtanaman" DROP CONSTRAINT "inventtanaman_inventId_fkey";

-- DropForeignKey
ALTER TABLE "inventtanaman" DROP CONSTRAINT "inventtanaman_tanamanId_fkey";

-- AddForeignKey
ALTER TABLE "inventbangunan" ADD CONSTRAINT "inventbangunan_inventId_fkey" FOREIGN KEY ("inventId") REFERENCES "inventarisasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventbangunan" ADD CONSTRAINT "inventbangunan_bangunanId_fkey" FOREIGN KEY ("bangunanId") REFERENCES "jenisbangunan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventtanaman" ADD CONSTRAINT "inventtanaman_inventId_fkey" FOREIGN KEY ("inventId") REFERENCES "inventarisasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventtanaman" ADD CONSTRAINT "inventtanaman_tanamanId_fkey" FOREIGN KEY ("tanamanId") REFERENCES "jenistanaman"("id") ON DELETE CASCADE ON UPDATE CASCADE;
