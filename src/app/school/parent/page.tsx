'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Phone, ArrowLeft, CheckCircle2 } from 'lucide-react';

type AuthStep = 'email' | 'otp' | 'verified';

export default function ParentLoginPage() {
  const router = useRouter();
  const [authStep, setAuthStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [usePhone, setUsePhone] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in (you'll implement this with your auth system)
  useEffect(() => {
    const token = localStorage.getItem('parent_token');
    if (token) {
      router.push('/school/parent/dashboard');
    }
  }, [router]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/school/parent/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setAuthStep('otp');
    } catch (err: any) {
      alert(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/school/parent/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('parent_token', data.token);
        localStorage.setItem('parent_id', data.parentId);
      }

      setAuthStep('verified');
      setTimeout(() => {
        router.push('/school/parent/dashboard');
      }, 1000);
    } catch (err: any) {
      alert(err.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/school/parent/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send magic link');
      }

      alert('Magic link sent! Check your email.');
    } catch (err: any) {
      alert(err.message || 'Failed to send magic link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/school')}
              className="mr-auto"
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
            <span className="text-lg font-bold text-gray-900">Parent Portal</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">Welcome Back</CardTitle>
            <CardDescription>
              {authStep === 'email' && 'Enter your email or phone to continue'}
              {authStep === 'otp' && 'Enter the verification code sent to your device'}
              {authStep === 'verified' && 'Login successful! Redirecting...'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {authStep === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    type="button"
                    variant={!usePhone ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setUsePhone(false)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={usePhone ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setUsePhone(true)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Phone
                  </Button>
                </div>

                {!usePhone ? (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="parent@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || (!email && !phone)}
                >
                  {isLoading ? 'Sending...' : 'Continue'}
                </Button>

                {!usePhone && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleMagicLink}
                    disabled={isLoading || !email}
                  >
                    Send Magic Link Instead
                  </Button>
                )}

                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">
                    New to DentalScan?{' '}
                    <button
                      type="button"
                      onClick={() => router.push('/school/parent/enroll')}
                      className="text-primary hover:underline font-medium"
                    >
                      Enroll your child
                    </button>
                  </p>
                </div>
              </form>
            )}

            {authStep === 'otp' && (
              <form onSubmit={handleOTPSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    required
                    className="w-full text-center text-2xl tracking-widest"
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Code sent to {usePhone ? phone : email}
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? 'Verifying...' : 'Verify & Login'}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthStep('email');
                      setOtp('');
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Change email/phone
                  </button>
                  <span className="mx-2 text-gray-400">|</span>
                  <button
                    type="button"
                    onClick={handleEmailSubmit}
                    className="text-sm text-primary hover:underline"
                  >
                    Resend code
                  </button>
                </div>
              </form>
            )}

            {authStep === 'verified' && (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900">Login Successful!</p>
                <p className="text-sm text-gray-600 mt-2">Redirecting to dashboard...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

