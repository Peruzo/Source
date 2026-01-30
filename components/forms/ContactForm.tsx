'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Namnet måste vara minst 2 tecken').max(100),
  email: z.string().email('Ange en giltig e-postadress'),
  phone: z.string().optional(),
  company: z.string().optional(),
  needs: z.array(z.string()).min(1, 'Välj minst ett alternativ'),
  message: z.string().min(10, 'Meddelandet måste vara minst 10 tecken').max(1000),
  budget: z.enum(['under_5k', '5k_10k', 'over_10k', 'unknown']).optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitStatus === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-green-800 mb-4">
          Tack för ditt meddelande!
        </h3>
        <p className="text-green-700 mb-6">
          Vi har mottagit din förfrågan och återkommer inom 24 timmar.
        </p>
        <p className="text-sm text-green-600">
          Om du har akuta frågor, ring oss på{' '}
          <a href="tel:+46733221212" className="font-semibold underline">
            +46 73 322 12 12
          </a>
        </p>
        <button
          onClick={() => setSubmitStatus('idle')}
          className="mt-6 text-teal hover:text-teal-hover font-medium"
        >
          Skicka ett nytt meddelande
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Namn <span className="text-teal">*</span>
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal focus:outline-none transition-colors"
          placeholder="Ditt fullständiga namn"
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          E-post <span className="text-teal">*</span>
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal focus:outline-none transition-colors"
          placeholder="din@email.com"
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Telefon
        </label>
        <input
          {...register('phone')}
          type="tel"
          id="phone"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal focus:outline-none transition-colors"
          placeholder="+46 70 123 45 67"
        />
      </div>

      {/* Company */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
          Företag
        </label>
        <input
          {...register('company')}
          type="text"
          id="company"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal focus:outline-none transition-colors"
          placeholder="Ditt företagsnamn"
        />
      </div>

      {/* Needs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Vad behöver du hjälp med? <span className="text-teal">*</span>
        </label>
        <div className="space-y-3">
          {[
            { value: 'new_website', label: 'Ny hemsida' },
            { value: 'ecommerce', label: 'E-handel' },
            { value: 'existing_site', label: 'Befintlig sida' },
            { value: 'ai_analytics', label: 'AI-analys' },
            { value: 'other', label: 'Övrigt' },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                {...register('needs')}
                type="checkbox"
                value={option.value}
                className="w-5 h-5 accent-teal cursor-pointer"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
        {errors.needs && (
          <p className="mt-2 text-sm text-red-600">{errors.needs.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Meddelande <span className="text-teal">*</span>
        </label>
        <textarea
          {...register('message')}
          id="message"
          rows={6}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal focus:outline-none transition-colors resize-vertical"
          placeholder="Berätta om ditt projekt..."
        />
        {errors.message && (
          <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Budget (frivilligt)
        </label>
        <div className="space-y-2">
          {[
            { value: 'under_5k', label: '< 5 000 kr/mån' },
            { value: '5k_10k', label: '5 000 - 10 000 kr/mån' },
            { value: 'over_10k', label: '> 10 000 kr/mån' },
            { value: 'unknown', label: 'Vet ej ännu' },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                {...register('budget')}
                type="radio"
                value={option.value}
                className="w-5 h-5 accent-teal cursor-pointer"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">
            Ett fel uppstod. Försök igen eller kontakta oss på{' '}
            <a href="mailto:help@source.com" className="font-semibold underline">
              help@source.com
            </a>
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-teal text-white font-semibold py-4 rounded-lg hover:bg-teal-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Skickar...' : 'Skicka meddelande'}
      </button>

      <p className="text-sm text-gray-600 text-center">
        * = Obligatoriskt fält
      </p>
    </form>
  );
}

