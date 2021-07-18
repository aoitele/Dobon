-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT,
    "status" INTEGER,
    "invitation_code" TEXT,
    "expired_date" TIMESTAMP(6),
    "last_login" TIMESTAMP(6),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "status" INTEGER,
    "max_seat" INTEGER,
    "set_count" INTEGER,
    "rate" INTEGER,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gamelogs" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER,
    "user_id" INTEGER,
    "action_type" INTEGER,
    "card" TEXT,
    "affect_user" INTEGER,
    "score" INTEGER,
    "endgame" BOOLEAN,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    PRIMARY KEY ("id")
);
