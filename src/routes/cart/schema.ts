import { t } from "elysia";

export const addToCartBodySchema = t.Object({
  productId: t.String(),
  quantity: t.Number(),
});

export const patchCartBodySchema = t.Object({
  productId: t.String(),
  quantity: t.Number(),
});
