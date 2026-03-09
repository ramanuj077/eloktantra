import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
// @ts-ignore
import { ApiResponse } from '@eloktantra/types';

dotenv.config();

const fastify = Fastify({ logger: true });
const PORT = parseInt(process.env.PORT || '4004', 10);

fastify.register(cors);

fastify.get('/health', async () => {
  return { status: 'OK', service: 'issue-service' };
});

fastify.get('/issues', async (request, reply) => {
  // TODO: Fetch issues
  return { success: true, issues: [] };
});

fastify.post('/issues', async (request, reply) => {
  const { location, issue_type, description, reported_by_uuid } = request.body as any;
  // TODO: Create issue
  return { success: true, message: 'Issue reported successfully' };
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Issue Service running on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
