# Builder
FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
RUN yarn global add turbo

COPY . .
RUN turbo prune --scope=mint --docker


# Installer
FROM node:18-alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk add --no-cache python3 make g++
RUN apk update

WORKDIR /app
RUN yarn global add pnpm
RUN yarn global add turbo

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

ARG NODE
ENV NODE=${NODE}

COPY ./apps/mint/.env.${NODE}.local ./apps/mint/.env.production
ENV NODE_ENV=production

RUN turbo build --filter=mint...

# Runner
FROM node:18-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/mint/next.config.mjs .
COPY --from=installer /app/apps/mint/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/mint/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/mint/.next/static ./apps/mint/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/mint/public ./apps/mint/public

CMD node apps/mint/server.js