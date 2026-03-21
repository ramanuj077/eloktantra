'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VotePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authToken, setAuthToken] = useState('');
  const [votingToken, setVotingToken] = useState('');
  const [error, setError] = useState('');

  const handleDigiLockerMock = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulating redirect to DigiLocker and back
      // Using the backend we built: GET /auth/digilocker/callback?code=mock_auth_code_123
      const response = await fetch('http://localhost:5001/auth/digilocker/callback?code=mock_auth_code_123');
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        setAuthToken(data.authToken);
        setStep(2);
      } else {
        setError(data.error || 'Identity verification failed');
      }
    } catch (err) {
      setError('Could not connect to authentication server');
    } finally {
      setLoading(false);
    }
  };

  const handleFaceVerify = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5001/auth/face-verify', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ image: 'base64_mock_data' })
      });
      const data = await response.json();

      if (response.ok) {
        setStep(3); // Proceed to Risk Check
      } else {
        setError(data.error || 'Face verification failed');
      }
    } catch (err) {
      setError('Face verification service unavailable');
    } finally {
      setLoading(false);
    }
  };

  const handleRiskAndToken = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Evaluate Risk
      const riskRes = await fetch('http://localhost:5001/risk/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          faceConfidence: 0.92,
          deviceTrusted: true,
          attemptCount: 1
        })
      });
      const riskData = await riskRes.json();

      if (!riskRes.ok || riskData.status === 'BLOCKED') {
        setError('Security check failed: Risk score too high');
        setLoading(false);
        return;
      }

      // 2. Generate Voting Token
      const tokenRes = await fetch('http://localhost:5001/vote/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id })
      });
      const tokenData = await tokenRes.json();

      if (tokenRes.ok) {
        setVotingToken(tokenData.token);
        setStep(4);
      } else {
        setError(tokenData.error || 'Failed to generate voting token');
      }
    } catch (err) {
      setError('Internal security system error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center bg-[#0a0a0a]">
      <div className="max-w-2xl w-full bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 -translate-y-1/2 z-0"></div>
          <div className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500" style={{ width: `${(step - 1) * 33}%` }}></div>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center z-10 text-sm font-bold transition-all ${step >= s ? 'bg-primary text-white scale-110' : 'bg-[#222] text-gray-500'}`}>
              {s}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-center font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Step 1: DigiLocker Auth */}
        {step === 1 && (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold mb-4 text-white">Identity Verification</h1>
            <p className="text-gray-400 mb-8 leading-relaxed">
              To proceed with voting, we need to verify your identity using <span className="text-white font-semibold">DigiLocker</span>. This ensures a "One Person, One Vote" policy.
            </p>
            <button
              onClick={handleDigiLockerMock}
              disabled={loading}
              className="w-full py-4 bg-[#2162da] hover:bg-[#1a4fb0] disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-3 shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-2.18c-1.39-.41-2.5-1.52-2.91-2.91L5.91 11.41C4.7 12.33 4 13.59 4 15c0 2.21 1.79 4 4 4 1.1 0 2.06-.45 2.74-1.16l.26-.34zm.16-6.66l2.18-1.55c-.16-.3-.34-.58-.54-.84l-1.64 2.39zm3.93 1.57l1.55 2.18c.3-.16.58-.34.84-.54l-2.39-1.64z"/></svg>
                  <span>Connect DigiLocker</span>
                </>
              )}
            </button>
            <p className="mt-6 text-xs text-gray-500">Secure connection powered by eLoktantra Auth Bridge</p>
          </div>
        )}

        {/* Step 2: Face Verification */}
        {step === 2 && (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold mb-4 text-white">Face Verification</h1>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Hello, <span className="text-primary font-bold">{user?.name}</span>. Please complete a quick face scan to ensure you are currently present at this device.
            </p>
            
            <div className="w-48 h-48 mx-auto mb-8 rounded-full border-4 border-primary/30 border-dashed animate-pulse flex items-center justify-center bg-primary/5">
               <svg className="w-20 h-20 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>

            <button
              onClick={handleFaceVerify}
              disabled={loading}
              className="w-full py-4 bg-primary hover:bg-accent disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20"
            >
              {loading ? "Verifying..." : "Start Face Scan"}
            </button>
          </div>
        )}

        {/* Step 3: Risk Evaluation */}
        {step === 3 && (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold mb-4 text-white">Security Check</h1>
            <p className="text-gray-400 mb-8 leading-relaxed">
              One final step. Our AI risk engine is evaluating your session parameters for security compliance.
            </p>
            
            <div className="space-y-4 mb-8">
               <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                 <span className="text-sm text-gray-400">Device Trusted</span>
                 <span className="text-green-500 font-bold text-sm">SECURE</span>
               </div>
               <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                 <span className="text-sm text-gray-400">Location Signature</span>
                 <span className="text-green-500 font-bold text-sm">VERIFIED</span>
               </div>
            </div>

            <button
              onClick={handleRiskAndToken}
              disabled={loading}
              className="w-full py-4 bg-white text-black hover:bg-gray-200 disabled:opacity-50 font-bold rounded-xl transition-all"
            >
              {loading ? "Evaluating..." : "Complete Security Check"}
            </button>
          </div>
        )}

        {/* Step 4: Success & Token */}
        {step === 4 && (
          <div className="text-center animate-in zoom-in duration-700">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold mb-4 text-white">Verification Complete</h1>
            <p className="text-gray-400 mb-8">
              Verification successful. You are now authorized to cast your vote.
            </p>
            
            <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl mb-8">
              <span className="text-xs text-primary font-bold uppercase tracking-widest block mb-2">Your One-Time Voting Token</span>
              <div className="text-xl font-mono text-white font-bold tracking-wider break-all">
                {votingToken}
              </div>
              <p className="text-[10px] text-gray-500 mt-4">This token expires in 2 hours and can only be used once.</p>
            </div>

            <button
              onClick={() => {}} // No implementation for actual voting stage yet
              className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl shadow-xl shadow-red-500/20"
            >
              Proceed to eEVM Console
            </button>
            
            <p className="mt-6 text-sm text-gray-500">Voting stage will open in the next phase of the project.</p>
          </div>
        )}

      </div>
    </div>
  );
}
