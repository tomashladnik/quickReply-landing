'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Share2, Calendar } from 'lucide-react';

type ScanResult = 'all_good' | 'needs_attention' | 'concern';

interface ScanData {
  id: string;
  date: string | null;
  result: ScanResult | null;
  childName: string;
  school: string;
  classroom: string;
}

export default function ChildResultPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.id as string;
  
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('parent_token');
    if (!token) {
      router.push('/school/parent');
      return;
    }

    const fetchScanData = async () => {
      try {
        const response = await fetch(`/api/school/parent/child/${childId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/school/parent');
            return;
          }
          throw new Error('Failed to fetch scan data');
        }

        const data = await response.json();
        
        if (!data || !data.name) {
          throw new Error('Invalid response from server');
        }
        
        if (data.latestScan && data.latestScan.scanDate) {
          setScanData({
            id: childId,
            date: data.latestScan.scanDate,
            result: data.latestScan.category || null,
            childName: data.name,
            school: data.school || 'Unknown School',
            classroom: data.className || data.grade || '',
          });
        } else {
          setScanData({
            id: childId,
            date: null,
            result: null,
            childName: data.name,
            school: data.school || 'Unknown School',
            classroom: data.className || data.grade || '',
          });
        }
      } catch (err: any) {
        console.error('Error fetching scan data:', err);
        // Set scanData to null to show error state
        setScanData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScanData();
  }, [childId, router]);

  const getResultConfig = (result: ScanResult | null) => {
    if (!result) {
      return {
        icon: Calendar,
        label: 'No Scans Yet',
        color: 'text-gray-500',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        explanation: {
          title: 'No scan results available',
          body: "Your child hasn't completed any tooth check scans yet. Once a scan is completed, the results will appear here.",
        },
      };
    }
    
    switch (result) {
      case 'all_good':
        return {
          icon: CheckCircle2,
          label: 'All Good',
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          explanation: {
            title: 'What this means',
            body: "This scan did not reveal any noticeable visual concerns in your child's teeth or gums. This is not a diagnosis, but an indication that nothing obviously abnormal was detected at this time. Continue regular brushing, flossing, and routine dental visits.",
          },
        };
      case 'needs_attention':
        return {
          icon: AlertTriangle,
          label: 'Needs Attention',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          explanation: {
            title: 'What this means',
            body: "This scan shows some visual indicators that may benefit from closer attention, such as possible plaque buildup, mild changes in gum appearance, or other non-specific patterns. This is not a diagnosis. We recommend scheduling a routine dental check-up to have a professional evaluate the findings.",
          },
        };
      case 'concern':
        return {
          icon: XCircle,
          label: 'Concern',
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          explanation: {
            title: 'What this means',
            body: "This scan shows visible changes that may represent a higher level of concern, such as pronounced discoloration or notable irregularities in certain areas. This is not a diagnosis. We strongly recommend having a dentist review this scan and your child's mouth in person as soon as it is practical.",
          },
        };
    }
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

  if (!scanData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Child not found or error loading data.</p>
          <Button onClick={() => router.push('/school/parent/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const config = getResultConfig(scanData.result);
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/school/parent/dashboard')}
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
            <span className="text-lg font-bold text-gray-900">Scan Result</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {scanData.childName} – Latest Tooth Check Result
          </h1>
          <p className="text-gray-600">
            {scanData.school}, {scanData.classroom}
          </p>
        </div>

        {/* Result Section */}
        <Card className={`shadow-lg mb-6 ${config.bgColor} ${config.borderColor} border-2`}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Icon className={`w-16 h-16 ${config.color} mx-auto`} />
            </div>
            <CardTitle className="text-3xl mb-2">
              Result: {config.label}
            </CardTitle>
            {scanData.date && (
              <CardDescription className="flex items-center justify-center gap-2 mt-2">
                <Calendar className="w-4 h-4" />
                <span>Scan Date: {new Date(scanData.date).toLocaleDateString()}</span>
              </CardDescription>
            )}
          </CardHeader>
        </Card>

        {/* Explanation Section */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-xl">{config.explanation.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {config.explanation.body}
            </p>
          </CardContent>
        </Card>

        {/* Next Steps Section */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span>Encourage good brushing and flossing habits</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span>Maintain regular dental check-ups</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span>If you have any concerns, contact your child's dentist</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => router.push(`/school/parent/child/${childId}/history`)}
            className="flex-1"
          >
            View Scan History
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/school/parent/child/${childId}/dentist`)}
            className="flex-1"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share with Dentist
          </Button>
          <Button
            onClick={() => router.push('/school/parent/dashboard')}
            className="flex-1"
          >
            Back to Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}


