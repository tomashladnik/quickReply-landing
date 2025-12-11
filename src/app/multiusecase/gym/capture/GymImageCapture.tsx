'use client';

import React, { useState } from 'react';
import DentalImages from '@/components/dental/DentalImages';

interface GymImageCaptureProps {
  token: string;
  onComplete: () => void;
  onBack: () => void;
}

export default function GymImageCapture({ token, onComplete, onBack }: GymImageCaptureProps) {
  const [state, setState] = useState({
    scanLinkToken: token,
    patientName: "Gym Member",
    photos: { slots: [] },
    validity: { photos: false },
  });

  const handleNext = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 py-4 px-3">
      <div className="max-w-2xl mx-auto">
        <DentalImages
          state={state}
          setState={setState}
          onNext={handleNext}
          onBack={onBack}
        />
      </div>
    </div>
  );
}