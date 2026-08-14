## Prisma + pgvector Migration

Problem:
Prisma migration failed on the shadow database with:
ERROR: type "vector" does not exist

Cause:
The migration created a table using vector(768), but the pgvector extension wasn't installed in the shadow database.

Fix:
Add the following at the top of the migration:

CREATE EXTENSION IF NOT EXISTS vector;

If the migration was already applied, Prisma detects the modified checksum.
For development, run:

npx prisma migrate reset

Never edit applied migrations in production. Create a new migration instead.