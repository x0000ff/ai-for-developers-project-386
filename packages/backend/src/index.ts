import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = Fastify({ logger: true });

// Serve frontend build
app.register(fastifyStatic, {
  root: path.join(__dirname, '../../frontend/dist'),
  prefix: '/',
});

// API routes will be added here

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
