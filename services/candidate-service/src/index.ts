import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
// @ts-ignore
import { ApiResponse } from '@eloktantra/types';

dotenv.config();

const fastify = Fastify({ logger: true });
const PORT = parseInt(process.env.PORT || '4002', 10);

fastify.register(cors);

// Health Check
fastify.get('/health', async () => {
  return { status: 'OK', service: 'candidate-service' };
});

// Candidate APIs
fastify.get('/candidates', async (request, reply) => {
  // TODO: Fetch candidates via Prisma
  return { success: true, count: 0, candidates: [] };
});

fastify.get('/candidates/:id', async (request, reply) => {
  const { id } = request.params as any;
  // TODO: Fetch single candidate by id
  return { success: true, candidate: { id, name: "Sample Candidate" } };
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Candidate Service running on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
