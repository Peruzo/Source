import { z } from 'zod';

// Contact Form Schema
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Namnet måste vara minst 2 tecken')
    .max(100, 'Namnet får max vara 100 tecken'),
  email: z.string()
    .email('Ange en giltig e-postadress')
    .max(254),
  phone: z.string().optional(),
  company: z.string().max(100).optional(),
  needs: z.array(z.enum([
    'new_website',
    'ecommerce',
    'existing_site',
    'ai_analytics',
    'other',
  ])).min(1, 'Välj minst ett alternativ'),
  message: z.string()
    .min(10, 'Meddelandet måste vara minst 10 tecken')
    .max(1000, 'Meddelandet får max vara 1000 tecken'),
  budget: z.enum([
    'under_5k',
    '5k_10k',
    'over_10k',
    'unknown',
  ]).optional(),
});

// Demo Booking Schema (for future use)
export const demoBookingSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(254),
  phone: z.string().optional(),
  company: z.string().max(100).optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.enum(['morning', 'afternoon', 'evening']).optional(),
  message: z.string().max(500).optional(),
});

// Type exports
export type ContactFormData = z.infer<typeof contactSchema>;
export type DemoBookingData = z.infer<typeof demoBookingSchema>;

