import { Elysia } from "elysia";
import { prisma } from "../../lib/prisma";
import { loginBodySchema, signupBodySchema } from "./schema";
import {
  ACCESS_TOKEN_EXP,
  JWT_NAME,
  REFRESH_TOKEN_EXP,
} from "../../config/constants";
import { getExpTimestamp } from "../../lib/utils";
import { authPlugin } from "../../lib/plugin";
import jwt from "@elysiajs/jwt";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: JWT_NAME,
      secret: Bun.env.JWT_SECRET!,
    })
  )
  .post(
    "/sign-in",
    async ({ body, jwt, cookie: { accessToken, refreshToken }, set }) => {
      // match user email
      const user = await prisma.user.findUnique({
        where: { email: body.email },
      });

      if (!user) {
        set.status = "Bad Request";
        throw new Error(
          "The email address or password you entered is incorrect"
        );
      }

      // match password
      const matchPassword = await Bun.password.verify(
        body.password,
        user.password as string,
        "bcrypt"
      );
      if (!matchPassword) {
        set.status = "Bad Request";
        throw new Error(
          "The email address or password you entered is incorrect"
        );
      }

      // create access token
      const accessJWTToken = await jwt.sign({
        sub: user.id,
        random: Math.random().toString() + Date.now(),
        exp: getExpTimestamp(ACCESS_TOKEN_EXP),
      });
      accessToken.set({
        value: accessJWTToken,
        httpOnly: true,
        maxAge: ACCESS_TOKEN_EXP,
        path: "/",
      });

      // create refresh token
      // const refreshJWTToken = await jwt.sign({
      //   sub: user.id,
      //   exp: getExpTimestamp(REFRESH_TOKEN_EXP),
      // });
      // refreshToken.set({
      //   value: refreshJWTToken,
      //   httpOnly: true,
      //   maxAge: REFRESH_TOKEN_EXP,
      //   path: "/",
      // });

      // const updatedUser = await prisma.user.update({
      //   where: {
      //     id: user.id,
      //   },
      //   data: {
      //     refreshToken: refreshJWTToken,
      //   },
      // });

      return {
        message: "Sig-in successfully",
        data: {
          user: {
            name: user.name,
            email: user.email,
            image: user.image,
          },
          accessToken: accessJWTToken,
          // refreshToken: refreshJWTToken,
        },
      };
    },
    {
      body: loginBodySchema,
    }
  )
  .post(
    "/sign-up",
    async ({ body }) => {
      console.log(body);

      // hash password
      const password = await Bun.password.hash(body.password, {
        algorithm: "bcrypt",
        cost: 10,
      });

      const user = await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          image: body.image,
          password,
        },
      });

      return {
        message: "Sign-up successfully",
      };
    },
    {
      body: signupBodySchema,
      error({ code, set, body }) {
        // handle duplicate email error throw by prisma
        // P2002 duplicate field error code
        if ((code as string) === "P2002") {
          set.status = "Conflict";
          return {
            name: "Error",
            message: `The email address provided ${body.email} already exists`,
          };
        }
      },
    }
  )
  .use(authPlugin)
  .post("/refresh", async (c) => {
    return {
      message: "Access token generated successfully",
    };
  })
  .post("/logout", async (c) => {
    return {
      message: "Logout successfully",
    };
  })
  .get("/me", (c) => {
    return {
      message: "Fetch current user",
    };
  });
