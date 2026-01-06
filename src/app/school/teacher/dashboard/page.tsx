'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SchoolClass {
  id: string;
  name: string;
}

interface RosterRow {
  id: string;
  name: string;
  consent: boolean;
  scanDone: boolean;
}

export default function TeacherDashboardPage() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [roster, setRoster] = useState<RosterRow[]>([]);

  useEffect(() => {
    const t = localStorage.getItem('teacher_token');
    if (!t) {
      router.push('/school/teacher');
      return;
    }
    setToken(t);
  }, [router]);

  useEffect(() => {
    if (!token) return;

    fetch('/api/teacher/classes', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setClasses(Array.isArray(data.classes) ? data.classes : []);
      })
      .catch(() => alert('Failed to load classes'))
      .finally(() => setLoading(false));
  }, [token]);

const loadRoster = async (cls: SchoolClass) => {
  setSelectedClass(cls);
  setRoster([]);

  const res = await fetch(
    `/api/teacher/classes/${cls.id}/roster`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await res.json();

const mapped: RosterRow[] = (data.students ?? []).map((row: any) => ({
  id: row.id,
  name: row.name ?? 'Unknown Student',
  consent: Boolean(row.consent),
  scanDone: row.scanStatus === 'completed',
}));


  setRoster(mapped);
};


  const exportCSV = async () => {
    if (!selectedClass) return;

    const res = await fetch(
      `/api/teacher/classes/${selectedClass.id}/participation`,
      { headers: { Authorization: `Bearer ${token}` } }
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
        <Button variant="outline" onClick={logout}>Logout</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Classes */}
        <Card>
          <CardHeader>
            <CardTitle>Your Classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {classes.length === 0 && (
              <p className="text-sm text-gray-500">No classes found</p>
            )}

            {classes.map((cls) => (
              <Button
                key={cls.id}
                className="w-full justify-start"
                variant={selectedClass?.id === cls.id ? 'default' : 'outline'}
                onClick={() => loadRoster(cls)}
              >
                {cls.name}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>
              {selectedClass ? selectedClass.name : 'Select a class'}
            </CardTitle>
            {selectedClass && (
              <Button size="sm" onClick={exportCSV}>Export CSV</Button>
            )}
          </CardHeader>

          <CardContent>
            {!selectedClass && (
              <p>Select a class to view students</p>
            )}

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
                  {roster.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-gray-500">
                        No students found
                      </td>
                    </tr>
                  )}

                  {roster.map((s) => (
                    <tr key={s.id} className="border-t">
                      <td className="p-2">{s.name}</td>
                      <td className="p-2 text-center">{s.consent ? 'Yes' : 'No'}</td>
                      <td className="p-2 text-center">{s.scanDone ? 'Yes' : 'No'}</td>
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
