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

    const subject = data.subject || `THEEN Attendance Report — ${data.date} (${data.teacherId})`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #071A3D; background-color: #FBF9F5; border-radius: 8px;">
        <h2 style="color: #071A3D; border-bottom: 2px solid #C5A869; padding-bottom: 8px;">THEEN – INSTITUTE OF QUR’AN</h2>
        <h3 style="color: #8A7038;">Attendance Report</h3>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Teacher:</strong> ${data.teacherName} (${data.teacherId})</p>
        <p><strong>Total Records:</strong> ${data.records?.length || 0}</p>
        <hr style="border: 0; border-top: 1px solid #E8E2D5; margin: 15px 0;" />
        <pre style="font-family: monospace; white-space: pre-wrap; font-size: 12px; color: #41536E;">${data.body || JSON.stringify(data.records, null, 2)}</pre>
        <p style="margin-top: 20px; font-size: 11px; color: #5E6D84;">This is an automated attendance dispatch from THEEN Institute Faculty Portal.</p>
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
        message: `Attendance report successfully delivered to ${adminEmail}`,
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
    console.error('Attendance email endpoint error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while sending attendance report',
      error: err?.message,
    });
  }
}
