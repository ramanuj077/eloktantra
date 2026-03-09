import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_GATEWAY = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface Candidate {
  id: string;
  name: string;
  party: string;
  constituency: string;
  education: string | null;
  criminalCases: number;
  assets: number;
  liabilities: number;
}

export const fetchCandidates = async (): Promise<Candidate[]> => {
  const { data } = await axios.get(`${API_GATEWAY}/candidates`);
  return data.candidates || [];
};

export const fetchCandidateById = async (id: string): Promise<Candidate> => {
  const { data } = await axios.get(`${API_GATEWAY}/candidates/${id}`);
  return data.candidate;
};

export const fetchCandidatesByConstituency = async (constituencyId: string): Promise<Candidate[]> => {
  const { data } = await axios.get(`${API_GATEWAY}/candidates/constituency/${constituencyId}`);
  return data.candidates || [];
};

export const useCandidates = () => {
  return useQuery({
    queryKey: ['candidates'],
    queryFn: fetchCandidates,
  });
};

export const useCandidate = (id: string) => {
  return useQuery({
    queryKey: ['candidate', id],
    queryFn: () => fetchCandidateById(id),
    enabled: !!id,
  });
};

export const useConstituencyCandidates = (constituencyId: string) => {
  return useQuery({
    queryKey: ['constituencyCandidates', constituencyId],
    queryFn: () => fetchCandidatesByConstituency(constituencyId),
    enabled: !!constituencyId,
  });
};
