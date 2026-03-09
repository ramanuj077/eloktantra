'use client';

import { useCandidate } from '@/lib/api/candidates';
import Link from 'next/link';

export default function CandidateProfilePage({ params }: { params: { id: string } }) {
  const { data: candidate, isLoading, isError } = useCandidate(params.id);

  if (isLoading) return <div className="p-8 text-center text-gray-500 min-h-screen grid place-items-center">Loading details...</div>;
  if (isError || !candidate) return <div className="p-8 text-center text-red-500 min-h-screen grid place-items-center">Failed to load candidate profile.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/candidates" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Candidates
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header Region */}
          <div className="bg-gray-900 px-8 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center sm:items-start gap-4">
              <div className="text-center sm:text-left">
                <h1 className="text-4xl font-extrabold text-white tracking-tight">{candidate.name}</h1>
                <p className="mt-2 text-xl text-gray-300 font-medium">
                  {candidate.party} candidate from 
                  <Link href={`/constituency/${candidate.constituency}`} className="ml-1 text-blue-400 hover:underline">
                    {candidate.constituency}
                  </Link>
                </p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-full px-6 py-2 text-white font-bold tracking-wide shadow-sm">
                ID: {candidate.id.slice(0, 8).toUpperCase()}
              </div>
            </div>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-12">
            {/* Background Details */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 border-b pb-2">Background</h2>
              <dl className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide">Education Qualification</dt>
                  <dd className="mt-1 text-lg text-gray-900 font-semibold">{candidate.education || 'Not Disclosed'}</dd>
                </div>
                
                <div className={`p-4 rounded-xl ${candidate.criminalCases > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                  <dt className="text-sm font-medium uppercase tracking-wide opacity-80">Pending Criminal Cases</dt>
                  <dd className={`mt-1 text-3xl font-extrabold ${candidate.criminalCases > 0 ? 'text-red-700' : 'text-green-700'}`}>
                    {candidate.criminalCases}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Financial Details */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 border-b pb-2">Financial Disclosures</h2>
              <dl className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Declared Assets</dt>
                  <dd className="text-2xl text-green-700 font-bold">₹{candidate.assets.toLocaleString('en-IN')}</dd>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Declared Liabilities</dt>
                  <dd className="text-2xl text-red-700 font-bold">₹{candidate.liabilities.toLocaleString('en-IN')}</dd>
                </div>

                <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 mt-6 shadow-inner">
                  <dt className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-1">Estimated Net Worth</dt>
                  <dd className="text-3xl text-gray-900 font-extrabold">₹{(candidate.assets - candidate.liabilities).toLocaleString('en-IN')}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
