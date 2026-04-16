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
RUN npx turbo prune --scope=web --docker

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
#
#ARG NODE
#ENV NODE=${NODE}
#
#COPY ./apps/web/.env.${NODE} ./apps/web/.env.production
#ENV NODE_ENV=production

RUN pnpm turbo build --filter=web...

# Runner
FROM node:18-alpine AS runner
WORKDIR /app

RUN apk add --no-cache curl \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/next.config.mjs .
COPY --from=installer /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

ENTRYPOINT ["node"]
CMD [ "apps/web/server.js" ]