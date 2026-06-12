/*
  Warnings:

  - A unique constraint covering the columns `[fileName]` on the table `Document` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Document_fileName_key" ON "Document"("fileName");
