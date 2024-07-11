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
      include: {
        product: true,
      },
    });
    return cart;
  })
  .put(
    "/cart",
    async (c) => {
      console.log(c.body);

      const { quantity, productId } = c.body;
      const currentCart = await prisma.cart.findFirst({
        where: {
          userId: c.user.id,
          productId,
        },
      });

      if (!currentCart) {
        const cart = await prisma.cart.create({
          data: {
            userId: c.user.id,
            productId,
            quantity: +quantity || 1,
          },
        });

        return cart;
      }

      if (+quantity === 0) {
        await prisma.cart.delete({
          where: {
            productId_userId: {
              userId: c.user.id,
              productId,
            },
          },
        });
        return;
      } else {
        await prisma.cart.update({
          where: {
            productId_userId: {
              userId: c.user.id,
              productId,
            },
          },
          data: {
            quantity: +quantity,
          },
        });
      }

      return { status: "success" };
    },
    {
      body: patchCartBodySchema,
    }
  );
