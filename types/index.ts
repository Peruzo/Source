// Contact Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  needs: string[];
  message: string;
  budget?: 'under_5k' | '5k_10k' | 'over_10k' | 'unknown';
}

// Admin Portal Payload Types
export interface AdminPortalPayload {
  idempotencyKey: string;
  type: string;
  submittedAt: string;
  [key: string]: any;
}

// Project Types
export interface Project {
  slug: string;
  title: string;
  category: string;
  metric: string;
  services: string;
  challenge: string;
  solution: string[];
  results: string[];
  tech: string[];
  timeline: string;
}

// Pricing Plan Types
export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  limitations?: string[];
  cta: string;
  href: string;
  featured: boolean;
  badge?: string;
}

