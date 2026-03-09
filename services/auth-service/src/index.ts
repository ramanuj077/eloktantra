import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
// @ts-ignore
import { UserRole } from '@eloktantra/types';

dotenv.config();

const fastify = Fastify({ logger: true });
const PORT = parseInt(process.env.PORT || '4001', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

fastify.register(cors);

fastify.get('/health', async (request, reply) => {
  return { status: 'OK', service: 'auth-service' };
});

// Auth Routes
fastify.post('/auth/register', async (request, reply) => {
  const { name, email, password, role, constituency } = request.body as any;
  // TODO: Use Prisma (@eloktantra/database) to create user
  return { success: true, message: 'User registered' };
});

fastify.post('/auth/login', async (request, reply) => {
  const { email, password } = request.body as any;
  // TODO: Verify credentials with Prisma
  
  // Dummy response
  const token = "dummy-jwt-token"; // jwt.sign({ id: '1', email, role: 'CITIZEN' }, JWT_SECRET, { expiresIn: '1d' });
  return { success: true, token };
});

fastify.get('/auth/me', async (request, reply) => {
  // TODO: Verify JWT and return user
  return { success: true, user: { id: '1', email: 'user@example.com', role: 'CITIZEN' } };
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Auth Service running on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
