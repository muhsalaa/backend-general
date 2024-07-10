import { t } from "elysia";

export const signupBodySchema = t.Object({
  name: t.String({ maxLength: 60, minLength: 1 }),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
  image: t.Optional(t.String({ format: "url" })),
});

export const loginBodySchema = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
});
