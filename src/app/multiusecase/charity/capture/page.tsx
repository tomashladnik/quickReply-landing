'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DentalImages from '@/components/dental/DentalImages';

export default function CharityCapturePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const userId = searchParams.get('userId');

  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState('Loading...');

  useEffect(() => {
    // Log the current URL and parameters
    console.log('Current URL:', window.location.href);
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    console.log('Extracted parameters:', { token, userId });
    
    // Check if required parameters are present
    if (!token || !userId) {
      console.error('Missing required parameters:', { token, userId });
      router.push('/multiusecase/register?type=charity');
      return;
    }
    
    console.log('All parameters present, proceeding with capture page');
    
    // Fetch user info
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`/api/multiuse/user-info?userId=${userId}`);
        const result = await response.json();
        
        if (result.ok && result.user) {
          setPatientName(result.user.name);
        } else {
          setPatientName('User');
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        setPatientName('User');
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, [token, userId, router, searchParams]);

  const handleComplete = () => {
    // Navigate to result page after successful capture
    router.push(`/multiusecase/charity/result?token=${token}&userId=${userId}`);
  };

  const handleBack = () => {
    router.push(`/multiusecase/register?type=charity&token=${token}`);
  };

  // Show loading or redirect if parameters are missing
  if (!token || !userId || loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-[#4ebff7] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">
            {!token || !userId ? 'Redirecting to registration...' : 'Loading camera...'}
          </p>
        </div>
      </div>
    );
  }

  // Create state object that DentalImages expects
  const state = {
    scanLinkToken: userId, // Use userId as scanLinkToken for multiuse cases
    patientName: patientName
  };

  // Mock setState function since we don't need state management for multiuse
  const setState = () => {};

  return (
    <DentalImages
      state={state}
      setState={setState}
      onNext={handleComplete}
      onBack={handleBack}
    />
  );
}