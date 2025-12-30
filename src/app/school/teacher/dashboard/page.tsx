'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SchoolClass {
  id: string;
  name: string;
}

interface Student {
  id: string;
  name: string;
  parentConsent: boolean;
  scanCompleted: boolean;
}

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [roster, setRoster] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('teacher_token')
      : null;

  // Auth guard + fetch classes
  useEffect(() => {
    if (!token) {
      router.push('/school/teacher');
      return;
    }

    fetch('/api/teacher/classes', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setClasses(data))
      .catch(() => alert('Failed to load classes'))
      .finally(() => setLoading(false));
  }, [router, token]);

  const loadRoster = async (cls: SchoolClass) => {
    setSelectedClass(cls);

    const res = await fetch(
      `/api/teacher/classes/${cls.id}/roster`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    setRoster(data);
  };

  const exportCSV = async () => {
    if (!selectedClass) return;

    const res = await fetch(
      `/api/teacher/classes/${selectedClass.id}/participation`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'class_participation.csv';
    a.click();

    URL.revokeObjectURL(url);
  };

  const logout = () => {
    localStorage.removeItem('teacher_token');
    router.push('/school/teacher');
  };

  if (loading) {
    return <p className="p-8">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Classes */}
        <Card>
          <CardHeader>
            <CardTitle>Your Classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {classes.map((cls) => (
              <Button
                key={cls.id}
                variant={selectedClass?.id === cls.id ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => loadRoster(cls)}
              >
                {cls.name}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Roster */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>
              {selectedClass ? selectedClass.name : 'Select a class'}
            </CardTitle>
            {selectedClass && (
              <Button size="sm" onClick={exportCSV}>
                Export CSV
              </Button>
            )}
          </CardHeader>

          <CardContent>
            {!selectedClass && <p>Select a class to view students</p>}

            {selectedClass && (
              <table className="w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Student</th>
                    <th className="p-2">Consent</th>
                    <th className="p-2">Scan Done</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map((s) => (
                    <tr key={s.id} className="border-t">
                      <td className="p-2">{s.name}</td>
                      <td className="p-2 text-center">
                        {s.parentConsent ? 'Yes' : 'No'}
                      </td>
                      <td className="p-2 text-center">
                        {s.scanCompleted ? 'Yes' : 'No'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
