import { Elysia } from "elysia";
import { authRoutes } from "./routes/auth";
import { productRoutes } from "./routes/product";
import { cartRoutes } from "./routes/cart";
import cors from "@elysiajs/cors";

const app = new Elysia({ prefix: "/api" })
  .use(
    cors({
      origin: true,
      allowedHeaders: "*",
    })
  )
  .use(productRoutes)
  .use(authRoutes)
  .use(cartRoutes)
  .listen(8800);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
