/*
  Warnings:

  - You are about to drop the `user_records` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "contestant" DROP CONSTRAINT "contestant_contestantId_fkey";

-- DropForeignKey
ALTER TABLE "geki_score" DROP CONSTRAINT "geki_score_judgeId_fkey";

-- DropForeignKey
ALTER TABLE "user_records" DROP CONSTRAINT "user_records_userId_fkey";

-- DropTable
DROP TABLE "user_records";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "elo" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_record" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "elo" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_record_userId_key" ON "user_record"("userId");

-- AddForeignKey
ALTER TABLE "user_record" ADD CONSTRAINT "user_record_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contestant" ADD CONSTRAINT "contestant_contestantId_fkey" FOREIGN KEY ("contestantId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geki_score" ADD CONSTRAINT "geki_score_judgeId_fkey" FOREIGN KEY ("judgeId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
