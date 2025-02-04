-- AlterTable
ALTER TABLE "inventarisasi" ALTER COLUMN "span" SET DEFAULT '-',
ALTER COLUMN "bidanglahan" SET DEFAULT '-',
ALTER COLUMN "namapemilik" SET DEFAULT '-',
ALTER COLUMN "nik" SET DEFAULT '-',
ALTER COLUMN "ttl" SET DEFAULT '-',
ALTER COLUMN "desakelurahan" SET DEFAULT '-',
ALTER COLUMN "kecamatan" SET DEFAULT '-',
ALTER COLUMN "kabupatenkota" SET DEFAULT '-',
ALTER COLUMN "alashak" SET DEFAULT '-',
ALTER COLUMN "luastanah" SET DEFAULT '-',
ALTER COLUMN "pelaksanaan" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "jenisbangunan" ALTER COLUMN "namabangunan" SET DEFAULT '-',
ALTER COLUMN "luasbangunan" SET DEFAULT '-';

-- AlterTable
ALTER TABLE "jenistanaman" ALTER COLUMN "namatanaman" SET DEFAULT '-',
ALTER COLUMN "produktif" SET DEFAULT '-',
ALTER COLUMN "besar" SET DEFAULT '-',
ALTER COLUMN "kecil" SET DEFAULT '-',
ALTER COLUMN "bibit" SET DEFAULT '-';
