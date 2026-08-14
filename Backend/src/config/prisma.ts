import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if(!connectionString){
    throw new Error("Db not defined or connection string is empty")
}

const adapter = new PrismaPg(
    {
        connectionString
    }
)


const prisma = new PrismaClient({adapter});

export default prisma;