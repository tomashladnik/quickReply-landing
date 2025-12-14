'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PrintResultsPage from '@/components/PrintResultsPage';
import '@/styles/print.css';

interface ResultData {
  carePriorityScore: 'High' | 'Medium' | 'Low';
  explanation: string;
  detectedIssues: string[];
  routingInfo: {
    partnerName: string;
    contactInfo: string;
    address: string;
    nextSteps: string[];
  };
}

export default function PrintPage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<ResultData | null>(null);
  const [mlData, setMlData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const code = searchParams.get('code');
  const scanType = searchParams.get('type') || 'general';
  const title = searchParams.get('title') || 'Health Screening Results';
  const subtitle = searchParams.get('subtitle') || 'AI-Powered Analysis Report';

  useEffect(() => {
    const loadResultData = async () => {
      if (!code) {
        console.error('No patient code provided');
        setLoading(false);
        return;
      }

      try {
        // Fetch result data
        const response = await fetch(`/api/multiuse/user-info?code=${code}`);
        if (!response.ok) {
          throw new Error('Failed to load result data');
        }
        
        const data = await response.json();
        
        // Process ML data
        let processedMlData = null;
        
        if (data.resultJson) {
          try {
            processedMlData = typeof data.resultJson === 'string' 
              ? JSON.parse(data.resultJson) 
              : data.resultJson;
            console.log('Print page - Processed ML data from resultJson:', processedMlData);
          } catch (e) {
            console.warn('Failed to parse resultJson:', e);
          }
        }
        
        if (!processedMlData && data.originalJson) {
          try {
            processedMlData = typeof data.originalJson === 'string' 
              ? JSON.parse(data.originalJson) 
              : data.originalJson;
          } catch (e) {
            console.warn('Failed to parse originalJson:', e);
          }
        }

        if (processedMlData) {
          setMlData(processedMlData);
          
          // Create result object based on scan type
          const carePriorityScore = processedMlData.triage_status || 
                                   processedMlData.carePriorityScore || 
                                   processedMlData.overall_status || 
                                   'Medium';
          
          const conditions = processedMlData.conditions || 
                           processedMlData.detectedIssues || 
                           (processedMlData.findings ? 
                             processedMlData.findings.map((f: any) => f.type || f.name || 'Finding') : 
                             []) ||
                           (processedMlData.recommendations || []);
          
          const explanation = processedMlData.explanation || 
                            (processedMlData.recommendations && processedMlData.recommendations.length > 0 ? 
                              processedMlData.recommendations.join(' ') : null) ||
                            'Analysis completed. Professional evaluation recommended for detailed assessment.';

          const resultData = {
            carePriorityScore: carePriorityScore as 'High' | 'Medium' | 'Low',
            explanation: explanation,
            detectedIssues: conditions.map((condition: any) => 
              typeof condition === 'string' ? condition : condition.type || condition.name || 'Finding'
            ),
            routingInfo: {
              partnerName: scanType === 'dental' ? 'ReplyQuick Demo Clinic' : 
                          scanType === 'gym' ? 'Fitness Wellness Center' : 
                          'Community Health Partner',
              contactInfo: '(555) 123-DEMO',
              address: 'Florida, USA',
              nextSteps: getNextSteps(scanType, carePriorityScore)
            }
          };
          
          setResult(resultData);
        } else {
          // Fallback result
          setResult({
            carePriorityScore: 'Medium',
            explanation: 'Basic screening completed. Professional evaluation recommended.',
            detectedIssues: ['General health maintenance recommended'],
            routingInfo: {
              partnerName: 'Community Health Partner',
              contactInfo: '(555) 123-DEMO', 
              address: 'Florida, USA',
              nextSteps: getNextSteps(scanType, 'Medium')
            }
          });
        }
      } catch (error) {
        console.error('Error loading result data:', error);
        setResult({
          carePriorityScore: 'Medium',
          explanation: 'Unable to load detailed analysis. Please contact support.',
          detectedIssues: ['Data unavailable'],
          routingInfo: {
            partnerName: 'Support Team',
            contactInfo: '(555) 123-DEMO',
            address: 'Florida, USA',
            nextSteps: ['Contact support for assistance']
          }
        });
      } finally {
        setLoading(false);
      }
    };

    const getNextSteps = (type: string, priority: string) => {
      const baseSteps = [
        'Call to schedule your consultation',
        'Bring this screening result to your appointment',
        'Follow the recommended care plan'
      ];

      if (type === 'dental') {
        return [
          ...baseSteps,
          'Ask about financial assistance programs if needed'
        ];
      } else if (type === 'gym') {
        return [
          'Consult with a fitness professional',
          'Bring this assessment to your trainer',
          'Follow the recommended exercise plan',
          'Schedule regular progress check-ins'
        ];
      }

      return baseSteps;
    };

    loadResultData();
  }, [code, scanType]);

  useEffect(() => {
    // Auto-open print dialog after a short delay
    const timer = setTimeout(() => {
      window.print();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading results for printing...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Error loading results</p>
          <button 
            onClick={() => window.close()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <PrintResultsPage
      result={result}
      mlData={mlData}
      title={title}
      subtitle={subtitle}
      patientCode={code || undefined}
      scanType={scanType as 'dental' | 'gym' | 'general'}
    />
  );
}