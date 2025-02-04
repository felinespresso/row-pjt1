-- CreateTable
CREATE TABLE "item" (
    "id" SERIAL NOT NULL,
    "namaproyek" TEXT NOT NULL,
    "nomorkontrak" TEXT NOT NULL,
    "kodeproyek" TEXT NOT NULL,
    "tanggalkontrak" TIMESTAMP(3) NOT NULL,
    "tanggalakhirkontrak" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);
