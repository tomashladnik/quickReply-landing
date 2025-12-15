'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle2, School } from 'lucide-react';

type EnrollmentStep = 'code' | 'form' | 'success';

export default function ParentEnrollPage() {
  const router = useRouter();
  const [step, setStep] = useState<EnrollmentStep>('code');
  const [schoolCode, setSchoolCode] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form fields
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [classroom, setClassroom] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [digitalSignature, setDigitalSignature] = useState('');
  const [shareWithDentist, setShareWithDentist] = useState(false);
  const [dentistEmail, setDentistEmail] = useState('');

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement API call to verify school code
    // For now, simulate the flow
    setTimeout(() => {
      // Mock school name based on code
      setSchoolName(schoolCode.includes('PS') ? 'Parkview Elementary' : 
                    schoolCode.includes('WEST') ? 'Westview Middle School' : 
                    'Sample School');
      setStep('form');
      setIsLoading(false);
    }, 1000);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement API call to submit enrollment
    setTimeout(() => {
      setStep('success');
      setIsLoading(false);
    }, 1500);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3">
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

        <main className="max-w-md mx-auto px-4 sm:px-6 py-12">
          <Card className="shadow-lg">
            <CardContent className="pt-8 pb-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl mb-2">Enrollment Successful!</CardTitle>
              <CardDescription className="mb-6">
                {childName} has been successfully enrolled in the {schoolName} Tooth Check Program.
              </CardDescription>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/school/parent/dashboard')}
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep('code');
                    setSchoolCode('');
                    setSchoolName('');
                  }}
                  className="w-full"
                >
                  Enroll Another Child
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/school/parent')}
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
        {step === 'code' && (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <School className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl mb-2">Enter School Code</CardTitle>
              <CardDescription>
                Enter the unique code provided by your child's school
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolCode">School Code</Label>
                  <Input
                    id="schoolCode"
                    type="text"
                    placeholder="e.g., PS123-DSCAN"
                    value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                    required
                    className="w-full text-center text-lg font-mono"
                  />
                  <p className="text-xs text-gray-500 text-center">
                    This code was provided by your child's teacher or school
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !schoolCode}
                >
                  {isLoading ? 'Verifying...' : 'Continue'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'form' && (
          <div className="space-y-6">
            {/* School Branded Header */}
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">
                  Welcome to {schoolName} Tooth Check Program
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Complete the enrollment form to get started
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Enrollment Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Enrollment & Consent Form</CardTitle>
                <CardDescription>
                  Please provide the following information to enroll your child
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  {/* Parent Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Parent Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="parentName">Parent/Guardian Full Name *</Label>
                      <Input
                        id="parentName"
                        type="text"
                        placeholder="John Doe"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parentEmail">Parent Email *</Label>
                      <Input
                        id="parentEmail"
                        type="email"
                        placeholder="parent@example.com"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parentPhone">Parent Phone Number *</Label>
                      <Input
                        id="parentPhone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Child Information */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold text-lg border-b pb-2">Child Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="childName">Child Full Name *</Label>
                      <Input
                        id="childName"
                        type="text"
                        placeholder="Jane Doe"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="classroom">Classroom / Grade *</Label>
                      <Input
                        id="classroom"
                        type="text"
                        placeholder="Grade 3 - Room 2"
                        value={classroom}
                        onChange={(e) => setClassroom(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Consent Section */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold text-lg border-b pb-2">Consent & Authorization</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signature">Digital Signature *</Label>
                      <Input
                        id="signature"
                        type="text"
                        placeholder="Type your full name to sign"
                        value={digitalSignature}
                        onChange={(e) => setDigitalSignature(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">
                        By typing your name, you consent to the collection and processing of your child's dental scan data
                      </p>
                    </div>

                    <div className="flex items-start gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="consent"
                        required
                        className="mt-1"
                      />
                      <label htmlFor="consent" className="text-sm text-gray-700">
                        I consent to my child's participation in the DentalScan program and understand that this is a screening tool, not a medical diagnosis. *
                      </label>
                    </div>
                  </div>

                  {/* Optional Dentist Sharing */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="shareDentist"
                        checked={shareWithDentist}
                        onChange={(e) => setShareWithDentist(e.target.checked)}
                        className="mt-1"
                      />
                      <label htmlFor="shareDentist" className="text-sm font-medium text-gray-700">
                        Share scan results with my child's dentist (Optional)
                      </label>
                    </div>

                    {shareWithDentist && (
                      <div className="space-y-2 pl-6">
                        <Label htmlFor="dentistEmail">Dentist Email</Label>
                        <Input
                          id="dentistEmail"
                          type="email"
                          placeholder="dentist@example.com"
                          value={dentistEmail}
                          onChange={(e) => setDentistEmail(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Submitting...' : 'Submit Enrollment'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep('code')}
                      className="w-full"
                    >
                      Back
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}


