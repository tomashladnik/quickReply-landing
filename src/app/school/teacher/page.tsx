'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

type AuthStep = 'email' | 'otp' | 'verified';

export default function TeacherLoginPage() {
  const router = useRouter();
  const [authStep, setAuthStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('teacher_token');
    if (token) {
      router.push('/school/teacher/dashboard');
    }
  }, [router]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: API → send OTP
    setTimeout(() => {
      setAuthStep('otp');
      setIsLoading(false);
    }, 800);
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: API → verify OTP
    setTimeout(() => {
      localStorage.setItem('teacher_token', 'demo_teacher_token');
      setAuthStep('verified');
      setIsLoading(false);
      setTimeout(() => {
        router.push('/school/teacher/dashboard');
      }, 800);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
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
            <Image src="/logo.png" alt="DentalScan" width={28} height={28} />
            <span className="text-lg font-bold">Teacher Portal</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 py-10">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">Welcome Back</CardTitle>
            <CardDescription>
              {authStep === 'email' && 'Enter your school email'}
              {authStep === 'otp' && 'Enter the verification code'}
              {authStep === 'verified' && 'Login successful'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {authStep === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="teacher@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Continue'}
                </Button>
              </form>
            )}

            {authStep === 'otp' && (
              <form onSubmit={handleOTPSubmit} className="space-y-4">
                <Label>Verification Code</Label>
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                  required
                />
                <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                  Verify & Login
                </Button>
              </form>
            )}

            {authStep === 'verified' && (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                Redirecting to dashboard…
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
