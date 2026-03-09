import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import supabasePlugin from './plugins/supabase';
import candidateRoutes from './routes/candidates';

dotenv.config();

const fastify = Fastify({ logger: true });
const PORT = parseInt(process.env.PORT || '4002', 10);

fastify.register(cors);

// Register Supabase Plugin
fastify.register(supabasePlugin);

// Health Check
fastify.get('/health', async () => {
  return { status: 'OK', service: 'candidate-service' };
});

// Register routes
fastify.register(candidateRoutes);

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
