FROM oven/bun:latest

WORKDIR /usr/src/app

COPY . .

RUN bun install
RUN bun prisma generate

ARG PORT
EXPOSE ${PORT:-8800}
 
CMD ["bun", "src/index.ts"]
