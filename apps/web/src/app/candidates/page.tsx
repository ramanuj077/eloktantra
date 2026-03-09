'use client';

import { useCandidates } from '@/lib/api/candidates';
import Link from 'next/link';

export default function CandidatesPage() {
  const { data: candidates, isLoading, isError } = useCandidates();

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading candidates...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Failed to load candidates.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-12 max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Electoral Candidates</h1>
        <p className="text-lg text-gray-600 mt-2">Browse politicians, track their records, and review their assets.</p>
      </header>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates?.map((candidate) => (
          <div key={candidate.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">{candidate.name}</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {candidate.party}
                </span>
              </div>
              
              <div className="space-y-2 mb-6 text-sm text-gray-600">
                <p><strong>Constituency:</strong> {candidate.constituency}</p>
                <p className="flex items-center">
                  <strong className="w-28">Criminal Cases:</strong> 
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${candidate.criminalCases > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {candidate.criminalCases}
                  </span>
                </p>
                <p><strong>Net Assets:</strong> ₹{(candidate.assets - candidate.liabilities).toLocaleString('en-IN')}</p>
              </div>

              <Link 
                href={`/candidates/${candidate.id}`}
                className="w-full block text-center bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
              >
                View Full Profile
              </Link>
            </div>
          </div>
        ))}

        {candidates?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
            No candidates found in the system. Check back later!
          </div>
        )}
      </div>
    </div>
  );
}
