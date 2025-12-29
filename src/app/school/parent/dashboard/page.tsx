'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Calendar,
  Settings,
  History,
  Share2,
  LogOut
} from 'lucide-react';

type ScanResult = 'all_good' | 'needs_attention' | 'concern';

interface Child {
  id: string;
  name: string;
  school: string;
  className: string;
  grade: string;
  latestScanDate: string | null;
  latestCategory: ScanResult | null;
}

export default function ParentDashboardPage() {
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('parent_token');
    if (!token) {
      router.push('/school/parent');
      return;
    }

    const fetchChildren = async () => {
      try {
        const response = await fetch('/api/school/parent/children', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('parent_token');
            localStorage.removeItem('parent_id');
            router.push('/school/parent');
            return;
          }
          throw new Error('Failed to fetch children');
        }

        const data = await response.json();
        setChildren(data.children || []);
      } catch (err: any) {
        console.error('Error fetching children:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, [router]);

  const getResultIcon = (result: ScanResult | null) => {
    if (!result) return null;
    switch (result) {
      case 'all_good':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'needs_attention':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'concern':
        return <XCircle className="w-6 h-6 text-red-500" />;
    }
  };

  const getResultLabel = (result: ScanResult | null) => {
    if (!result) return 'No scans yet';
    switch (result) {
      case 'all_good':
        return 'All Good';
      case 'needs_attention':
        return 'Needs Attention';
      case 'concern':
        return 'Concern';
    }
  };

  const getResultColor = (result: ScanResult | null) => {
    if (!result) return 'bg-gray-100 text-gray-600';
    switch (result) {
      case 'all_good':
        return 'bg-green-100 text-green-700';
      case 'needs_attention':
        return 'bg-yellow-100 text-yellow-700';
      case 'concern':
        return 'bg-red-100 text-red-700';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('parent_token');
    router.push('/school/parent');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/school')}
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
              <span className="text-lg font-bold text-gray-900">Parent Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/school/parent/settings')}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            My Children
          </h1>
          <p className="text-gray-600">
            View scan results and manage your children's dental health
          </p>
        </div>

        {children.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-gray-600 mb-4">No children enrolled yet.</p>
              <Button
                onClick={() => router.push('/school/parent/enroll')}
              >
                Enroll Your First Child
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {children.map((child) => (
              <Card
                key={child.id}
                className="shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/school/parent/child/${child.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{child.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <span>{child.school}</span>
                        <span>•</span>
                        <span>{child.className || child.grade}</span>
                      </CardDescription>
                    </div>
                    {getResultIcon(child.latestCategory)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getResultColor(child.latestCategory)}`}>
                          {getResultLabel(child.latestCategory)}
                        </span>
                      </div>
                      {child.latestScanDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Last scan: {new Date(child.latestScanDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/school/parent/child/${child.id}/history`);
                        }}
                      >
                        <History className="w-4 h-4 mr-2" />
                        History
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/school/parent/child/${child.id}`);
                        }}
                      >
                        View Details
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6">
          <Button
            onClick={() => router.push('/school/parent/enroll')}
            className="w-full sm:w-auto"
          >
            Enroll Another Child
          </Button>
        </div>
      </main>
    </div>
  );
}

