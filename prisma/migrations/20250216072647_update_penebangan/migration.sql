-- AlterTable
ALTER TABLE "Penebangan" ADD COLUMN     "evidenceId" TEXT;

-- CreateIndex
CREATE INDEX "Penebangan_evidenceId_idx" ON "Penebangan"("evidenceId");

-- AddForeignKey
ALTER TABLE "Penebangan" ADD CONSTRAINT "Penebangan_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "Evidences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
