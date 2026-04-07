import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';

export function buildApp(opts: FastifyServerOptions = {}): FastifyInstance {
  const app = Fastify({ logger: false, ...opts });

  app.get('/health', async () => ({ status: 'ok' }));

  return app;
}
