FROM oven/bun:1
WORKDIR /app
COPY . .
RUN bun install

ARG PORT
EXPOSE ${PORT:-8800}
 
CMD ["bun", "src/index.ts"]
