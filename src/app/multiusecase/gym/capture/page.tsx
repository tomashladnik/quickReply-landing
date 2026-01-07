'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DentalCaptureCore, { type CaptureSlot } from '@/components/shared/DentalCaptureCore';

export default function GymCapturePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <GymCaptureContent />
    </Suspense>
  );
}

function GymCaptureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const userId = searchParams.get('userId');

  const [loading, setLoading] = useState(true);
  const [userPhone, setUserPhone] = useState<string | null>(null);

  useEffect(() => {
    // Log the current URL and parameters
    console.log('Current URL:', window.location.href);
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    console.log('Extracted parameters:', { token, userId });
    
    // Check if required parameters are present
    if (!token || !userId) {
      console.error('Missing required parameters:', { token, userId });
      router.push('/multiusecase/register?type=gym');
      return;
    }
    
    console.log('All parameters present, proceeding with capture page');
    
    // Fetch user info to verify user exists
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`/api/multiuse/user-info?userId=${userId}`);
        const result = await response.json();
        
        if (!result.ok || !result.user) {
          console.error('User not found or invalid');
          router.push('/multiusecase/register?type=gym');
          return;
        }

        console.log('User info fetched successfully:', result.user);
        setUserPhone(result.user.phone);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        router.push('/multiusecase/register?type=gym');
        return;
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, [token, userId, router, searchParams]);

  const handleComplete = () => {
    // Navigate to result page after successful capture
    router.push(`/multiusecase/gym/result?token=${token}&userId=${userId}`);
  };

  const handleBack = () => {
    router.push(`/multiusecase/register?type=gym&token=${token}`);
  };

  // Show loading or redirect if parameters are missing
  if (!token || !userId || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
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

  // Handle photo capture and submission for multi-case
  const handleSubmit = async (slots: CaptureSlot[]) => {
    try {
      // First upload all images
      const uploadPromises = slots.map(async (slot, index) => {
        if (!slot.blob) return null;
        
        const formData = new FormData();
        formData.append('file', slot.blob, `image_${index}.jpg`);
        formData.append('scanId', userId);
        formData.append('index', String(index));
        formData.append('flowType', 'gym');
        formData.append('userId', userId);
        
        const uploadResponse = await fetch('/api/multiuse/upload', {
          method: 'POST',
          body: formData,
        });
        
        const uploadResult = await uploadResponse.json();
        if (!uploadResult.ok) throw new Error(`Upload failed: ${uploadResult.error}`);
        
        return {
          view: ['front', 'left', 'right', 'upper', 'lower'][index],
          url: uploadResult.url
        };
      });

      const uploadResults = await Promise.all(uploadPromises);
      const images = uploadResults.filter(result => result !== null);

      console.log('[GYM CAPTURE] About to send scan request with phone:', userPhone);

      // Then create scan with uploaded image URLs
      const response = await fetch('/api/multiuse/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scanId: userId,
          userId,
          flowType: 'gym',
          phone: userPhone,
          images
        }),
      });

      const scanResult = await response.json();
      if (!scanResult.ok) throw new Error(scanResult.error);
      
      // Navigate to results
      handleComplete();
    } catch (error) {
      console.error('Capture submission failed:', error);
    }
  };

  return (
    <DentalCaptureCore
      config={{
        title: "Gym Dental Scan",
        showHeader: true,
        showProgressBar: true,
        showThumbnails: true,
        showBackButton: true,
        showSubmitButton: true,
        headerColor: "text-[#4ebff7]",
        buttonColor: "bg-gradient-to-r from-[#4ebff7] to-[#3da8d9] hover:from-[#3da8d9] hover:to-[#2c98c4]",
        submitButtonText: "✓ Complete Gym Scan",
        backButtonText: "← Back to Registration",
        onComplete: handleSubmit,
        onBack: handleBack,
      }}
    />
  );
}