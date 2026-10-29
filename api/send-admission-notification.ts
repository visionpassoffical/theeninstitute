import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const data = req.body || {};
    const adminEmail = process.env.THEEN_ADMIN_EMAIL || 'theeninstitute@gmail.com';
    const resendApiKey = process.env.RESEND_API_KEY || process.env.THEEN_RESEND_API_KEY;
    const resendFromEmail = process.env.RESEND_FROM_EMAIL;

    if (!resendApiKey) {
      console.warn('RESEND_API_KEY is not configured in server environment variables.');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: RESEND_API_KEY is missing.',
      });
    }

    if (!resendFromEmail) {
      console.warn('RESEND_FROM_EMAIL is not configured in server environment variables.');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: RESEND_FROM_EMAIL is missing.',
      });
    }

    const subject = `New Student Admission Application — ${data.applicationId} (${data.fullName})`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #071A3D; background-color: #FBF9F5; border-radius: 8px;">
        <h2 style="color: #071A3D; border-bottom: 2px solid #C5A869; padding-bottom: 8px;">THEEN – INSTITUTE OF QUR’AN</h2>
        <h3 style="color: #8A7038;">New Student Admission Inquiry</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5; width: 35%;"><strong>Application ID:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${data.applicationId}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;"><strong>Full Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${data.fullName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${data.email}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;"><strong>WhatsApp:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${data.whatsapp}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;"><strong>Gender:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${data.gender}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;"><strong>Course:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${data.course}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;"><strong>Class Type:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${data.classType}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;"><strong>Language Preference:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${data.classLanguage}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;"><strong>Guardian Info:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${data.guardianName ? `${data.guardianName} (${data.guardianRelationship}, WhatsApp: ${data.guardianWhatsapp})` : 'Self (Applying for self)'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;"><strong>Previous Learning:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${data.previousLearning || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;"><strong>Additional Notes:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${data.notes || 'None'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;"><strong>Submitted At:</strong></td><td style="padding: 8px; border-bottom: 1px solid #E8E2D5;">${data.submittedAt || new Date().toISOString()}</td></tr>
        </table>
        <p style="margin-top: 20px; font-size: 11px; color: #5E6D84;">This is an automated notification dispatch from THEEN Institute Admissions Portal.</p>
      </div>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: [adminEmail],
        subject: subject,
        html: htmlBody,
      }),
    });

    const resendResult = await resendResponse.json().catch(() => ({}));

    if (resendResponse.ok) {
      return res.status(200).json({
        success: true,
        message: `Admission notification successfully dispatched to ${adminEmail}`,
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
    console.error('Admission email endpoint error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while sending admission notification',
      error: err?.message,
    });
  }
}
