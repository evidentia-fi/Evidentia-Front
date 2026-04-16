# Base stage for shared environment variables
FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Builder
FROM base AS builder
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY . .
RUN npx turbo prune --scope=app --docker

# Installer
FROM base AS installer
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN pnpm install --frozen-lockfile
RUN pnpm add date-fns-tz -w

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

ARG NODE
ENV NODE=${NODE}
ENV NODE_ENV=production

COPY ./apps/app/.env.${NODE}.local ./apps/app/.env.production

RUN pnpm turbo build --filter=app...

# Runner
FROM node:18-alpine AS runner
WORKDIR /app

RUN apk add --no-cache curl \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

USER nextjs

COPY --from=installer /app/apps/app/next.config.mjs .
COPY --from=installer /app/apps/app/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/app/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/app/.next/static ./apps/app/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/app/public ./apps/app/public

ENTRYPOINT ["node"]
CMD [ "apps/app/server.js" ]