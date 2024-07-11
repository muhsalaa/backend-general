FROM oven/bun:1
WORKDIR /app
RUN bun install
RUN bunx prisma generate
COPY . .

ARG PORT
EXPOSE ${PORT:-8800}
 
CMD ["bun", "src/index.ts"]
