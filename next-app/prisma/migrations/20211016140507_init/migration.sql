/*
  Warnings:

  - You are about to drop the column `invitation_code` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "invitation_code",
ADD COLUMN     "access_token" TEXT;
