/*
  Warnings:

  - Added the required column `invitation_code` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "invitation_code" TEXT NOT NULL;
