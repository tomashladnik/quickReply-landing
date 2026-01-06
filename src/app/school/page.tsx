'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, UserCheck, Shield } from 'lucide-react';

export default function SchoolPortalPage() {
  const router = useRouter();

  const portalOptions = [
    {
      id: 'parent',
      title: 'Parent',
      description: 'Enroll your child, view scan results, and manage consent',
      icon: Users,
      route: '/school/parent',
      color: 'bg-blue-500',
    },
    {
      id: 'student',
      title: 'Student',
      description: 'Complete your tooth check scan',
      icon: GraduationCap,
      route: '/school/student',
      color: 'bg-green-500',
    },
    {
      id: 'teacher',
      title: 'Teacher',
      description: 'Monitor class participation and consent status',
      icon: UserCheck,
      route: '/school/teacher',
      color: 'bg-purple-500',
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'School and district-level analytics and oversight',
      icon: Shield,
      route: '/school/admin',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="DentalScan"
              width={32}
              height={32}
              className="shrink-0"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">DentalScan</h1>
              <p className="text-xs text-gray-600">School Portal</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Welcome to DentalScan School Portal
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Select your role to access the appropriate portal
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {portalOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card
                key={option.id}
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary"
                onClick={() => router.push(option.route)}
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`${option.color} p-3 rounded-lg text-white`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{option.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(option.route);
                    }}
                  >
                    Enter Portal
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-sm text-gray-500">
            Secure, compliant, and designed for school environments
          </p>
        </div>
      </main>
    </div>
  );
}


