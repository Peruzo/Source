import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendToAdminPortal } from '@/lib/api/admin-portal';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  needs: z.array(z.string()).min(1),
  message: z.string().min(10).max(1000),
  budget: z.enum(['under_5k', '5k_10k', 'over_10k', 'unknown']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validated = contactSchema.parse(body);
    
    // Prepare payload for admin portal
    const payload = {
      idempotencyKey: `contact-${Date.now()}-${validated.email}`,
      type: 'general_inquiry',
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      company: validated.company,
      needs: validated.needs,
      message: validated.message,
      budget: validated.budget,
      source: 'contact_page',
      submittedAt: new Date().toISOString(),
    };
    
    // Send to admin portal (with retry logic)
    await sendToAdminPortal('contact', payload);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('[Contact API] Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Ett fel uppstod. Försök igen eller kontakta oss på help@source.com',
      },
      { status: 500 }
    );
  }
}

