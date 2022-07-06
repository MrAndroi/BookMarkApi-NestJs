-- CreateTable
CREATE TABLE "RoleHistory" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applier" TEXT NOT NULL,
    "appliedOn" TEXT NOT NULL,
    "action" TEXT NOT NULL,

    CONSTRAINT "RoleHistory_pkey" PRIMARY KEY ("id")
);
