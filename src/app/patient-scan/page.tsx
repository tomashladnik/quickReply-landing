'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import PatientImageCapture from '@/app/components/patientImageCapture';

interface PatientData {
  scanId: string;
  patient_name: string;
  phone: string;
  email: string;
  status: string;
}

export default function PatientScanPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [formData, setFormData] = useState({
    dob: '',
    sex: '',
  });

  // Fetch patient data on mount
  useEffect(() => {
    // Commented out for testing without token
    // if (!token) {
    //   setError('Invalid scan link. Token is missing.');
    //   setLoading(false);
    //   return;
    // }

    fetchPatientData();
  }, [token]); 

  const fetchPatientData = async () => {
    setLoading(true);
    setError(null);
    
    if (!token) {
      setError('Invalid scan link. Token is missing.');
      setLoading(false);
      return;
    }
     try {
       const response = await fetch('/api/demo/scan', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ token }),
       });

       const data = await response.json();

       if (!response.ok) {
         throw new Error(data.error || 'Failed to fetch patient data');
       }

       setPatientData(data);
     } catch (err: any) {
       console.error('Error fetching patient data:', err);
       setError(err.message || 'Failed to load patient information');
     } finally {
       setLoading(false);
      }
  };

  const handleNext = () => {
    // No validation needed - all fields are readonly from API
    setCurrentStep(2);
  };

  const handleComplete = () => {
    // Called after images are submitted successfully
    alert('Thank you! Your dental scan has been submitted successfully.');
    // You can redirect or show a success screen here
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-[#4ebff7] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading patient information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !patientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Failed to load patient information'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#4ebff7] hover:bg-[#3da8d9] text-white font-semibold rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Image src="/logo.png" alt="ReplyQuick" width={28} height={28} className="shrink-0" />
              <span className="text-base sm:text-lg font-bold text-gray-900 leading-tight">DentalScan – Demo Dashboard</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] sm:text-xs font-semibold rounded-full whitespace-nowrap">
                Not for medical use
              </span>
            </div>
            <div className="text-xs font-medium text-gray-600 self-end sm:self-auto">
              Step {currentStep}/2
            </div>
          </div>
        </div>
      </header>

      {/* Progress Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          {/* Progress Bar */}
          <div className="mb-2 sm:mb-3">
            <div className="w-full h-1.5 rounded-full bg-gray-100">
              <div
                  style={{ width: `${currentStep === 1 ? 50 : 100}%` }}
                  className="h-full bg-[#4ebff7] rounded-full transition-all duration-300"
                />
            </div>
          </div>

          {/* Step Pills */}
          <div className="flex gap-2 justify-center sm:justify-start">
            <button
              onClick={() => setCurrentStep(1)}
              disabled={currentStep === 1}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all ${
                currentStep === 1
                  ? 'bg-[#4ebff7] text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white text-[#4ebff7] text-[10px] font-bold shrink-0">
                1
              </span>
              <span className="hidden xs:inline">Personal Info</span>
              <span className="xs:hidden">Info</span>
            </button>

            <button
              disabled
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all ${
                currentStep === 2
                  ? 'bg-[#4ebff7] text-white'
                  : 'bg-white border border-gray-300 text-gray-700 opacity-60 cursor-not-allowed'
              }`}
            >
              <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold shrink-0 ${
                currentStep === 2 ? 'bg-white text-[#4ebff7]' : 'bg-gray-100 text-gray-600'
              }`}>
                2
              </span>
              <span>Images</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Step 1: Personal Info */}
      {currentStep === 1 && (
        <main className="max-w-2xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6">
            <div className="mb-4">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Personal info</h2>
              <p className="text-xs text-gray-500">
                Verify your details, confirm consent, then choose insurance or out-of-pocket.
              </p>
            </div>

            {/* Patient Information Display */}
            <div className="space-y-3">

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  value={patientData.patient_name}
                  readOnly
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={patientData.phone}
                  readOnly
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="text"
                  value={patientData.email}
                  readOnly
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900"
                />
              </div>
            </div>

            {/* Step indicator */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">Step 1 of 2</p>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex justify-between gap-2">
              <button
                onClick={() => window.history.back()}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-4 sm:px-6 py-2 text-xs sm:text-sm bg-[#4ebff7] hover:bg-[#3da8d9] text-white font-semibold rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </main>
      )}

      {/* Step 2: Image Capture */}
      {currentStep === 2 && patientData && (
        <PatientImageCapture
          token={token || 'test-token'}
          patientName={patientData.patient_name}
          onComplete={handleComplete}
          onBack={() => setCurrentStep(1)}
        />
      )}
    </div>
  );
}