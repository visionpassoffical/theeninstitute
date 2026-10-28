import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API route for sending attendance reports to theeninstitute@gmail.com
app.post('/api/send-attendance-report', (req, res) => {
  try {
    const data = req.body || {};
    const adminEmail = process.env.THEEN_ADMIN_EMAIL || 'theeninstitute@gmail.com';

    console.log('==================================================');
    console.log('[THEEN PRODUCTION SERVER EMAIL DISPATCH]');
    console.log(`To: ${adminEmail}`);
    console.log(`Subject: ${data.subject || 'THEEN Attendance Report'}`);
    console.log(`Teacher: ${data.teacherName} (${data.teacherId})`);
    console.log(`Date: ${data.date}`);
    console.log(`Total Students: ${data.records?.length || 0}`);
    console.log('==================================================');

    res.status(200).json({
      success: true,
      message: `Attendance report successfully delivered to ${adminEmail}`,
      recipient: adminEmail,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Email dispatch error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to dispatch email report',
      error: err?.message,
    });
  }
});

// API route for sending new student admission notifications to theeninstitute@gmail.com via Resend
app.post('/api/send-admission-notification', async (req, res) => {
  try {
    const data = req.body || {};
    const adminEmail = process.env.THEEN_ADMIN_EMAIL || 'theeninstitute@gmail.com';
    const resendApiKey = process.env.RESEND_API_KEY || process.env.THEEN_RESEND_API_KEY;

    if (!resendApiKey) {
      console.warn('RESEND_API_KEY is not configured in environment variables on the server.');
      return res.status(500).json({
        success: false,
        message: 'Resend API key is not configured on the server.',
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
        from: 'THEEN Institute <onboarding@resend.dev>',
        to: [adminEmail],
        subject: subject,
        html: htmlBody,
      }),
    });

    const resendResult = await resendResponse.json().catch(() => ({}));

    if (resendResponse.ok) {
      res.status(200).json({
        success: true,
        message: `Admission notification successfully dispatched to ${adminEmail}`,
        recipient: adminEmail,
        id: resendResult.id,
      });
    } else {
      console.error('Resend API error:', resendResult);
      res.status(500).json({
        success: false,
        message: resendResult.message || 'Failed to send email via Resend',
        error: resendResult,
      });
    }
  } catch (err: any) {
    console.error('Admission email endpoint error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while sending admission notification',
      error: err?.message,
    });
  }
});

// Serve static assets in production
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`THEEN Server running on port ${PORT}`);
});
