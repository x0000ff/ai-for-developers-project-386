FROM node:22-alpine AS base
RUN npm install -g pnpm

# Stage: dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY packages/api/package.json ./packages/api/
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/backend/package.json ./packages/backend/
RUN pnpm install --frozen-lockfile

# Stage: build frontend
FROM deps AS frontend-builder
COPY tsconfig.base.json ./
COPY packages/api ./packages/api
COPY packages/frontend ./packages/frontend
RUN pnpm --filter @app/api build
RUN pnpm --filter @app/frontend build

# Stage: production
FROM base AS production
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY packages/backend/package.json ./packages/backend/
RUN pnpm install --prod --filter @app/backend

COPY tsconfig.base.json ./
COPY packages/backend ./packages/backend
COPY --from=frontend-builder /app/packages/frontend/dist ./packages/frontend/dist

RUN pnpm --filter @app/backend build

EXPOSE 3000
CMD ["node", "packages/backend/dist/index.js"]
