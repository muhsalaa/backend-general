import Elysia from "elysia";
import { prisma } from "../../lib/prisma";
import { authPlugin } from "../../lib/plugin";
import { addToCartBodySchema, patchCartBodySchema } from "./schema";

export const cartRoutes = new Elysia()
  .use(authPlugin)
  .get("/cart", async (c) => {
    const cart = await prisma.cart.findMany({
      where: {
        userId: c.user.id,
      },
    });
    return cart;
  })
  .post(
    "/cart",
    async (c) => {
      const { productId, quantity } = c.body;
      console.log({
        userId: c.user.id,
        productId,
        quantity: quantity || 1,
      });

      const cart = await prisma.cart.create({
        data: {
          userId: c.user.id,
          productId,
          quantity: quantity || 1,
        },
      });
      return cart;
    },
    {
      body: addToCartBodySchema,
    }
  )
  .put(
    "/cart",
    async (c) => {
      const { quantity, productId } = c.body;
      const currentCart = await prisma.cart.findFirst({
        where: {
          userId: c.user.id,
          productId,
        },
      });

      if (!currentCart) {
        c.set.status = "Bad Request";
        throw new Error("Cart item not exist");
      }

      const cart = await prisma.cart.update({
        where: {
          productId_userId: {
            userId: c.user.id,
            productId,
          },
        },
        data: {
          quantity: currentCart.quantity + quantity,
        },
      });
      return cart;
    },
    {
      body: patchCartBodySchema,
    }
  );
