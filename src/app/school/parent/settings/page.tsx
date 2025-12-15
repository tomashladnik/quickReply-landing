'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Settings, Shield, Mail, Phone, Trash2, AlertTriangle, LogOut } from 'lucide-react';

interface ConsentStatus {
  active: boolean;
  lastUpdated: string;
  children: string[];
}

export default function ParentSettingsPage() {
  const router = useRouter();
  const [consentStatus, setConsentStatus] = useState<ConsentStatus | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferEmail, setPreferEmail] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // TODO: Fetch settings from API
    setTimeout(() => {
      setConsentStatus({
        active: true,
        lastUpdated: '2024-01-01',
        children: ['Emma Doe', 'Lucas Doe'],
      });
      setEmail('parent@example.com');
      setPhone('+1 (555) 123-4567');
      setPreferEmail(true);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSavePreferences = async () => {
    setIsLoading(true);
    // TODO: Implement API call to save preferences
    setTimeout(() => {
      alert('Preferences saved successfully!');
      setIsLoading(false);
    }, 500);
  };

  const handleRevokeConsent = async () => {
    if (!confirm('Are you sure you want to revoke consent? This will prevent your children from participating in the program.')) {
      return;
    }

    setIsLoading(true);
    // TODO: Implement API call to revoke consent
    setTimeout(() => {
      setConsentStatus({
        ...consentStatus!,
        active: false,
        lastUpdated: new Date().toISOString(),
      });
      alert('Consent has been revoked. Your children will no longer be able to participate.');
      setIsLoading(false);
    }, 1000);
  };

  const handleRequestDeletion = async () => {
    if (!confirm('Are you sure you want to request data deletion? This action cannot be undone and all your data will be permanently deleted.')) {
      setShowDeleteConfirm(false);
      return;
    }

    setIsDeleting(true);
    // TODO: Implement API call to request deletion
    setTimeout(() => {
      alert('Data deletion request submitted. You will receive a confirmation email shortly.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      // Logout after deletion request
      localStorage.removeItem('parent_token');
      router.push('/school/parent');
    }, 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('parent_token');
    router.push('/school/parent');
  };

  if (isLoading && !consentStatus) {
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
            <span className="text-lg font-bold text-gray-900">Settings</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600">
            Manage your account preferences and consent settings
          </p>
        </div>

        {/* Consent Status */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Consent Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    Status: {consentStatus?.active ? 'Active' : 'Revoked'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Last updated: {consentStatus?.lastUpdated ? new Date(consentStatus.lastUpdated).toLocaleDateString() : 'N/A'}
                  </p>
                  {consentStatus?.children && consentStatus.children.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      Children enrolled: {consentStatus.children.join(', ')}
                    </p>
                  )}
                </div>
                {consentStatus?.active ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">Revoked</span>
                  </div>
                )}
              </div>

              {consentStatus?.active && (
                <Button
                  variant="destructive"
                  onClick={handleRevokeConsent}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  Revoke Consent
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Communication Preferences */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Communication Preferences
            </CardTitle>
            <CardDescription>
              Choose how you'd like to receive notifications and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleSavePreferences(); }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-3 pt-2">
                <Label>Preferred Communication Method</Label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="preference"
                      checked={preferEmail}
                      onChange={() => setPreferEmail(true)}
                      className="cursor-pointer"
                    />
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="preference"
                      checked={!preferEmail}
                      onChange={() => setPreferEmail(false)}
                      className="cursor-pointer"
                    />
                    <Phone className="w-4 h-4" />
                    <span>SMS/Text Message</span>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Save Preferences
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="shadow-lg mb-6 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Request deletion of your account and all associated data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-red-900 mb-1">Warning: Permanent Action</p>
                    <p className="text-sm text-red-700">
                      Requesting data deletion will permanently remove all your account data, 
                      including your children's enrollment, scan history, and all associated records. 
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              {!showDeleteConfirm ? (
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Request Data Deletion
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-900">
                    Are you absolutely sure? This cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={handleRequestDeletion}
                      disabled={isDeleting}
                      className="flex-1"
                    >
                      {isDeleting ? 'Processing...' : 'Yes, Delete My Data'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


