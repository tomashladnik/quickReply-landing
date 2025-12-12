'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { User, Mail, Phone, Calendar, ArrowRight, Sparkles, Heart, GraduationCap, Dumbbell } from 'lucide-react';
import Image from 'next/image';

type FlowType = 'gym' | 'school' | 'charity';

interface FormData {
  name: string;
  dateOfBirth: string;
  phone: string;
  email?: string;
}

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const type = (searchParams.get('flowType') || searchParams.get('type') || 'gym') as FlowType;
  const token = searchParams.get('token') || 'multiuse-token';
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    dateOfBirth: '',
    phone: '',
    email: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Flow-specific configuration
  const flowConfig = {
    gym: {
      icon: Dumbbell,
      title: 'Gym Dental Scan',
      subtitle: 'Athlete-Friendly Teeth Assessment',
      primaryColor: 'from-[#4ebff7] to-[#3da8d9]',
      bgColor: 'from-gray-50 to-blue-50',
      accentColor: 'bg-[#4ebff7]',
      focusColor: 'focus:border-[#4ebff7] focus:ring-[#4ebff7]',
      textColor: 'text-[#4ebff7]',
    },
    school: {
      icon: GraduationCap,
      title: 'School Dental Checkup',
      subtitle: 'Student Dental Health Screening',
      primaryColor: 'from-[#4ebff7] to-[#3da8d9]',
      bgColor: 'from-gray-50 to-blue-50',
      accentColor: 'bg-[#4ebff7]',
      focusColor: 'focus:border-[#4ebff7] focus:ring-[#4ebff7]',
      textColor: 'text-[#4ebff7]',
    },
    charity: {
      icon: Heart,
      title: 'Charity Dental Screening',
      subtitle: 'Free Dental Health Assessment',
      primaryColor: 'from-[#4ebff7] to-[#3da8d9]',
      bgColor: 'from-gray-50 to-blue-50',
      accentColor: 'bg-[#4ebff7]',
      focusColor: 'focus:border-[#4ebff7] focus:ring-[#4ebff7]',
      textColor: 'text-[#4ebff7]',
    },
  };

  const config = flowConfig[type];
  const IconComponent = config.icon;

  // Format phone number as user types (US format)
  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '');
    
    if (phoneNumber.length === 0) return '';
    if (phoneNumber.length <= 3) return `(${phoneNumber}`;
    if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
    if (errors.phone) setErrors({ ...errors, phone: '' });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      if (dob >= today) {
        newErrors.dateOfBirth = 'Date of birth must be in the past';
      }
    }
    
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!phoneDigits) {
      newErrors.phone = 'Phone number is required';
    } else if (phoneDigits.length !== 10) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/multiuse/patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.name,
          dateOfBirth: formData.dateOfBirth,
          phone: formData.phone,
          email: formData.email,
          flow: type,
          scanId: token
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Navigate to appropriate next page based on type
        const redirectUrl = `/multiusecase/${type}/capture?token=${encodeURIComponent(token || 'multiuse-token')}&userId=${encodeURIComponent(result.id)}`;
        router.push(redirectUrl);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Registration failed: ${errorMessage}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-linear-to-br ${config.bgColor}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-linear-to-br ${config.primaryColor} rounded-2xl flex items-center justify-center shadow-lg`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{config.title}</h1>
              <p className="text-sm text-gray-600">{config.subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Welcome Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-6">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 bg-linear-to-br ${config.primaryColor} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome! Let's Get Started
            </h2>
            <p className="text-gray-600">
              Please provide your information to begin your dental scan
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 ${config.accentColor} text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                1
              </div>
              <span className={`text-sm font-medium ${config.textColor}`}>Details</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="text-sm font-medium text-gray-400">Capture</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="text-sm font-medium text-gray-400">Results</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-colors ${
                    errors.name
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : `border-gray-200 ${config.focusColor}`
                  } focus:outline-none focus:ring-2`}
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email (Optional) */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-gray-400 text-xs font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@example.com"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 ${config.focusColor} focus:outline-none focus:ring-2 transition-colors`}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="(555) 123-4567"
                  maxLength={14}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-colors ${
                    errors.phone
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : `border-gray-200 ${config.focusColor}`
                  } focus:outline-none focus:ring-2`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-colors ${
                    errors.dateOfBirth
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : `border-gray-200 ${config.focusColor}`
                  } focus:outline-none focus:ring-2`}
                />
              </div>
              {errors.dateOfBirth && (
                <p className="mt-1.5 text-sm text-red-600">{errors.dateOfBirth}</p>
              )}
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs text-blue-900 leading-relaxed">
                <strong>Privacy Notice:</strong> Your information is stored securely and will be used only for this dental scan session. We respect your privacy and do not share your data with third parties.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-linear-to-r ${config.primaryColor} text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Registering...
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Continue to Photo Capture
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-linear-to-br from-emerald-50 to-green-50 rounded-2xl p-6 shadow-lg border border-emerald-100">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            What's Next?
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600">✓</span>
              <span>You'll capture 5 quick dental photos (2-3 minutes)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600">✓</span>
              <span>Get instant AI-powered dental analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600">✓</span>
              <span>
                {type === 'gym' && 'Receive personalized whitening recommendations'}
                {type === 'school' && 'Get comprehensive dental health report'}
                {type === 'charity' && 'Access free dental care resources'}
              </span>
            </li>
            {type === 'gym' && (
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">✓</span>
                <span>Unlock exclusive 20% discount offer</span>
              </li>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}