import { PrismaClient } from "@prisma/client";

// declare prisma globals
declare global {
  // eslint-disable-next-line no-var
  var prismaa: PrismaClient | undefined;
}

const development = process.env.NODE_ENV !== "production";

// if in development, we serve the 'cached' global prisma, so no multiple instance created
export const prisma =
  global.prismaa ||
  new PrismaClient({
    log: development ? ["query", "error", "warn"] : ["error"],
  });

// set global prisma instance in development
if (development) global.prismaa = prisma;
