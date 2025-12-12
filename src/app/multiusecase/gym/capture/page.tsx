// src/app/multiusecase/gym/capture/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import GymImageCapture from './GymImageCapture';

export default function GymCapturePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const scanId = searchParams.get('scanId') || '';
  const userId =
    searchParams.get('userId') ||
    searchParams.get('token') ||
    scanId;

  const phone = searchParams.get('phone') || '';  
  const flow = searchParams.get('flow') || 'gym';

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleComplete = () => {
    router.push(
      `/multiusecase/gym/result?scanId=${encodeURIComponent(
        scanId
      )}&userId=${encodeURIComponent(userId)}`
    );
  };

  const handleBack = () => {
    router.push(
      `/multiusecase/gym/details?scanId=${encodeURIComponent(
        scanId
      )}&flow=${encodeURIComponent(flow)}`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          {/* loader svg same as before */}
          <p className="text-gray-600">Loading camera...</p>
        </div>
      </div>
    );
  }

  return (
    <GymImageCapture
      scanId={scanId}
      userId={userId}
      phone={phone}        
      onComplete={handleComplete}
      onBack={handleBack}
    />
  );
}
