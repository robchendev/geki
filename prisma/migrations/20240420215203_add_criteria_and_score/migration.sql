-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "GekiStatus" AS ENUM ('SUBMITTED', 'JUDGING', 'COMPLETE', 'CANCELED');

-- CreateTable
CREATE TABLE "geki" (
    "id" TEXT NOT NULL,
    "song" TEXT NOT NULL,
    "criteria" JSONB NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "GekiStatus" NOT NULL,

    CONSTRAINT "geki_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "elo" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contestant" (
    "id" TEXT NOT NULL,
    "contestantId" TEXT NOT NULL,
    "gekiId" TEXT NOT NULL,

    CONSTRAINT "contestant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geki_score" (
    "id" TEXT NOT NULL,
    "score" JSONB NOT NULL,
    "judgeId" TEXT NOT NULL,

    CONSTRAINT "geki_score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "contestant" ADD CONSTRAINT "contestant_contestantId_fkey" FOREIGN KEY ("contestantId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contestant" ADD CONSTRAINT "contestant_gekiId_fkey" FOREIGN KEY ("gekiId") REFERENCES "geki"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geki_score" ADD CONSTRAINT "geki_score_judgeId_fkey" FOREIGN KEY ("judgeId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
