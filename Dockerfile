FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

RUN npm prune --production || true

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/stdout ./stdout

# create a non-root user and ensure stdout dir exists
RUN addgroup -S app && adduser -S -G app app \
	&& mkdir -p /app/stdout \
	&& chown -R app:app /app

USER app

# Default: run the CLI and pass any CMD args to it (e.g. process -)
ENTRYPOINT ["node", "dist/index.js"]
CMD ["process", "-"]
