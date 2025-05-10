import { PrismaClient } from "../../generated/prisma/index.js";
import { IS_DEVOLVEMENT } from "../app/constants/env.constant.ts";
import { Env } from "../env.ts";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const Db = globalThis.prisma ?? new PrismaClient();

if (Env.NODE_ENV === IS_DEVOLVEMENT) {
  globalThis.prisma = Db;
}

export { Db as db };
