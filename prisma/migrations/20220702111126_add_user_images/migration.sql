-- CreateTable
CREATE TABLE "UsersMedia" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UsersMedia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UsersMedia" ADD CONSTRAINT "UsersMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
