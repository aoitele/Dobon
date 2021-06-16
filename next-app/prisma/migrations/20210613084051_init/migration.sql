-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT,
    "status" INTEGER,
    "invitation_code" TEXT,
    "expired_date" TIMESTAMP(6),
    "last_login" TIMESTAMP(6),
    "created" TIMESTAMP(6),
    "modified" TIMESTAMP(6),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "status" INTEGER,
    "max_seat" INTEGER,
    "rate" INTEGER,
    "created" TIMESTAMP(6),
    "modified" TIMESTAMP(6),

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

    PRIMARY KEY ("id")
);
