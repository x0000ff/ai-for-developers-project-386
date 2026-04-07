FROM node:22-alpine AS base
RUN npm install -g pnpm

# Stage: install all dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/api/package.json ./packages/api/
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/backend/package.json ./packages/backend/
RUN pnpm install --frozen-lockfile

# Stage: build api types + frontend
FROM deps AS frontend-builder
COPY tsconfig.base.json ./
COPY packages/api ./packages/api
COPY packages/frontend ./packages/frontend
RUN pnpm --filter @app/api build
RUN pnpm --filter @app/frontend build

# Stage: build backend
FROM deps AS backend-builder
COPY tsconfig.base.json ./
COPY packages/backend ./packages/backend
RUN pnpm --filter @app/backend build

# Stage: production
FROM base AS production
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/backend/package.json ./packages/backend/
RUN pnpm install --frozen-lockfile --prod --filter @app/backend

COPY --from=backend-builder /app/packages/backend/dist ./packages/backend/dist
COPY packages/backend/drizzle ./packages/backend/drizzle
COPY --from=frontend-builder /app/packages/frontend/dist ./packages/frontend/dist

EXPOSE 3000
CMD ["node", "packages/backend/dist/index.js"]
