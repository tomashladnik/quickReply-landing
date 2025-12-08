'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import GymImageCapture from './GymImageCapture';

export default function GymCapturePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || 'demo-token';

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate token validation
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleComplete = () => {
    // Navigate to result page after successful capture
    router.push(`/multiusecase/gym/result?token=${token}`);
  };

  const handleBack = () => {
    router.push(`/multiusecase/gym?token=${token}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-[#4ebff7] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading camera...</p>
        </div>
      </div>
    );
  }

  return (
    <GymImageCapture
      token={token}
      onComplete={handleComplete}
      onBack={handleBack}
    />
  );
}