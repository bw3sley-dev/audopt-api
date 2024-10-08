-- CreateTable
CREATE TABLE "pets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "energy_level" TEXT NOT NULL,
    "independence_level" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "org_id" TEXT NOT NULL,
    CONSTRAINT "pets_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
