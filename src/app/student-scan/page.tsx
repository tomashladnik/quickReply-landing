'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StudentImageCapture from '@/components/StudentImageCapture';

interface ScanResult {
  category: string | null;
  message: string;
}

export default function StudentScan() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await fetch('/api/student/logout', {
        method: 'POST',
      });
      router.push('/student/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      try {
        // Get scan token
        const tokenRes = await fetch('/api/student/token');
        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          setToken(tokenData.token);
        }

        // Fetch result
        const resultRes = await fetch('/api/student/result');
        if (resultRes.ok) {
          const resultData = await resultRes.json();
          setResult(resultData);
        }
      } catch (err) {
        console.error('Failed to initialize:', err);
      } finally {
        setLoading(false);
      }
    };
    initializePage();
  }, []);

  const handleComplete = () => {
    // Refresh result after scan completion
    fetch('/api/student/result')
      .then(res => res.ok ? res.json() : null)
      .then(data => setResult(data))
      .catch(err => console.error('Failed to fetch result:', err));
  };

  const handleStartNewScan = () => {
    setResult(null); // Clear the result to show capture interface
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!token) {
    return <div className="min-h-screen flex items-center justify-center">Authentication failed</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Student Dental Scan</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Show either result view or capture view */}
        {result ? (
          /* Result View */
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Latest Scan Result</h2>
            <div className="text-center">
              <p className="text-lg font-medium">
                Category: <span className={`font-bold ${
                  result.category === 'All Good' ? 'text-green-600' :
                  result.category === 'Needs Attention' ? 'text-yellow-600' :
                  result.category === 'Concern' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {result.category || 'Processing...'}
                </span>
              </p>
              <p className="text-sm text-gray-600 mt-2">{result.message}</p>

              <div className="mt-6">
                <button
                  onClick={handleStartNewScan}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Start New Scan
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Camera Capture Section */
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Capture Dental Images</h2>

            <StudentImageCapture
              token={token}
              onComplete={handleComplete}
              onBack={() => window.history.back()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
