-- CreateTable
CREATE TABLE "inventarisasi" (
    "id" SERIAL NOT NULL,
    "span" TEXT NOT NULL,
    "bidanglahan" TEXT NOT NULL,
    "formulir" BYTEA,
    "namapemilik" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "ttl" TEXT NOT NULL,
    "desakelurahan" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "kabupatenkota" TEXT NOT NULL,
    "alashak" TEXT NOT NULL,
    "luastanah" TEXT NOT NULL,

    CONSTRAINT "inventarisasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jenisbangunan" (
    "id" SERIAL NOT NULL,
    "namabangunan" TEXT NOT NULL,
    "luasbangunan" TEXT NOT NULL,

    CONSTRAINT "jenisbangunan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jenistanaman" (
    "id" SERIAL NOT NULL,
    "namatanaman" TEXT NOT NULL,
    "produktif" TEXT NOT NULL,
    "besar" TEXT NOT NULL,
    "kecil" TEXT NOT NULL,
    "bibit" TEXT NOT NULL,

    CONSTRAINT "jenistanaman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventbangunan" (
    "inventId" INTEGER NOT NULL,
    "bangunanId" INTEGER NOT NULL,

    CONSTRAINT "inventbangunan_pkey" PRIMARY KEY ("inventId","bangunanId")
);

-- CreateTable
CREATE TABLE "inventtanaman" (
    "inventId" INTEGER NOT NULL,
    "tanamanId" INTEGER NOT NULL,

    CONSTRAINT "inventtanaman_pkey" PRIMARY KEY ("inventId","tanamanId")
);

-- AddForeignKey
ALTER TABLE "inventbangunan" ADD CONSTRAINT "inventbangunan_inventId_fkey" FOREIGN KEY ("inventId") REFERENCES "inventarisasi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventbangunan" ADD CONSTRAINT "inventbangunan_bangunanId_fkey" FOREIGN KEY ("bangunanId") REFERENCES "jenisbangunan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventtanaman" ADD CONSTRAINT "inventtanaman_inventId_fkey" FOREIGN KEY ("inventId") REFERENCES "inventarisasi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventtanaman" ADD CONSTRAINT "inventtanaman_tanamanId_fkey" FOREIGN KEY ("tanamanId") REFERENCES "jenistanaman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
