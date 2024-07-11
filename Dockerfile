FROM oven/bun:1
WORKDIR /app
COPY . .
RUN bun install
RUN bunx prisma generate

ARG PORT
EXPOSE ${PORT:-8800}
 
CMD ["bun", "src/index.ts"]
