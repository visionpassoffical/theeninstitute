import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const data = req.body || {};
    const adminEmail = process.env.THEEN_ADMIN_EMAIL || 'theeninstitute@gmail.com';
    const resendApiKey = process.env.RESEND_API_KEY || process.env.THEEN_RESEND_API_KEY;

    if (!resendApiKey) {
      console.warn('RESEND_API_KEY is not configured in environment variables.');
      return res.status(500).json({
        success: false,
        message: 'Resend API key is not configured on the server.',
      });
    }

    const subject = `New Teacher Application — ${data.applicationId} (${data.fullName})`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #071A3D; background-color: #FBF9F5; border-radius: 8px;">
        <h2 style="color: #071A3D; border-bottom: 2px solid #C5A869; padding-bottom: 8px;">THEEN – INSTITUTE OF QUR’AN</h2>
        <h3 style="color: #8A7038;">New Teacher Registration Application</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5; width: 35%;"><strong>Application ID:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${data.applicationId}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;"><strong>Full Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${data.fullName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${data.email || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;"><strong>WhatsApp:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${data.whatsapp || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;"><strong>Gender:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${data.gender}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;"><strong>Qualification:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${data.qualification}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;"><strong>Experience:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${data.experience}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;"><strong>Subjects:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${Array.isArray(data.subjects) ? data.subjects.join(', ') : data.subjects}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;"><strong>Languages:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${Array.isArray(data.languages) ? data.languages.join(', ') : data.languages}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;"><strong>Motivation:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${data.motivation || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;"><strong>Submitted At:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${data.submittedAt || new Date().toISOString()}</td></tr>
        </table>
        <p style="margin-top: 20px; font-size: 11px; color: #5E6D84;">This is an automated notification dispatch from THEEN Institute Teacher Recruitment Portal.</p>
      </div>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'THEEN Institute <onboarding@resend.dev>',
        to: [adminEmail],
        subject: subject,
        html: htmlBody,
      }),
    });

    const resendResult = await resendResponse.json().catch(() => ({}));

    if (resendResponse.ok) {
      return res.status(200).json({
        success: true,
        message: `Teacher application notification successfully dispatched to ${adminEmail}`,
        recipient: adminEmail,
        id: resendResult.id,
      });
    } else {
      console.error('Resend API error:', resendResult);
      return res.status(500).json({
        success: false,
        message: resendResult.message || 'Failed to send email via Resend',
        error: resendResult,
      });
    }
  } catch (err: any) {
    console.error('Teacher application email endpoint error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while sending teacher application notification',
      error: err?.message,
    });
  }
}
