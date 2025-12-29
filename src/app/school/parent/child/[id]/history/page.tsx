'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Calendar, TrendingUp } from 'lucide-react';

type ScanResult = 'all_good' | 'needs_attention' | 'concern';

interface ScanHistoryItem {
  id: string;
  date: string;
  result: ScanResult;
}

export default function ScanHistoryPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.id as string;
  
  const [childName, setChildName] = useState('');
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('parent_token');
    if (!token) {
      router.push('/school/parent');
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/school/parent/child/${childId}/history`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/school/parent');
            return;
          }
          throw new Error('Failed to fetch history');
        }

        const data = await response.json();
        
        if (!data || !data.child || !data.child.name) {
          throw new Error('Invalid response from server');
        }
        
        setChildName(data.child.name);
        setHistory((data.scans || []).map((scan: any) => ({
          id: scan.id,
          date: scan.scanDate,
          result: scan.category,
        })));
      } catch (err: any) {
        console.error('Error fetching history:', err);
        setHistory([]);
        setChildName('');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [childId, router]);

  const getResultConfig = (result: ScanResult) => {
    switch (result) {
      case 'all_good':
        return {
          icon: CheckCircle2,
          label: 'All Good',
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      case 'needs_attention':
        return {
          icon: AlertTriangle,
          label: 'Needs Attention',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
        };
      case 'concern':
        return {
          icon: XCircle,
          label: 'Concern',
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        };
    }
  };

  const getStats = () => {
    const allGood = history.filter(h => h.result === 'all_good').length;
    const needsAttention = history.filter(h => h.result === 'needs_attention').length;
    const concern = history.filter(h => h.result === 'concern').length;
    return { allGood, needsAttention, concern, total: history.length };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/school/parent/child/${childId}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Image
              src="/logo.png"
              alt="DentalScan"
              width={28}
              height={28}
              className="shrink-0"
            />
            <span className="text-lg font-bold text-gray-900">Scan History</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {childName}'s Scan History
          </h1>
          <p className="text-gray-600">
            View all past scan results and track progress over time
          </p>
        </div>

        {/* Stats Summary */}
        {history.length > 0 && (
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Scans</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.allGood}</div>
                  <div className="text-sm text-gray-600">All Good</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.needsAttention}</div>
                  <div className="text-sm text-gray-600">Needs Attention</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.concern}</div>
                  <div className="text-sm text-gray-600">Concern</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* History Timeline */}
        {history.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="pt-12 pb-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No scan history available yet.</p>
              <Button
                onClick={() => router.push(`/school/parent/child/${childId}`)}
              >
                View Latest Result
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => {
              const config = getResultConfig(item.result);
              const Icon = config.icon;
              return (
                <Card
                  key={item.id}
                  className={`shadow-md hover:shadow-lg transition-shadow cursor-pointer ${config.bgColor} ${config.borderColor} border-2`}
                  onClick={() => router.push(`/school/parent/child/${childId}`)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center ${config.borderColor} border-2`}>
                            <Icon className={`w-6 h-6 ${config.color}`} />
                          </div>
                          {index < history.length - 1 && (
                            <div className="w-0.5 h-8 bg-gray-300 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-lg">{config.label}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                              {config.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(item.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/school/parent/child/${childId}`);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => router.push(`/school/parent/child/${childId}`)}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Details
          </Button>
        </div>
      </main>
    </div>
  );
}


