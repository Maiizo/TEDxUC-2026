'use client';

import React, { useState, useMemo } from 'react';
import { X, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Cinzel } from 'next/font/google';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });

interface EventConfig {
  key: 'pre-event-1' | 'main-event';
  label: string;
  subtitle: string;
  date: Date;
  requiresAllergy: boolean;
}

const EVENTS: EventConfig[] = [
  {
    key: 'pre-event-1',
    label: 'Pre-Event 1: The First Gathering',
    subtitle: 'April 10, 2026',
    date: new Date('2026-04-10T23:59:59'),
    requiresAllergy: false,
  },
  {
    key: 'main-event',
    label: 'Main Event: TEDxUC 2026',
    subtitle: 'May 10, 2026',
    date: new Date('2026-05-10T23:59:59'),
    requiresAllergy: true,
  },
];

// Returns the active registrable event, or null if none is currently open
function getActiveEvent(): EventConfig | null {
  const now = new Date();
  return EVENTS.find((ev) => ev.date >= now) ?? null;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  allergies: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

interface RegistrationFormProps {
  onClose?: () => void;
  eventKey?: EventConfig['key'];
  onRegistrationSuccess?: (data: {
    id: string;
    registrationNumber: string;
    status: string;
    qrCode: string | null;
    paymentAmount: number;
  }) => void | Promise<void>;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onClose,
  eventKey,
  onRegistrationSuccess,
}) => {
  const activeEvent = useMemo(() => {
    if (eventKey) {
      return EVENTS.find((ev) => ev.key === eventKey) ?? null;
    }
    return getActiveEvent();
  }, [eventKey]);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    allergies: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('Something went wrong. Please try again.');

  if (!activeEvent) {
    return (
      <div className="relative bg-[#0f0f0f] border border-gray-800 rounded-2xl p-8 max-w-xl w-full text-center space-y-4 shadow-2xl">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
        <div className="w-16 h-16 bg-gray-800/40 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="text-gray-400 w-8 h-8" />
        </div>
        <h3 className={`${cinzel.className} text-2xl text-white`}>Registration Closed</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Registration is currently not available. Only <span className="text-white">Pre-Event 1</span> and the{' '}
          <span className="text-white">Main Event</span> have open registration periods.
        </p>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if ((name === 'phone' || name === 'age') && value !== '' && !/^\d+$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let valid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email address is required';
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Phone number is too short';
      valid = false;
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
      valid = false;
    } else if (parseInt(formData.age) < 12) {
      newErrors.age = 'Minimum age is 12';
      valid = false;
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('idle');
    setSubmitMessage('Something went wrong. Please try again.');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phoneNumber: formData.phone.trim(),
          gender: formData.gender,
          age: Number(formData.age),
          eventKey: activeEvent.key,
          foodAllergy: activeEvent.requiresAllergy ? formData.allergies.trim() || '-' : '-',
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result || result.success !== true) {
        setSubmitStatus('error');
        setSubmitMessage(result?.message || 'Failed to save registration. Please try again.');
        return;
      }

      if (!result.data?.id || !result.data?.registrationNumber) {
        setSubmitStatus('error');
        setSubmitMessage('Registration succeeded but payment reference is missing. Please contact admin.');
        return;
      }

      const successData = {
        id: result.data?.id,
        registrationNumber: result.data?.registrationNumber,
        status: result.data?.status,
        qrCode: result.data?.qrCode ?? null,
        paymentAmount: Number(result.data?.paymentAmount ?? 0),
      };

      if (onRegistrationSuccess) {
        await onRegistrationSuccess(successData);
      }

      if (activeEvent.key === 'main-event') {
        return;
      }

      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: keyof FormData) =>
    `w-full bg-[#1a1a1a] border ${errors[field] ? 'border-red-500' : 'border-[#333] focus:border-[#4A5D45]'
    } rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm`;
  if (submitStatus === 'success') {
    return (
      <div className="relative bg-[#0f0f0f] border border-gray-800 rounded-2xl p-5 sm:p-8 max-w-xl w-full text-center space-y-4 shadow-2xl">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
        <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="text-green-500 w-8 h-8" />
        </div>
        <h3 className={`${cinzel.className} text-xl sm:text-2xl text-white`}>Registration Successful!</h3>
        <p className="text-gray-400 text-sm">
          Thank you for registering for <span className="text-white">{activeEvent.label}</span>.
          Check your email for confirmation and ticket details.
        </p>
        <button
          onClick={() => {
            setSubmitStatus('idle');
            setFormData({ fullName: '', email: '', phone: '', age: '', gender: '', allergies: '' });
          }}
          className="mt-4 text-[#6a8f65] hover:text-[#8ab385] text-sm font-semibold transition-colors"
        >
          Register Another Person
        </button>
      </div>
    );
  }

  return (
    <div className="relative bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-5 sm:p-8 max-w-xl w-full shadow-[0_8px_60px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[88vh]">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a] hover:text-white transition-all"
        >
          <X size={16} />
        </button>
      )}

      {/* Header */}
      <div className="mb-6 pr-8">
        <h2 className={`${cinzel.className} text-xl sm:text-2xl md:text-3xl text-white leading-tight mb-1`}>
          Register for {activeEvent.label}
        </h2>
        <p className="text-gray-500 text-sm">Fill in your details to secure your place</p>
      </div>

      {/* Error banner */}
      {submitStatus === 'error' && (
        <div className="mb-5 p-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center gap-3 text-red-400">
          <AlertCircle size={18} />
          <span className="text-sm">{submitMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-sm text-gray-300 font-medium">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            className={inputClass('fullName')}
          />
          {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm text-gray-300 font-medium">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="your.email@domain.com"
              value={formData.email}
              onChange={handleChange}
              className={inputClass('email')}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-gray-300 font-medium">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              placeholder="+62 xxx xxx xxx"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass('phone')}
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
          </div>
        </div>

        {/* Age + Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm text-gray-300 font-medium">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="age"
              placeholder="Your age"
              value={formData.age}
              onChange={handleChange}
              className={inputClass('age')}
            />
            {errors.age && <p className="text-red-500 text-xs">{errors.age}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-gray-300 font-medium">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`${inputClass('gender')} appearance-none cursor-pointer`}
            >
              <option value="" disabled className="bg-[#1a1a1a]">
                Select gender
              </option>
              <option value="male" className="bg-[#1a1a1a]">Male</option>
              <option value="female" className="bg-[#1a1a1a]">Female</option>
              <option value="other" className="bg-[#1a1a1a]">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
          </div>
        </div>

        {/* Food Allergies — hanya untuk Main Event */}
        {activeEvent.requiresAllergy && (
          <div className="space-y-1.5">
            <label className="text-sm text-gray-300 font-medium">Food Allergies (if any)</label>
            <textarea
              name="allergies"
              rows={3}
              placeholder="List any food allergies or dietary restrictions"
              value={formData.allergies}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#4A5D45] rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm resize-none"
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 bg-[#4A5D45] hover:bg-[#5a6f55] active:bg-[#3a4d36] text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Processing...
            </>
          ) : (
            <>
              Proceed to Payment
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;