'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentLoginPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  
  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login failed");
      }

      const data = await res.json();
      router.push("/student-scan");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/student/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupEmail,
          password: signupPassword,
          name: signupName,
          schoolId,
          parentName,
          parentPhone,
          parentEmail: parentEmail || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Registration failed");
      }

      const data = await res.json();
      router.push("/student-scan");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <div className="flex gap-4 mb-6 border-b">
          <button
            type="button"
            onClick={() => {
              setIsSignup(false);
              setError(null);
            }}
            className={`flex-1 py-2 text-sm font-medium ${
              !isSignup
                ? 'text-[#4ebff7] border-b-2 border-[#4ebff7]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignup(true);
              setError(null);
            }}
            className={`flex-1 py-2 text-sm font-medium ${
              isSignup
                ? 'text-[#4ebff7] border-b-2 border-[#4ebff7]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Create Account
          </button>
        </div>

        {!isSignup ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <h1 className="text-2xl font-semibold text-center mb-4">
              Student Login
            </h1>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ebff7]"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ebff7]"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4ebff7] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#3da9e0] disabled:opacity-60 transition-colors"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <h1 className="text-2xl font-semibold text-center mb-4">
              Create Student Account
            </h1>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="signupName">
                Student Name
              </label>
              <input
                id="signupName"
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ebff7]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="signupEmail">
                Email
              </label>
              <input
                id="signupEmail"
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ebff7]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="signupPassword">
                Password
              </label>
              <input
                id="signupPassword"
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ebff7]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="schoolId">
                School ID
              </label>
              <input
                id="schoolId"
                type="text"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ebff7]"
                placeholder="Enter your school ID"
                required
              />
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm font-medium mb-3">Parent Information</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="parentName">
                    Parent Name
                  </label>
                  <input
                    id="parentName"
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ebff7]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="parentPhone">
                    Parent Phone
                  </label>
                  <input
                    id="parentPhone"
                    type="tel"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ebff7]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="parentEmail">
                    Parent Email (Optional)
                  </label>
                  <input
                    id="parentEmail"
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ebff7]"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4ebff7] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#3da9e0] disabled:opacity-60 transition-colors"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}


