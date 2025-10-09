# Builder
FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
RUN yarn global add turbo

COPY . .
RUN turbo prune --scope=app --docker


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

COPY ./apps/app/.env.${NODE}.local ./apps/app/.env.production
ENV NODE_ENV=production

RUN turbo build --filter=app...

# Runner
FROM node:18-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/app/next.config.mjs .
COPY --from=installer /app/apps/app/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/app/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/app/.next/static ./apps/app/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/app/public ./apps/app/public

CMD node apps/app/server.js