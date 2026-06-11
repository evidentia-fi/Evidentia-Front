# Base stage for shared environment variables
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Builder
FROM base AS builder
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY . .
RUN npx turbo prune --scope=mint --docker


# Installer
FROM base AS installer
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

ARG NODE
ENV NODE=${NODE}
ENV NODE_ENV=production

COPY ./apps/mint/.env.${NODE}.local ./apps/mint/.env.production

RUN pnpm turbo build --filter=mint...

# Runner
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache curl \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/mint/next.config.mjs .
COPY --from=installer /app/apps/mint/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/mint/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/mint/.next/static ./apps/mint/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/mint/public ./apps/mint/public

ENTRYPOINT ["node"]
CMD [ "apps/mint/server.js" ]