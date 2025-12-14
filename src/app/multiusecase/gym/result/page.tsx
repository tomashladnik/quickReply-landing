'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Clock, Info, MapPin, Phone, Sparkles, Award, Calendar, TrendingUp, Send, CheckCircle } from 'lucide-react';

export default function GymResultPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const userId = searchParams.get('userId') || '';
  
  const [currentShade, setCurrentShade] = useState<string | null>(null);
  const [idealShade, setIdealShade] = useState<string | null>(null);
  const [smsStatus, setSmsStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [userInfo, setUserInfo] = useState<{name: string, phone: string} | null>(null);
  const [mlResult, setMlResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handlePrint = () => {
    const printUrl = `/print?code=${userId}&type=gym&title=Fitness Assessment Results&subtitle=AI-Powered Body Composition Analysis`;
    window.open(printUrl, '_blank');
  };

  // Fetch ML results and user information
  useEffect(() => {
    if (userId) {
      fetchMLResultsAndUserInfo();
    }
  }, [userId]);

  const fetchMLResultsAndUserInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // STEP 1: Get user data and check for existing ML results
      console.log('Getting user data and ML results for userId:', userId);
      const userResponse = await fetch(`/api/multiuse/user-info?userId=${userId}`);
      
      if (!userResponse.ok) {
        throw new Error('Unable to fetch user information.');
      }
      
      const userData = await userResponse.json();
      console.log('User data retrieved:', userData);
      
      // Store user info
      if (userData.patientName && userData.patientPhone) {
        setUserInfo({ name: userData.patientName, phone: userData.patientPhone });
      }
      
      // STEP 2: Extract ML results from stored data
      let mlData = null;
      
      console.log('Inspecting userData structure:');
      console.log('- resultJson:', userData.resultJson);
      console.log('- originalJson:', userData.originalJson);
      console.log('- status:', userData.status);
      console.log('- Full userData keys:', Object.keys(userData));
      
      // Check various places where ML results might be stored
      if (userData.resultJson && (userData.resultJson as any).mlAnalysis) {
        console.log('✅ Using stored ML analysis from resultJson');
        mlData = (userData.resultJson as any).mlAnalysis;
      } else if (userData.resultJson && typeof userData.resultJson === 'object') {
        console.log('🔍 Checking if resultJson itself contains ML data...');
        const resultData = userData.resultJson as any;
        if (resultData.triage_status || resultData.carePriorityScore || resultData.whitening_analysis || 
            resultData.overall_status || resultData.findings || resultData.recommendations) {
          console.log('✅ Found ML data directly in resultJson');
          mlData = resultData;
        }
      } else if (userData.originalJson && (userData.originalJson as any).mlResults) {
        console.log('✅ Using ML results from originalJson');
        mlData = (userData.originalJson as any).mlResults;
      } else if (userData.originalJson && typeof userData.originalJson === 'object') {
        console.log('🔍 Checking if originalJson contains ML data...');
        const originalData = userData.originalJson as any;
        if (originalData.triage_status || originalData.carePriorityScore || originalData.whitening_analysis ||
            originalData.overall_status || originalData.findings || originalData.recommendations) {
          console.log('✅ Found ML data directly in originalJson');
          mlData = originalData;
        }
      }
      
      console.log('🔍 Final ML data check - found:', !!mlData);
      
      // If still no ML data found, generate fallback data instead of throwing error
      if (!mlData) {
        console.log('⚠️ No stored ML data found - generating fallback assessment');
        mlData = {
          triage_status: 'Medium',
          carePriorityScore: 'Medium',
          explanation: 'Assessment completed using general wellness guidelines. For detailed AI analysis, please try uploading new images.',
          conditions: [
            'General oral health maintenance recommended',
            'Regular fitness routine beneficial'
          ],
          whitening_analysis: {
            brightness_score: 0.75,
            shade: 'B2',
            ideal_shade: 'A2'
          },
          quality_score: 0.8
        };
        
        // Set error message to inform user about fallback
        setError('Advanced ML analysis not available - showing general assessment');
      }
        
      console.log('ML Analysis Data:', mlData);
      
      // Handle new ML service response format with fallbacks
      const carePriorityScore = mlData.triage_status || mlData.carePriorityScore || mlData.overall_status || 'Medium';
      const whiteningData = mlData.whitening_analysis || {};
      const conditions = mlData.conditions || mlData.detectedIssues || 
        (mlData.findings ? mlData.findings.filter((f: any) => f.confidence > 0.5).map((f: any) => f.type) : []) ||
        (mlData.recommendations || []);
      const qualityScore = mlData.quality_score || (mlData.quality ? mlData.quality.score : null) || 0.8;
      const explanation = mlData.explanation || 
        (mlData.recommendations && mlData.recommendations.length > 0 ? mlData.recommendations.join(' ') : null) ||
        `Wellness assessment complete. Quality score: ${(qualityScore * 100).toFixed(0)}%. Professional evaluation recommended for detailed assessment.`;
      
      // Create structured ML result with fallback values
      const structuredResult = {
        carePriorityScore: carePriorityScore,
        explanation: explanation,
        detectedIssues: conditions.map((condition: any) => 
          typeof condition === 'string' ? condition : condition.type || condition.name || 'General wellness assessment'
        ),
        whitening: whiteningData,
        qualityScore: qualityScore,
        brightnessScore: whiteningData?.brightness_score || 0.7
      };
      
      setMlResult(structuredResult);
      
      // STEP 3: Map dental priority to fitness shade progression
      // Use actual whitening data if available, otherwise fallback to priority mapping
      if (whiteningData && whiteningData.shade && whiteningData.ideal_shade) {
        setCurrentShade(whiteningData.shade);
        setIdealShade(whiteningData.ideal_shade);
      } else {
        // Fallback mapping based on triage status or general defaults
        switch (carePriorityScore) {
          case 'High':
          case 'ATTENTION': // ML service uses "ATTENTION" for high priority
            setCurrentShade('D4'); // Starting fitness level
            setIdealShade('A1'); // Peak goal
            break;
          case 'Medium':
          case 'OK': // ML service might use "OK" for medium/good status
            setCurrentShade('B3'); // Moderate fitness
            setIdealShade('A2'); // Good target
            break;
          case 'Low':
          case 'GOOD': // ML service might use "GOOD" for low priority
            setCurrentShade('B1'); // Advanced level
            setIdealShade('A1'); // Elite goal
            break;
          default:
            // Additional fallback for unknown priority
            console.log('🔍 Unknown carePriorityScore:', carePriorityScore);
            setCurrentShade('B2'); // Default starting point
            setIdealShade('A2'); // Default goal
            break;
        }
      }
      
      // STEP 4: Send SMS if we have both ML and user data
      if (userInfo && mlResult) {
        await sendResultsViaSMS(userInfo);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      console.log('Error type:', error instanceof Error ? error.constructor.name : typeof error);
      console.log('Error message:', error instanceof Error ? error.message : String(error));
      
      // FALLBACK: Generate basic assessment result instead of showing error
      const fallbackResult = {
        carePriorityScore: 'Medium',
        explanation: 'Basic wellness assessment completed. Our advanced analysis service is temporarily unavailable, but we\'ve provided a general assessment based on standard wellness guidelines.',
        detectedIssues: [
          'General oral health maintenance recommended',
          'Regular fitness routine beneficial for overall wellness',
          'Professional consultation advised for personalized care'
        ],
        whitening: {
          brightness_score: 0.7,
          shade: 'B2',
          ideal_shade: 'A2'
        },
        qualityScore: 0.75,
        brightnessScore: 0.7
      };
      
      setMlResult(fallbackResult);
      setCurrentShade('B2');
      setIdealShade('A2');
      
      // Set a descriptive notice about the service issue
      const errorMessage = error instanceof Error ? error.message : 'Service connection issue';
      setError(`Service temporarily unavailable (${errorMessage}) - showing basic assessment`);
      
      // Try to get user info for SMS with fallback data (if not already retrieved)
      if (!userInfo) {
        try {
          const response = await fetch(`/api/multiuse/user-info?userId=${userId}`);
          if (response.ok) {
            const userData = await response.json();
            if (userData.patientName && userData.patientPhone) {
              const fetchedUserInfo = { name: userData.patientName, phone: userData.patientPhone };
              setUserInfo(fetchedUserInfo);
              await sendResultsViaSMS(fetchedUserInfo);
            }
          }
        } catch (userError) {
          console.error('User info fetch error:', userError);
          // Don't throw here, just log the error
        }
      } else if (mlResult) {
        // We have both user info and ML result, send SMS
        try {
          await sendResultsViaSMS(userInfo);
        } catch (smsError) {
          console.error('SMS sending error:', smsError);
          // Don't throw, just log the error
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const sendResultsViaSMS = async (user: {name: string, phone: string}) => {
    setSmsStatus('sending');
    
    try {
      // STRICT VALIDATION: Require all ML data and shade mappings
      if (!mlResult || !mlResult.carePriorityScore || !currentShade || !idealShade) {
        console.error('SMS BLOCKED: Missing ML data', { 
          mlResult: !!mlResult, 
          carePriorityScore: mlResult?.carePriorityScore,
          currentShade, 
          idealShade 
        });
        throw new Error('Cannot send results: ML analysis or shade mapping incomplete');
      }
      
      console.log('SMS PROCEEDING: All validations passed', {
        carePriorityScore: mlResult.carePriorityScore,
        currentShade,
        idealShade,
        userPhone: user.phone
      });
      
      const result = {
        fitnessLevel: mlResult.carePriorityScore,
        recommendation: mlResult.explanation || 'Continue your wellness journey',
        progressLevel: `${currentShade} to ${idealShade}`,
        areas: mlResult.detectedIssues ? 
          (Array.isArray(mlResult.detectedIssues) ? 
            mlResult.detectedIssues.map((issue: any) => 
              typeof issue === 'string' ? issue : issue.type || issue.name || 'General wellness'
            ).join(', ') : 
            'General wellness') : 
          'General wellness maintenance'
      };

      const response = await fetch('/api/multiuse/send-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          phone: user.phone,
          name: user.name,
          result
        }),
      });

      if (response.ok) {
        setSmsStatus('sent');
      } else {
        throw new Error('Failed to send SMS');
      }
    } catch (error) {
      console.error('SMS sending error:', error);
      setSmsStatus('error');
    }
  };

  const shadeScale = [
    { code: 'A1', tone: 'Brilliant pearl', color: '#FDFAF5' },
    { code: 'A2', tone: 'Soft ivory', color: '#F7EFE6' },
    { code: 'A3', tone: 'Warm beige', color: '#F1E6D8' },
    { code: 'B1', tone: 'Bright neutral', color: '#F9F4EA' },
    { code: 'B2', tone: 'Balanced ivory', color: '#F3EBDF' },
    { code: 'B3', tone: 'Sunlit tan', color: '#EADDCF' },
    { code: 'C1', tone: 'Light almond', color: '#E9DFD2' },
    { code: 'C2', tone: 'Golden sand', color: '#E2D4C5' },
    { code: 'C3', tone: 'Amber beige', color: '#D6C4B3' },
    { code: 'D2', tone: 'Warm honey', color: '#D7C8BA' },
    { code: 'D3', tone: 'Toasted bronze', color: '#C6B19C' },
    { code: 'D4', tone: 'Deep espresso', color: '#B89D85' },
  ];

  const currentIndex = shadeScale.findIndex(s => s.code === currentShade);
  const idealIndex = shadeScale.findIndex(s => s.code === idealShade);
  const stepsToGoal = currentIndex - idealIndex;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Your Assessment</h2>
          <p className="text-gray-600">Analyzing your wellness data...</p>
        </div>
      </div>
    );
  }

  if (error && !mlResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-amber-200 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 text-amber-600 text-2xl">⚠️</div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Service Unavailable</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentShade || !idealShade || !mlResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-amber-200 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Assessment Incomplete</h2>
          <p className="text-gray-600">Unable to generate your wellness results. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#4ebff7] to-[#3da8d9] rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Your Whitening Journey</h1>
                <p className="text-sm text-gray-600">Personalized Results & Plan</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm font-bold rounded-full shadow-lg">
              20% OFF Available
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
        {/* Show fallback notice if using basic assessment */}
        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 text-amber-600 text-xl">ℹ️</div>
              <h3 className="text-lg font-semibold text-amber-800">Service Notice</h3>
            </div>
            <p className="text-amber-700 mb-2">{error}</p>
            <p className="text-sm text-amber-600">
              Your results below are based on general wellness guidelines. Try again later for our advanced AI analysis.
            </p>
          </div>
        )}

        {/* Success Banner */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Analysis Complete! 🎉</h2>
              <p className="text-gray-700">
                {mlResult 
                  ? `Your wellness level is ${mlResult.carePriorityScore || 'Medium'} (${currentShade}). You're ${Math.abs(stepsToGoal)} levels from your goal of ${idealShade}!`
                  : `Your personalized plan is ready. You're ${stepsToGoal} levels away from your goal!`
                }
              </p>
            </div>
          </div>
        </div>

        {/* SMS Status Banner */}
        {smsStatus !== 'idle' && (
          <div className={`border-2 rounded-2xl p-6 shadow-lg ${
            smsStatus === 'sent' ? 'bg-blue-50 border-blue-200' :
            smsStatus === 'sending' ? 'bg-yellow-50 border-yellow-200' :
            'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                smsStatus === 'sent' ? 'bg-blue-500' :
                smsStatus === 'sending' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}>
                {smsStatus === 'sent' ? <CheckCircle className="w-6 h-6 text-white" /> :
                 smsStatus === 'sending' ? <Send className="w-6 h-6 text-white animate-pulse" /> :
                 <Phone className="w-6 h-6 text-white" />}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {smsStatus === 'sent' ? 'Results Sent! 📱' :
                   smsStatus === 'sending' ? 'Sending Results...' :
                   'SMS Failed'}
                </h3>
                <p className="text-gray-700">
                  {smsStatus === 'sent' ? 'Your fitness results have been sent to your phone via SMS.' :
                   smsStatus === 'sending' ? 'We\'re sending your results to your phone...' :
                   'Failed to send SMS to your phone.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wellness Assessment Results */}
        {mlResult && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 print-card">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-[#4ebff7]" />
              <h3 className="text-2xl font-bold text-gray-900">Your Wellness Assessment</h3>
            </div>
            
            <div className="grid gap-6">
              {/* Wellness Level */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#4ebff7] rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Wellness Level: {mlResult.carePriorityScore || 'Medium'}</h4>
                    <p className="text-sm text-gray-600">Based on comprehensive assessment</p>
                    {mlResult.brightnessScore && (
                      <p className="text-sm text-blue-600 font-medium mt-1">
                        Brightness Score: {(mlResult.brightnessScore * 100).toFixed(0)}%
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Progress Visualization */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 border">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Current Level</p>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg border-2 border-gray-300"
                        style={{ background: shadeScale.find(s => s.code === currentShade)?.color }}
                      ></div>
                      <div>
                        <span className="text-2xl font-bold text-gray-900">{currentShade}</span>
                        <p className="text-sm text-gray-600">{shadeScale.find(s => s.code === currentShade)?.tone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 border">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Target Goal</p>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg border-2 border-emerald-300"
                        style={{ background: shadeScale.find(s => s.code === idealShade)?.color }}
                      ></div>
                      <div>
                        <span className="text-2xl font-bold text-gray-900">{idealShade}</span>
                        <p className="text-sm text-gray-600">{shadeScale.find(s => s.code === idealShade)?.tone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Assessment Details */}
              {(mlResult.explanation || mlResult.qualityScore) && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl p-6 border border-purple-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Assessment Summary:</h4>
                  <p className="text-gray-700 leading-relaxed mb-3">{mlResult.explanation}</p>
                  {mlResult.qualityScore && (
                    <div className="bg-white rounded-lg p-3 border border-purple-200">
                      <p className="text-sm font-semibold text-gray-900 mb-1">Image Quality Score:</p>
                      <p className="text-sm text-gray-700">{(mlResult.qualityScore * 100).toFixed(1)}% - High quality analysis</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Areas of Focus */}
              {mlResult.detectedIssues && mlResult.detectedIssues.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl p-6 border border-amber-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Areas to Focus On:</h4>
                  <ul className="space-y-2">
                    {mlResult.detectedIssues.map((condition: any, index: number) => (
                      <li key={index} className="flex items-start gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="leading-relaxed">
                          {typeof condition === 'string' ? condition : (
                            <div>
                              <span className="font-medium">{condition.type || condition.name || 'Wellness Area'}</span>
                              {condition.severity && <span className="text-sm text-gray-600 ml-2">({condition.severity})</span>}
                              {condition.description && <div className="text-sm text-gray-600 mt-1">{condition.description}</div>}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Detailed ML Findings - Print Visible */}
        <div className="print-card bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🔬</span>
            Detailed ML Analysis Results
          </h3>
          
          {/* Raw ML Data Display */}
          {mlResult && (
            <div className="space-y-6">
              {/* Overall Assessment */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Overall Assessment</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Priority Level:</span>
                    <span className="ml-2 font-medium text-gray-900">{mlResult.carePriorityScore || 'Medium'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Quality Score:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {mlResult.qualityScore ? `${(mlResult.qualityScore * 100).toFixed(0)}%` : '80%'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Brightness Analysis */}
              {mlResult.whitening && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Brightness Analysis</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Current Shade:</span>
                      <span className="ml-2 font-medium text-gray-900">{mlResult.whitening.shade || currentShade}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Target Shade:</span>
                      <span className="ml-2 font-medium text-gray-900">{mlResult.whitening.ideal_shade || idealShade}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Brightness Score:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {mlResult.whitening.brightness_score ? `${(mlResult.whitening.brightness_score * 100).toFixed(0)}%` : 
                         mlResult.brightnessScore ? `${(mlResult.brightnessScore * 100).toFixed(0)}%` : '70%'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Detected Issues/Conditions */}
              {mlResult.detectedIssues && mlResult.detectedIssues.length > 0 && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Detected Conditions</h4>
                  <ul className="space-y-2">
                    {mlResult.detectedIssues.map((issue: any, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-amber-600 mt-1">▶</span>
                        <span className="text-sm">{typeof issue === 'string' ? issue : issue.type || issue.name || 'Wellness condition'}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technical Details */}
              <div className="text-xs text-gray-500 border-t border-gray-200 pt-4">
                <p><strong>Analysis Method:</strong> AI-powered fitness image analysis</p>
                <p><strong>Processing Date:</strong> {new Date().toLocaleDateString()}</p>
                <p className="mt-2 italic">This analysis is for fitness screening purposes only and does not replace professional trainer consultation.</p>
              </div>
            </div>
          )}
        </div>

        {/* Current vs Ideal Comparison */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-[#4ebff7]" />
            <h3 className="text-2xl font-bold text-gray-900">Your Shade Journey</h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {/* Current Shade Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-2">Current Shade</p>
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-5xl font-black text-blue-900">{currentShade}</span>
                  <span className="text-lg text-blue-700 mb-2">{shadeScale.find(s => s.code === currentShade)?.tone}</span>
                </div>
                <div 
                  className="w-full h-24 rounded-xl shadow-lg border-4 border-white"
                  style={{ background: shadeScale.find(s => s.code === currentShade)?.color }}
                />
              </div>
            </div>

            {/* Ideal Shade Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition"></div>
              <div className="relative bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-6 border-2 border-emerald-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">Goal Shade</p>
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-5xl font-black text-emerald-900">{idealShade}</span>
                  <span className="text-lg text-emerald-700 mb-2">{shadeScale.find(s => s.code === idealShade)?.tone}</span>
                </div>
                <div 
                  className="w-full h-24 rounded-xl shadow-lg border-4 border-white"
                  style={{ background: shadeScale.find(s => s.code === idealShade)?.color }}
                />
              </div>
            </div>
          </div>

          {/* Progress Visualization */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Your Progress Path</p>
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-[#4ebff7] to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentIndex - idealIndex) / currentIndex) * 100}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-lg"
                style={{ left: `${(currentIndex / (shadeScale.length - 1)) * 100}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-emerald-600 rounded-full border-4 border-white shadow-lg"
                style={{ left: `${(idealIndex / (shadeScale.length - 1)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Start</span>
              <span className="font-semibold text-[#4ebff7]">{stepsToGoal} shades to goal</span>
              <span>Brightest</span>
            </div>
          </div>

          {/* Whitening Outlook */}
          <div className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-[#4ebff7] to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Your Whitening Plan</h4>
                <p className="text-gray-700 leading-relaxed">
                  We'll guide you from {currentShade} to {idealShade} with a gentle, athlete-friendly approach. Expect gradual brightening with professional sessions combined with simple at-home care.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="font-bold text-gray-900">Treatment Plan</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">Gentle studio sessions with bright-light polishing and easy daily maintenance.</p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="font-bold text-gray-900">Timeline</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">Quick visits with clear pacing. See progress at every check-in, zero pressure.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Shade Scale Selector */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Complete Shade Scale</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {shadeScale.map((shade) => {
              const isCurrent = shade.code === currentShade;
              const isIdeal = shade.code === idealShade;
              const isInPath = currentIndex >= shadeScale.findIndex(s => s.code === shade.code) && 
                               shadeScale.findIndex(s => s.code === shade.code) >= idealIndex;

              return (
                <div
                  key={shade.code}
                  className={`relative group rounded-2xl overflow-hidden transition-all duration-300 ${
                    isCurrent
                      ? 'ring-4 ring-blue-500 shadow-2xl scale-105'
                      : isIdeal
                      ? 'ring-4 ring-emerald-500 shadow-2xl scale-105'
                      : isInPath
                      ? 'ring-2 ring-[#4ebff7] shadow-lg'
                      : 'ring-1 ring-gray-200 shadow-md'
                  }`}
                >
                  <div 
                    className="w-full h-32 relative"
                    style={{ background: `linear-gradient(135deg, ${shade.color}, ${shade.color}dd)` }}
                  >
                    {isInPath && !isCurrent && !isIdeal && (
                      <div className="absolute inset-0 bg-[#4ebff7]/10"></div>
                    )}
                  </div>

                  <div className="bg-white p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-black text-gray-900">{shade.code}</span>
                      <div className="flex gap-1">
                        {isCurrent && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">Now</span>
                        )}
                        {isIdeal && (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">Goal</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{shade.tone}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Special Offer Card - ReplyQuick Color */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#4ebff7] via-[#3da8d9] to-[#2a95c5] rounded-3xl shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative p-8">
            <div className="inline-block px-4 py-1.5 bg-amber-400 text-amber-900 text-xs font-bold rounded-full mb-4 shadow-lg">
              EXCLUSIVE MEMBER OFFER
            </div>
            
            <h3 className="text-3xl font-black text-white mb-3 leading-tight">
              Claim Your 20% Whitening Discount
            </h3>
            
            <p className="text-white/95 text-sm leading-relaxed mb-6">
              Lock in this exclusive rate today. Schedule when you're ready with flexible appointment times in our upbeat, pressure-free studio environment.
            </p>

            <button className="w-full bg-gradient-to-r from-white to-gray-100 text-[#4ebff7] font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 mb-6">
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Claim 20% Discount Now
              </span>
            </button>

            {/* Clinic Info */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#4ebff7]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">ReplyQuick Demo Studio</h4>
                  <p className="text-white/95 text-sm"> Location - Florida, USA</p>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3 text-white/95">
                  <Phone className="w-5 h-5 text-amber-300" />
                  <span className="text-sm font-medium">+1 (555) 123-XXXX</span>
                </div>
                <div className="flex items-center gap-3 text-white/95">
                  <Calendar className="w-5 h-5 text-amber-300" />
                  <span className="text-sm font-medium">Mon - Fri: 9:00 AM - 6:00 PM ( Hours)</span>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl px-4 py-3 border border-white/10">
                <p className="text-sm text-white/95 leading-relaxed">
                  ✨ Friendly crew, bright lounge vibes, and clear progress tracking at every visit
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Care Tips */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-6 shadow-lg border border-emerald-100">
          <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            Quick Care Tips
          </h4>
          <ul className="space-y-3">
            {[
              'Hydrate before sessions for a smooth polish',
              'Minimize coffee and dark drinks on session days',
              'Regular smile checks to track your progress',
              'Follow simple at-home maintenance routine'
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{i + 1}</span>
                </div>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex gap-3">
            <div className="w-6 h-6 text-[#4EBFF7] shrink-0 mt-0.5">⚠️</div>
            <div>
              <p className="font-semibold text-blue-900 mb-1">Important Notice</p>
              <p className="text-sm text-blue-800 leading-relaxed">
                This fitness assessment is designed to help identify potential wellness opportunities. 
                It is <strong>not a medical diagnosis</strong>. A professional fitness evaluation by a qualified trainer 
                is recommended for a complete wellness assessment and personalized training plan.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-6 no-print">
          <button
            onClick={handlePrint}
            className="w-full py-4 bg-[#4EBFF7] hover:bg-[#3da8d9] text-white rounded-xl font-bold text-lg shadow-lg transition transform hover:scale-[1.02]"
          >
            📄 Print My Results
          </button>
          <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-base transition transform hover:scale-[1.02]">
            📱 Share Results
          </button>
        </div>
      </main>
    </div>
  );
}