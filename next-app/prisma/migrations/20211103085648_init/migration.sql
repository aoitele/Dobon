/*
  Warnings:

  - A unique constraint covering the columns `[room_id,user_id]` on the table `participants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "participants.room_id_user_id_unique" ON "participants"("room_id", "user_id");
