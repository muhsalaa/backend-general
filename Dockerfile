FROM oven/bun:1.1.20

WORKDIR /usr/src/app

COPY package.json bun.lockb .

RUN bun install

COPY . .

RUN bun prisma generate

ARG PORT

EXPOSE ${PORT:-8800}
 
CMD ["bun", "start"]
