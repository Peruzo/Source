import fs from 'fs/promises';
import path from 'path';

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_TRANSACTIONAL_API_KEY;
const FROM_EMAIL = 'noreply@yoursource.se';
const FROM_NAME = 'Source';

function compileTemplate(html: string, variables: Record<string, string>): string {
  return Object.entries(variables).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, value || ''),
    html
  );
}

export async function sendTransactionalEmail({
  to,
  subject,
  templatePath,
  variables,
}: {
  to: string;
  subject: string;
  templatePath: string;
  variables: Record<string, string>;
}) {
  try {
    if (!MAILCHIMP_API_KEY) {
      console.warn('[Mail] MAILCHIMP_TRANSACTIONAL_API_KEY not set – skipping email');
      return;
    }

    const templateHtml = await fs.readFile(
      path.join(process.cwd(), templatePath),
      'utf-8'
    );
    const html = compileTemplate(templateHtml, variables);

    const mailchimp = require('@mailchimp/mailchimp_transactional')(MAILCHIMP_API_KEY);

    const result = await mailchimp.messages.send({
      message: {
        html,
        subject,
        from_email: FROM_EMAIL,
        from_name: FROM_NAME,
        to: [{ email: to, type: 'to' }],
      },
    });

    if (!result || !Array.isArray(result) || result.length === 0) {
      throw new Error('Mailchimp returned empty response');
    }

    const emailResult = result[0];
    if (emailResult.status === 'rejected' || emailResult.status === 'invalid') {
      throw new Error(`Mailchimp rejected email: ${emailResult.reject_reason}`);
    }

    console.log('[Mail] Sent:', { to, subject, status: emailResult.status });
  } catch (error) {
    console.error('[Mail] Failed to send email:', error);
    // Kasta inte vidare – mail är non-blocking
  }
}
