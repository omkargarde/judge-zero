import { PrismaClient } from "../../generated/prisma/index.js";

const Db = new PrismaClient();

export { Db as db };
