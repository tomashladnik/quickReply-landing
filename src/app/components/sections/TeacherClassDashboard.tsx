'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

type Student = {
  id: string;
  name: string;
  consent: boolean;
  scanned: boolean;
};

export default function TeacherClassDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulated API call (replace with real API when backend is ready)
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setStudents([
        { id: '1', name: 'Emma Doe', consent: true, scanned: true },
        { id: '2', name: 'Liam Smith', consent: false, scanned: false },
        { id: '3', name: 'Olivia Brown', consent: true, scanned: false },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // CSV export (participation-only, compliant with docs)
  const exportCSV = () => {
    const header = ['Student Name', 'Parent Consent', 'Scan Status'];

    const rows = students.map((s) => [
      s.name,
      s.consent ? 'Yes' : 'No',
      s.scanned ? 'Completed' : 'Not Completed',
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'class_participation.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Grade 3 – Room 2
            </h1>
            <p className="text-sm text-gray-600">
              Teacher dashboard · participation overview only
            </p>
          </div>

          <Button
            variant="outline"
            onClick={exportCSV}
            disabled={students.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Roster Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Roster</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Loading state */}
            {loading && (
              <p className="text-sm text-gray-500">
                Loading class roster…
              </p>
            )}

            {/* Empty state */}
            {!loading && students.length === 0 && (
              <p className="text-sm text-gray-500">
                No students enrolled in this class yet.
              </p>
            )}

            {/* Data table */}
            {!loading && students.length > 0 && (
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
                      <td className="py-3 px-3 font-medium">{s.name}</td>
                      <td className="py-3 px-3">
                        {s.consent ? 'Yes' : 'No'}
                      </td>
                      <td className="py-3 px-3">
                        {s.scanned ? 'Completed' : 'Not Completed'}
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
