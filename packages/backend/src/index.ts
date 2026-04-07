import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildApp } from './app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = buildApp({ logger: true });

// Serve frontend build
app.register(fastifyStatic, {
  root: path.join(__dirname, '../../frontend/dist'),
  prefix: '/',
});

const start = async () => {
  try {
    await app.listen({ port: Number(process.env.PORT) || 3000, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
