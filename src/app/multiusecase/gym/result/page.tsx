'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Clock, Info, MapPin, Phone, Sparkles, Award, Calendar, TrendingUp, Send, CheckCircle } from 'lucide-react';

export default function GymResultPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const userId = searchParams.get('userId') || '';
  
  const [currentShade, setCurrentShade] = useState('B3');
  const [idealShade, setIdealShade] = useState('A1');
  const [activeTarget, setActiveTarget] = useState<'current' | 'ideal'>('current');
  const [smsStatus, setSmsStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [userInfo, setUserInfo] = useState<{name: string, phone: string} | null>(null);

  // Fetch user information and auto-send SMS
  useEffect(() => {
    if (userId) {
      fetchUserInfoAndSendSMS();
    }
  }, [userId]);

  const fetchUserInfoAndSendSMS = async () => {
    try {
      // Fetch user information from database
      const response = await fetch(`/api/multiuse/user-info?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      
      const userData = await response.json();
      
      if (userData.name && userData.phone) {
        const userInfo = {
          name: userData.name,
          phone: userData.phone
        };
        
        setUserInfo(userInfo);
        
        // Auto-send SMS with results
        await sendResultsViaSMS(userInfo);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      setSmsStatus('error');
    }
  };

  const sendResultsViaSMS = async (user: {name: string, phone: string}) => {
    setSmsStatus('sending');
    
    try {
      const result = {
        currentStatus: 'Fitness Level B3',
        recommendedPlan: '12-week transformation',
        progressScore: '7.5/10'
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

  const handleShadeClick = (code: string) => {
    if (activeTarget === 'current') {
      setCurrentShade(code);
    } else {
      setIdealShade(code);
    }
  };

  const currentIndex = shadeScale.findIndex(s => s.code === currentShade);
  const idealIndex = shadeScale.findIndex(s => s.code === idealShade);
  const stepsToGoal = currentIndex - idealIndex;

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
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Analysis Complete! 🎉</h2>
              <p className="text-gray-700">Your personalized whitening plan is ready. You're {stepsToGoal} shades away from your ideal smile!</p>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Complete Shade Scale</h3>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 font-medium">Select:</span>
              <div className="flex bg-gray-100 rounded-full p-1.5 shadow-inner">
                <button
                  type="button"
                  onClick={() => setActiveTarget('current')}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                    activeTarget === 'current'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Current
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTarget('ideal')}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                    activeTarget === 'ideal'
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Goal
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {shadeScale.map((shade) => {
              const isCurrent = shade.code === currentShade;
              const isIdeal = shade.code === idealShade;
              const isInPath = currentIndex >= shadeScale.findIndex(s => s.code === shade.code) && 
                               shadeScale.findIndex(s => s.code === shade.code) >= idealIndex;

              return (
                <button
                  key={shade.code}
                  type="button"
                  onClick={() => handleShadeClick(shade.code)}
                  className={`relative group rounded-2xl overflow-hidden transition-all duration-300 ${
                    isCurrent
                      ? 'ring-4 ring-blue-500 shadow-2xl scale-105'
                      : isIdeal
                      ? 'ring-4 ring-emerald-500 shadow-2xl scale-105'
                      : isInPath
                      ? 'ring-2 ring-[#4ebff7] shadow-lg hover:scale-105'
                      : 'ring-1 ring-gray-200 shadow-md hover:shadow-xl hover:scale-105'
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
                </button>
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
                  <h4 className="text-xl font-bold text-white mb-1">Shoreline Smile Studio</h4>
                  <p className="text-white/95 text-sm">Level 4, Harbor Wellness Center, Downtown</p>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3 text-white/95">
                  <Phone className="w-5 h-5 text-amber-300" />
                  <span className="text-sm font-medium">+1 (555) 218-0142</span>
                </div>
                <div className="flex items-center gap-3 text-white/95">
                  <Calendar className="w-5 h-5 text-amber-300" />
                  <span className="text-sm font-medium">Mon - Sat: 7:00 AM - 8:30 PM</span>
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
      </main>
    </div>
  );
}