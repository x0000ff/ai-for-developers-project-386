import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import type { Db } from './db/index.js';
import { eventTypesRoutes } from './routes/eventTypes.js';

export function buildApp(opts: FastifyServerOptions & { db: Db }): FastifyInstance {
  const { db, ...fastifyOpts } = opts;
  const app = Fastify({ logger: false, ...fastifyOpts });

  app.get('/health', async () => ({ status: 'ok' }));

  app.register(eventTypesRoutes, { prefix: '/api', db });

  return app;
}
