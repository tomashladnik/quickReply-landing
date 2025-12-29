'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Share2, CheckCircle2, XCircle, Mail, UserX } from 'lucide-react';

type SharingStatus = 'not_shared' | 'invite_sent' | 'active' | 'revoked';

interface DentistSharing {
  status: SharingStatus;
  dentistEmail: string | null;
  dentistName: string | null;
  invitedAt: string | null;
  activatedAt: string | null;
}

export default function DentistSharingPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.id as string;
  
  const [childName, setChildName] = useState('');
  const [sharing, setSharing] = useState<DentistSharing>({
    status: 'not_shared',
    dentistEmail: null,
    dentistName: null,
    invitedAt: null,
    activatedAt: null,
  });
  const [dentistEmail, setDentistEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('parent_token');
    if (!token) {
      router.push('/school/parent');
      return;
    }

    const fetchSharing = async () => {
      try {
        const response = await fetch(`/api/school/parent/child/${childId}/dentist`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/school/parent');
            return;
          }
          throw new Error('Failed to fetch sharing status');
        }

        const data = await response.json();
        
        if (!data || !data.child || !data.child.name) {
          throw new Error('Invalid response from server');
        }
        
        setChildName(data.child.name);
        
        if (data.shares && Array.isArray(data.shares) && data.shares.length > 0) {
          const activeShare = data.shares.find((s: any) => s.isActive);
          if (activeShare) {
            setSharing({
              status: 'active',
              dentistEmail: activeShare.dentistEmail || null,
              dentistName: activeShare.dentistName || null,
              invitedAt: activeShare.createdAt || null,
              activatedAt: activeShare.activatedAt || null,
            });
          } else {
            setSharing({
              status: 'revoked',
              dentistEmail: data.shares[0]?.dentistEmail || null,
              dentistName: data.shares[0]?.dentistName || null,
              invitedAt: data.shares[0]?.createdAt || null,
              activatedAt: null,
            });
          }
        } else {
          setSharing({
            status: 'not_shared',
            dentistEmail: null,
            dentistName: null,
            invitedAt: null,
            activatedAt: null,
          });
        }
      } catch (err: any) {
        console.error('Error fetching sharing status:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchSharing();
  }, [childId, router]);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dentistEmail) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('parent_token');
      const response = await fetch(`/api/school/parent/child/${childId}/dentist/share`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dentistEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invite');
      }

      setSharing({
        status: 'invite_sent',
        dentistEmail: dentistEmail,
        dentistName: null,
        invitedAt: new Date().toISOString(),
        activatedAt: null,
      });
      setDentistEmail('');
      alert('Invite sent successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to send invite');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeAccess = async () => {
    if (!confirm('Are you sure you want to revoke dentist access? They will no longer be able to view this child\'s reports.')) {
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('parent_token');
      // Find the active share ID - you may need to store this in state
      const response = await fetch(`/api/school/parent/child/${childId}/dentist`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch sharing status');
      }
      
      const data = await response.json();
      
      if (!data || !data.shares || !Array.isArray(data.shares)) {
        throw new Error('Invalid response from server');
      }
      
      const activeShare = data.shares.find((s: any) => s.isActive);
      
      if (activeShare) {
        const revokeResponse = await fetch(`/api/school/parent/child/${childId}/dentist/revoke`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ shareId: activeShare.id }),
        });

        if (!revokeResponse.ok) {
          throw new Error('Failed to revoke access');
        }

        setSharing({
          status: 'revoked',
          dentistEmail: activeShare.dentistEmail,
          dentistName: activeShare.dentistName || null,
          invitedAt: activeShare.createdAt,
          activatedAt: null,
        });
        alert('Access revoked successfully');
      } else {
        throw new Error('No active share found');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to revoke access');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReEnable = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('parent_token');
      // Re-enable sharing by creating a new share with the same dentist
      if (sharing.dentistEmail) {
        const response = await fetch(`/api/school/parent/child/${childId}/dentist/share`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ dentistEmail: sharing.dentistEmail }),
        });

        if (!response.ok) {
          throw new Error('Failed to re-enable sharing');
        }

        setSharing({
          ...sharing,
          status: 'active',
          activatedAt: new Date().toISOString(),
        });
        alert('Sharing re-enabled successfully');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to re-enable sharing');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
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
            <span className="text-lg font-bold text-gray-900">Dentist Sharing</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Share {childName}'s Reports with Dentist
          </h1>
          <p className="text-gray-600">
            Grant your child's dentist access to view full diagnostic reports
          </p>
        </div>

        {/* Current Status */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Sharing Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sharing.status === 'not_shared' && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <XCircle className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Not Shared</p>
                    <p className="text-sm text-gray-600">No dentist has access to this child's reports</p>
                  </div>
                </div>
              )}

              {sharing.status === 'invite_sent' && (
                <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Mail className="w-6 h-6 text-yellow-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Invite Sent</p>
                    <p className="text-sm text-gray-600">
                      Invitation sent to {sharing.dentistEmail}. Waiting for dentist to accept.
                    </p>
                    {sharing.invitedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Sent on {new Date(sharing.invitedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {sharing.status === 'active' && (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Access Active</p>
                    <p className="text-sm text-gray-600">
                      {sharing.dentistName || sharing.dentistEmail} has access to view full reports
                    </p>
                    {sharing.activatedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Activated on {new Date(sharing.activatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {sharing.status === 'revoked' && (
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                  <UserX className="w-6 h-6 text-red-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Access Revoked</p>
                    <p className="text-sm text-gray-600">
                      Dentist access has been revoked. They can no longer view reports.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Share Form */}
        {sharing.status === 'not_shared' || sharing.status === 'revoked' ? (
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle>Send Dentist Invite</CardTitle>
              <CardDescription>
                Enter your dentist's email address to send them a secure invitation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendInvite} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dentistEmail">Dentist Email Address</Label>
                  <Input
                    id="dentistEmail"
                    type="email"
                    placeholder="dentist@example.com"
                    value={dentistEmail}
                    onChange={(e) => setDentistEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500">
                    The dentist will receive a secure invitation link to create an account and access reports
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !dentistEmail}
                >
                  {isLoading ? 'Sending...' : 'Send Secure Invite'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : null}

        {/* Re-enable Option */}
        {sharing.status === 'revoked' && (
          <Card className="shadow-lg mb-6">
            <CardContent className="pt-6">
              <Button
                onClick={handleReEnable}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                Re-enable Sharing
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Revoke Access */}
        {(sharing.status === 'active' || sharing.status === 'invite_sent') && (
          <Card className="shadow-lg mb-6 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Revoke Access</CardTitle>
              <CardDescription>
                Remove dentist access to this child's reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleRevokeAccess}
                variant="destructive"
                className="w-full"
                disabled={isLoading}
              >
                <UserX className="w-4 h-4 mr-2" />
                Revoke Access
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Information Card */}
        <Card className="shadow-lg bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm">About Dentist Sharing</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span>Dentists can view full diagnostic reports with detailed clinical information</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span>You can revoke access at any time</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span>All access is logged for compliance and security</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => router.push(`/school/parent/child/${childId}`)}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Result
          </Button>
        </div>
      </main>
    </div>
  );
}


