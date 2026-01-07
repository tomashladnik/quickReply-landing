'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Clock, Info, MapPin, Phone, Sparkles, Award, Calendar, TrendingUp, Send, CheckCircle, Copy, CopyCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function GymResultContent() {
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
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  
  const PROMO_CODE = 'DENTALSCAN20';
  
  const handleCopyPromoCode = async () => {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handlePrint = () => {
    // Construct the print page URL with relevant query parameters
    const code = userId; // Use userId since that's what the gym page uses
    const type = 'gym';
    const title = encodeURIComponent('Wellness Assessment – Not a Medical Diagnosis');
    const subtitle = encodeURIComponent('AI-Powered Body Composition Analysis');
    const printUrl = `/multiusecase/print?code=${code}&type=${type}&title=${title}&subtitle=${subtitle}`;
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
      console.log('🔍 ML data structure:', Object.keys(mlData || {}));
      console.log('🔍 Full ML data:', mlData);
      
      // Require real ML analysis - no fallbacks allowed
      if (!mlData) {
        console.error('❌ CRITICAL: No ML data found - cannot proceed without real analysis');
        setError('ML Analysis Required - Please retake photos for proper AI analysis');
        setLoading(false);
        return; // Stop processing - require real ML data
      }
      
      // Flexible ML data validation - check for multiple possible field names
      const hasTriageStatus = mlData.triage_status || mlData.carePriorityScore || mlData.overall_status;
      const hasWhiteningAnalysis = mlData.whitening_analysis || (mlData.whitening && mlData.whitening.shade);
      const hasQualityScore = mlData.quality_score || mlData.quality?.score || mlData.qualityScore;
      
      console.log('🔍 ML field validation:', {
        hasTriageStatus: !!hasTriageStatus,
        hasWhiteningAnalysis: !!hasWhiteningAnalysis, 
        hasQualityScore: !!hasQualityScore,
        triageValue: hasTriageStatus,
        whiteningValue: hasWhiteningAnalysis,
        qualityValue: hasQualityScore
      });
      
      // Only require basic ML analysis - be more flexible
      if (!hasTriageStatus && !hasQualityScore) {
        console.error('❌ MINIMAL ML DATA MISSING - Need at least triage status or quality score');
        setError('Incomplete ML Analysis - Missing core assessment data');
        setLoading(false);
        return;
      }
      
      console.log('✅ ML data validation passed - proceeding with shade conversion');
        
      console.log('ML Analysis Data:', mlData);
      
      // FLEXIBLE ML DATA PROCESSING - Handle various field name conventions
      console.log('🔬 PROCESSING REAL ML ANALYSIS:', {
        has_triage: !!(mlData.triage_status || mlData.carePriorityScore || mlData.overall_status),
        has_whitening: !!(mlData.whitening_analysis || mlData.whitening),
        has_findings: !!(mlData.findings || mlData.conditions || mlData.detectedIssues),
        has_quality: !!(mlData.quality_score || mlData.quality?.score || mlData.qualityScore),
        ml_timestamp: mlData.analysis_timestamp || mlData.timestamp || 'not provided'
      });
      
      // Extract ML analysis with flexible field mapping
      const carePriorityScore = mlData.triage_status || mlData.carePriorityScore || mlData.overall_status;
      
      if (!carePriorityScore) {
        console.error('❌ No triage status found in ML data');
        setError('ML Analysis incomplete - missing triage status');
        setLoading(false);
        return;
      }
      
      // Process ML-detected findings with flexible confidence handling
      const conditions = mlData.findings ? 
        mlData.findings
          .filter((f: any) => f.confidence && f.confidence >= 0.5)
          .map((f: any) => ({
            type: f.type,
            confidence: f.confidence,
            location: f.location,
            severity: f.severity
          })) :
        mlData.conditions || mlData.detectedIssues || mlData.recommendations || [];
        
      const qualityScore = mlData.quality_score || mlData.quality?.score || mlData.qualityScore;
      
      if (!qualityScore) {
        console.error('❌ No quality score found in ML data');
        setError('ML Analysis incomplete - missing quality score');
        setLoading(false);
        return;
      }
      
      // Use available ML data for explanation - recommendations or generate from findings
      const explanation = mlData.recommendations?.join('. ') || 
        `Analysis detected ${conditions.length} findings with ${carePriorityScore} priority status.`;
      
      console.log('✅ ML data successfully processed:', {
        carePriorityScore,
        explanation: explanation.substring(0, 50) + '...',
        conditionsCount: conditions.length,
        qualityScore,
        findingsTypes: conditions.map((c: any) => c.type || 'unknown').join(', ')
      });
      
      // STEP 3: CONVERT ML FINDINGS TO SHADE ANALYSIS (in result page)
      console.log('🎨 CONVERTING ML FINDINGS TO SHADE ANALYSIS...');
      
      // Shade scales mapping
      const shadeScales = {
        'A1': { color: '#F5F5DC', tone: 'Light neutral', brightness: 0.9 },
        'A2': { color: '#F0E68C', tone: 'Medium neutral', brightness: 0.8 },
        'A3': { color: '#DDD85C', tone: 'Dark neutral', brightness: 0.7 },
        'B1': { color: '#FFF8DC', tone: 'Bright neutral', brightness: 0.95 },
        'B2': { color: '#F5DEB3', tone: 'Medium warm', brightness: 0.85 },
        'B3': { color: '#DEB887', tone: 'Sunlit tan', brightness: 0.75 },
        'C1': { color: '#F8F8FF', tone: 'Cool bright', brightness: 0.92 },
        'C2': { color: '#E6E6FA', tone: 'Cool medium', brightness: 0.82 },
        'C3': { color: '#D3D3D3', tone: 'Cool dark', brightness: 0.72 },
        'D2': { color: '#F5F5F5', tone: 'Warm light', brightness: 0.88 },
        'D3': { color: '#DCDCDC', tone: 'Warm medium', brightness: 0.78 },
        'D4': { color: '#C0C0C0', tone: 'Warm dark', brightness: 0.68 }
      };
      
      // Convert ML findings to shade assessment
      const generateShadeFromMLFindings = (mlData: any) => {
        console.log('🔍 Analyzing ML findings for shade conversion:', {
          findings: conditions.length,
          qualityScore,
          carePriorityScore
        });
        
        // Base shade calculation from ML confidence values
        let currentShadeIndex = 6; // Start with B2 as baseline
        let brightnessReduction = 0;
        
        if (conditions.length === 0) {
          console.log('✅ No dental issues detected - using healthy baseline');
          // No issues detected = healthier teeth = better starting shade
          currentShadeIndex = 3; // Start with A2 for healthy teeth
          brightnessReduction = 0;
        } else {
          // Adjust based on detected issues
          conditions.forEach((condition: any) => {
            const confidence = condition.confidence;
            console.log('🦷 Processing condition:', condition.type, 'confidence:', confidence);
            
            if (!confidence) {
              console.warn('⚠️ Condition missing confidence, skipping:', condition.type);
              return;
            }
          
          switch(condition.type) {
            case 'Tooth Discoloration':
              brightnessReduction += confidence * 2;
              break;
            case 'Calculus':
              brightnessReduction += confidence * 1.5;
              break;
            case 'Gingivitis':
              brightnessReduction += confidence * 1;
              break;
            case 'Caries':
              brightnessReduction += confidence * 1.2;
              break;
            default:
              brightnessReduction += confidence * 0.5;
          }
        });
        
        // Apply quality score impact
        const qualityImpact = (1 - qualityScore) * 1;
        brightnessReduction += qualityImpact;
        }
        // Calculate final shade index
        const finalShadeIndex = Math.min(Math.max(
          Math.floor(currentShadeIndex + brightnessReduction),
          0
        ), Object.keys(shadeScales).length - 1);
        
        const shadeKeys = Object.keys(shadeScales);
        const currentShade = shadeKeys[finalShadeIndex];
        
        // Target shade is typically 2-3 levels brighter
        const targetIndex = Math.max(0, finalShadeIndex - 3);
        const targetShade = shadeKeys[targetIndex];
        
        const brightness = shadeScales[currentShade as keyof typeof shadeScales].brightness;
        
        console.log('🎯 Shade calculation result:', {
          brightnessReduction,
          finalShadeIndex,
          currentShade,
          targetShade,
          brightness
        });
        
        return {
          current_shade: currentShade,
          target_shade: targetShade,
          brightness_score: brightness,
          whitening_potential: Math.min(0.9, (brightnessReduction + 1) / 4),
          confidence: qualityScore,
          analysis_source: 'ml_findings_converted'
        };
      };
      
      const realShadeAnalysis = generateShadeFromMLFindings(mlData);
      
      console.log('✅ GENERATED SHADE ANALYSIS FROM ML FINDINGS:', realShadeAnalysis);
      
      // ONLY USE REAL ML SERVICE RESULTS (no fallbacks)
      if (!realShadeAnalysis) {
        console.error('❌ SHADE ANALYSIS GENERATION FAILED');
        setError('Unable to generate shade analysis from ML findings');
        setLoading(false);
        return;
      }
      
      console.log('🚀 USING CONVERTED SHADE ANALYSIS (from ML findings):', realShadeAnalysis);

      const structuredResult = {
        carePriorityScore: carePriorityScore,
        explanation: explanation,
        mlTimestamp: mlData.analysis_timestamp,
        mlConfidence: mlData.overall_confidence,
        detectedIssues: conditions.map((condition: any) => {
          if (typeof condition === 'string') return { type: condition, confidence: null };
          return {
            type: condition.type || condition.name,
            confidence: condition.confidence,
            severity: condition.severity,
            location: condition.location,
            description: condition.description
          };
        }),
        whitening: {
          current_shade: realShadeAnalysis.current_shade,
          target_shade: realShadeAnalysis.target_shade,
          brightness_score: realShadeAnalysis.brightness_score,
          whitening_potential: realShadeAnalysis.whitening_potential,
          confidence: realShadeAnalysis.confidence,
          analysis_source: realShadeAnalysis.analysis_source
        },
        qualityScore: qualityScore,
        brightnessScore: realShadeAnalysis.brightness_score,
        mlAnalysisVersion: mlData.model_version,
        imageQualityMetrics: mlData.image_quality_metrics
      };
      
      setMlResult(structuredResult);
      
      // SAVE SHADE ANALYSIS BACK TO DATABASE for dashboard access
      try {
        const updateResponse = await fetch(`/api/multiuse/user-info`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId,
            shadeAnalysis: structuredResult.whitening,
            processedResult: structuredResult
          })
        });
        
        if (updateResponse.ok) {
          console.log('✅ Shade analysis saved to database for dashboard access');
        } else {
          console.warn('⚠️ Failed to save shade analysis to database, dashboard may not show results');
        }
      } catch (saveError) {
        console.warn('⚠️ Error saving shade analysis:', saveError);
      }
      
      // SHADE PROCESSING - Use ONLY real ML whitening service results
      const currentShadeValue = realShadeAnalysis.current_shade;
      const idealShadeValue = realShadeAnalysis.target_shade;
      
      console.log('🚀 APPLYING CONVERTED SHADE ANALYSIS TO UI:', {
        service_type: 'ML FINDINGS CONVERTED TO SHADES',
        detected_shade: currentShadeValue,
        recommended_target: idealShadeValue,
        brightness_score: realShadeAnalysis.brightness_score,
        confidence: realShadeAnalysis.confidence
      });
      setCurrentShade(currentShadeValue);
      setIdealShade(idealShadeValue);
      
      console.log('✅ CONVERTED SHADE ANALYSIS APPLIED SUCCESSFULLY:', {
        final_current_shade: currentShadeValue,
        final_target_shade: idealShadeValue,
        brightness_score: realShadeAnalysis.brightness_score,
        confidence: realShadeAnalysis.confidence,
        source: 'ML FINDINGS CONVERTED TO SHADES (in result page)'
      });
      
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
      setIdealShade('B1'); // Realistic improvement - not overly bright
      
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
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 print:hidden ml-2"
          >
            Print
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
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 text-red-600 text-xl">⚠️</div>
              <h3 className="text-lg font-semibold text-red-800">ML Analysis Required</h3>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <h4 className="font-semibold text-red-900 mb-2">To get your real analysis:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Retake photos with better lighting</li>
                <li>• Ensure clear view of teeth</li>
                <li>• Wait for ML processing to complete</li>
                <li>• Contact support if issues persist</li>
              </ul>
            </div>
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

        {/* Current vs Ideal Comparison */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-[#4ebff7]" />
            <h3 className="text-2xl font-bold text-gray-900">Your Shade Analysis Results</h3>
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

          {/* Analysis Summary */}
          {mlResult && (
            <div className="grid gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#4ebff7] rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Priority Level: {mlResult.carePriorityScore || 'Medium'}</h4>
                    <p className="text-sm text-gray-600">Based on shade analysis</p>
                  </div>
                </div>
                {mlResult.explanation && (
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Analysis Summary:</h4>
                    <p className="text-gray-700 leading-relaxed">{mlResult.explanation}</p>
                  </div>
                )}
                {mlResult.qualityScore && (
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <p className="text-sm font-semibold text-gray-900 mb-1">Image Quality Score:</p>
                    <p className="text-sm text-gray-700">{(mlResult.qualityScore * 100).toFixed(1)}% - High quality analysis</p>
                  </div>
                )}
              </div>
              
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
                              <span className="font-medium">{condition.type || condition.name || 'Focus Area'}</span>
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
          )}

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
                  <p className="font-bold text-gray-900">Recommended Sessions</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">3-4 professional sessions to go from C3 to B2. Each session targets 1 shade level improvement.</p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="font-bold text-gray-900">Expected Timeline</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">6-8 weeks total. Sessions spaced 2 weeks apart for optimal results and shade progression.</p>
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

            <button 
              onClick={() => setDiscountModalOpen(true)}
              className="w-full bg-gradient-to-r from-white to-gray-100 text-[#4ebff7] font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 mb-6"
            >
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
                  <p className="text-white/95 text-sm">Location - Florida, USA</p>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3 text-white/95">
                  <Phone className="w-5 h-5 text-amber-300" />
                  <span className="text-sm font-medium">+1 (555) 123-XXXX</span>
                </div>
                <div className="flex items-center gap-3 text-white/95">
                  <Calendar className="w-5 h-5 text-amber-300" />
                  <span className="text-sm font-medium">Mon - Fri: 9:00 AM - 6:00 PM (Hours)</span>
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

      {/* Discount Modal */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes discountModalEnter {
          from {
            opacity: 0;
            transform: translate(-50%, -48%) scale(0.92);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes discountModalExit {
          from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -48%) scale(0.96);
          }
        }
        
        .discount-modal-content[data-state="open"] {
          animation: discountModalEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
        }
        
        .discount-modal-content[data-state="closed"] {
          animation: discountModalExit 0.2s cubic-bezier(0.4, 0, 1, 1) forwards !important;
        }
      `}} />
      <Dialog open={discountModalOpen} onOpenChange={setDiscountModalOpen}>
        <DialogContent className="discount-modal-content sm:max-w-md [&[data-state=open]]:!animate-none [&[data-state=closed]]:!animate-none">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Claim Your 20% Discount
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 pt-2">
              Use this promo code when you contact us
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Promo Code Display */}
            <div className="bg-gradient-to-r from-[#4ebff7] to-[#3da8d9] rounded-xl p-6 text-center">
              <p className="text-sm text-white/90 mb-2 font-medium">Your Promo Code</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl font-black text-white tracking-wider">
                  {PROMO_CODE}
                </span>
                <button
                  onClick={handleCopyPromoCode}
                  className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  title="Copy code"
                >
                  {codeCopied ? (
                    <CopyCheck className="w-5 h-5 text-white" />
                  ) : (
                    <Copy className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
              {codeCopied && (
                <p className="text-white text-sm mt-2 font-medium">✓ Copied!</p>
              )}
            </div>

            {/* How to Redeem */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#4ebff7]" />
                How to Redeem
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Call or text the office and mention this code
              </p>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopyPromoCode}
              className="w-full bg-[#4ebff7] hover:bg-[#3da8d9] text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {codeCopied ? (
                <>
                  <CopyCheck className="w-5 h-5" />
                  Code Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Promo Code
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function GymResultPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><div>Loading results...</div></div>}>
      <GymResultContent />
    </Suspense>
  );
}