FROM node:22-alpine AS pruner
RUN corepack enable pnpm && npm install -g turbo@^2
WORKDIR /app
COPY . .
RUN turbo prune @repo/backend --docker

FROM node:22-alpine AS installer
RUN corepack enable pnpm
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm run build --filter @repo/backend

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=installer /app/apps/backend/dist ./dist
COPY --from=installer /app/apps/backend/package.json ./package.json
COPY --from=installer /app/node_modules ./node_modules

EXPOSE 3001
ENV PORT=3001

CMD ["node", "dist/index.js"]
