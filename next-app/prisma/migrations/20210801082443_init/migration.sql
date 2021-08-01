/*
  Warnings:

  - Made the column `title` on table `rooms` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `rooms` required. This step will fail if there are existing NULL values in that column.
  - Made the column `max_seat` on table `rooms` required. This step will fail if there are existing NULL values in that column.
  - Made the column `set_count` on table `rooms` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rate` on table `rooms` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "rooms" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "max_seat" SET NOT NULL,
ALTER COLUMN "set_count" SET NOT NULL,
ALTER COLUMN "rate" SET NOT NULL;
