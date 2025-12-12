'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle, Clock, Phone, MapPin, Calendar } from 'lucide-react';

type CarePriority = 'Low' | 'Medium' | 'High';

interface CharityResult {
  carePriorityScore: CarePriority;
  explanation: string;
  routingInfo: {
    partnerName: string;
    contactInfo: string;
    address: string;
    nextSteps: string[];
  };
  detectedIssues?: string[];
}

export default function CharityResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || 'demo-token';
  
  const [result, setResult] = useState<CharityResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/charity/results?token=${token}`);
      // const data = await response.json();
      
      const mockResult: CharityResult = {
        carePriorityScore: 'Medium',
        explanation: 'Based on your dental screening, we recommend scheduling a professional evaluation to address potential dental care needs.',
        routingInfo: {
          partnerName: 'Community Dental Care Clinic',
          contactInfo: '1-800-555-CARE (2273)',
          address: '123 Health Street, Community Center, TX 75009',
          nextSteps: [
            'Call to schedule your free consultation',
            'Bring this screening result to your appointment',
            'Ask about financial assistance programs if needed',
            'Follow the recommended treatment plan'
          ]
        },
        detectedIssues: ['Areas requiring attention noted', 'Professional evaluation recommended']
      };
      
      setResult(mockResult);
      setLoading(false);
    } catch (error) {
      console.error('Error loading results:', error);
      setLoading(false);
    }
  };

  const getPriorityConfig = (priority: CarePriority) => {
    switch (priority) {
      case 'High':
        return {
          icon: AlertCircle,
          color: '#ef4444',
          bgColor: '#fee2e2',
          textColor: '#991b1b',
          title: 'Attention Needed',
          message: 'We strongly recommend scheduling a dental evaluation as soon as possible.'
        };
      case 'Medium':
        return {
          icon: Clock,
          color: '#f59e0b',
          bgColor: '#fef3c7',
          textColor: '#92400e',
          title: 'Evaluation Recommended',
          message: 'You may benefit from a professional dental evaluation.'
        };
      case 'Low':
        return {
          icon: CheckCircle,
          color: '#10b981',
          bgColor: '#d1fae5',
          textColor: '#065f46',
          title: 'Looking Good',
          message: 'Continue your regular dental care routine and preventive visits.'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#4EBFF7] mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Analyzing your dental screening...</p>
          <p className="text-sm text-gray-500 mt-2">This will only take a moment</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Results</h2>
          <p className="text-gray-600 mb-6">We couldn't retrieve your screening results. Please try again.</p>
          <button
            onClick={() => router.push(`/multiusecase/charity/capture?token=${token}`)}
            className="w-full px-6 py-3 bg-[#4EBFF7] hover:bg-[#3da8d9] text-white rounded-xl font-semibold transition"
          >
            Retake Screening
          </button>
        </div>
      </div>
    );
  }

  const config = getPriorityConfig(result.carePriorityScore);
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-[#4EBFF7] text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center">Dental Screening Results</h1>
          <p className="text-center text-blue-100 mt-1">Community Dental Care Program</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Care Priority Card */}
        <div 
          className="rounded-2xl p-6 md:p-8 shadow-xl border-2"
          style={{ 
            backgroundColor: config.bgColor,
            borderColor: config.color
          }}
        >
          <div className="flex items-start gap-4 mb-4">
            <div 
              className="p-4 rounded-2xl shrink-0"
              style={{ backgroundColor: config.color + '30' }}
            >
              <Icon className="w-8 h-8 md:w-10 md:h-10" style={{ color: config.color }} />
            </div>
            <div className="flex-1">
              <h2 
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{ color: config.textColor }}
              >
                {config.title}
              </h2>
              <div className="inline-block px-3 py-1 bg-white rounded-full">
                <span className="text-sm font-bold" style={{ color: config.color }}>
                  Care Priority: {result.carePriorityScore}
                </span>
              </div>
            </div>
          </div>
          <p className="text-gray-800 text-lg leading-relaxed">
            {config.message}
          </p>
        </div>

        {/* Explanation Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            What This Means
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            {result.explanation}
          </p>
          
          {result.detectedIssues && result.detectedIssues.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="font-semibold text-gray-900 mb-2">Areas Noted:</p>
              <ul className="space-y-2">
                {result.detectedIssues.map((issue, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#4EBFF7] mt-1">•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Partner Information Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 border-[#4EBFF7]">
          <h3 className="text-xl font-bold text-[#4EBFF7] mb-6 flex items-center gap-2">
            <span className="text-2xl">🏥</span>
            Your Community Partner
          </h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#4EBFF7]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">{result.routingInfo.partnerName}</p>
                <p className="text-gray-600">{result.routingInfo.address}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[#4EBFF7]" />
              </div>
              <div>
                <p className="font-medium text-gray-700">Contact Number:</p>
                <a 
                  href={`tel:${result.routingInfo.contactInfo.replace(/\D/g, '')}`}
                  className="text-[#4EBFF7] font-bold text-lg hover:underline"
                >
                  {result.routingInfo.contactInfo}
                </a>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#4EBFF7]" />
              Your Next Steps
            </h4>
            <ol className="space-y-3">
              {result.routingInfo.nextSteps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-[#4EBFF7] text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex gap-3">
            <AlertCircle className="w-6 h-6 text-[#4EBFF7] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 mb-1">Important Notice</p>
              <p className="text-sm text-blue-800 leading-relaxed">
                This screening is designed to help identify potential dental care needs. 
                It is <strong>not a diagnosis</strong>. A professional dental evaluation by a licensed dentist 
                is recommended for a complete oral health assessment and treatment plan.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          <button
            onClick={() => window.print()}
            className="w-full py-4 bg-[#4EBFF7] hover:bg-[#3da8d9] text-white rounded-xl font-bold text-lg shadow-lg transition transform hover:scale-[1.02]"
          >
            🖨️ Print Results
          </button>
          
          
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-section, .print-section * {
            visibility: visible;
          }
          .print-section {
            position: absolute;
            left: 0;
            top: 0;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
