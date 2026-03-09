import { FastifyReply, FastifyRequest } from 'fastify';
import { CandidateService } from '../services/candidateService';

export class CandidateController {
  constructor(private candidateService: CandidateService) {}

  getAll = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const candidates = await this.candidateService.getAllCandidates();
      return reply.send({ success: true, count: candidates.length, candidates });
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  };

  getById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const candidate = await this.candidateService.getCandidateById(request.params.id);
      return reply.send({ success: true, candidate });
    } catch (error: any) {
      return reply.code(404).send({ success: false, error: 'Candidate not found' });
    }
  };

  getByConstituency = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const candidates = await this.candidateService.getCandidatesByConstituency(request.params.id);
      return reply.send({ success: true, count: candidates.length, candidates });
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  };

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // TODO: Add auth middleware for Admin role check
      const candidate = await this.candidateService.createCandidate(request.body);
      return reply.code(201).send({ success: true, candidate });
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  };

  update = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      // TODO: Add auth middleware for Admin role check
      const candidate = await this.candidateService.updateCandidate(request.params.id, request.body);
      return reply.send({ success: true, candidate });
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  };

  search = async (request: FastifyRequest<{ Querystring: { q: string } }>, reply: FastifyReply) => {
    try {
      const { q } = request.query;
      if (!q) {
        return reply.code(400).send({ success: false, error: 'Search query "q" is required' });
      }
      const candidates = await this.candidateService.searchCandidates(q);
      return reply.send({ success: true, count: candidates.length, candidates });
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  };
}
