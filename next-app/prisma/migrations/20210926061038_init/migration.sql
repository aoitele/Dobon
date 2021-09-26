-- AddForeignKey
ALTER TABLE "rooms" ADD FOREIGN KEY ("create_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
