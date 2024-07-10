import { Elysia } from "elysia";
import { prisma } from "../../lib/prisma";

export const productRoutes = new Elysia().get("/products", async () => {
  const products = await prisma.product.findMany();
  return products;
});
