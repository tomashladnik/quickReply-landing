/* eslint-disable @next/next/no-img-element */
// src/app/components/patientImageCapture.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import DentalImages, { type StepComponentProps } from "@/components/dental/DentalImages";

interface PatientImageCaptureProps {
  token: string;
  patientName: string;
  onComplete: () => void;
  onBack: () => void;
}

export default function PatientImageCapture({
  token,
  patientName,
  onComplete,
  onBack,
}: PatientImageCaptureProps) {
  const [state, setState] = useState({
    scanLinkToken: token,
    patientName: patientName,
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