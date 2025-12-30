'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, LogOut } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  consent: boolean;
  scanned: boolean;
}

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem('teacher_token');
    if (!token) {
      router.push('/school/teacher');
      return;
    }

    // TODO: Fetch class roster from API
    setTimeout(() => {
      setStudents([
        { id: '1', name: 'Emma Doe', consent: true, scanned: true },
        { id: '2', name: 'Liam Smith', consent: false, scanned: false },
        { id: '3', name: 'Olivia Brown', consent: true, scanned: false },
      ]);
      setLoading(false);
    }, 600);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('teacher_token');
    router.push('/school/teacher');
  };

  const exportCSV = () => {
    const rows = [
      ['Student Name', 'Parent Consent', 'Scan Completed'],
      ...students.map((s) => [
        s.name,
        s.consent ? 'Yes' : 'No',
        s.scanned ? 'Completed' : 'Not Completed',
      ]),
    ];

    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'class_participation.csv';
    a.click();
  };

  if (loading) {
    return <div className="p-10 text-center">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push('/school')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Image src="/logo.png" alt="DentalScan" width={28} height={28} />
            <span className="text-lg font-bold">Teacher Dashboard</span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Roster</CardTitle>
          </CardHeader>

          <CardContent>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 px-3">Student Name</th>
                  <th className="py-2 px-3">Parent Consent</th>
                  <th className="py-2 px-3">Scan Status (This Month)</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b">
                    <td className="py-3 px-3">{s.name}</td>
                    <td className="py-3 px-3">{s.consent ? 'Yes' : 'No'}</td>
                    <td className="py-3 px-3">
                      {s.scanned ? 'Completed' : 'Not Completed'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
