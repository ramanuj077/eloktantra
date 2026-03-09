import { FastifyInstance } from 'fastify';
import { CandidateService } from '../services/candidateService';
import { CandidateController } from '../controllers/candidateController';

export default async function candidateRoutes(fastify: FastifyInstance) {
  const candidateService = new CandidateService(fastify);
  const candidateController = new CandidateController(candidateService);

  // Core endpoints
  fastify.get('/', candidateController.getAll);
  fastify.get('/search', candidateController.search);
  fastify.get('/:id', candidateController.getById);
  fastify.get('/constituency/:id', candidateController.getByConstituency);

  // Admin endpoints
  fastify.post('/', candidateController.create);
  fastify.patch('/:id', candidateController.update);
}
