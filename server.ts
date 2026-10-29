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

// API route for sending attendance reports to theeninstitute@gmail.com via Resend
app.post('/api/send-attendance-report', async (req, res) => {
  try {
    const data = req.body || {};
    const adminEmail = process.env.THEEN_ADMIN_EMAIL || 'theeninstitute@gmail.com';
    const resendApiKey = process.env.RESEND_API_KEY || process.env.THEEN_RESEND_API_KEY;

    if (!resendApiKey) {
      console.log('==================================================');
      console.log('[THEEN SERVER ATTENDANCE REPORT (Mock Dispatch)]');
      console.log(`To: ${adminEmail}`);
      console.log(`Subject: ${data.subject || 'THEEN Attendance Report'}`);
      console.log(`Teacher: ${data.teacherName} (${data.teacherId})`);
      console.log(`Date: ${data.date}`);
      console.log('==================================================');
      return res.status(200).json({
        success: true,
        message: `Attendance report successfully delivered to ${adminEmail} (Mock)`,
        recipient: adminEmail,
        timestamp: new Date().toISOString(),
      });
    }

    const resendFromEmail = process.env.RESEND_FROM_EMAIL;

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
      res.status(200).json({
        success: true,
        message: `Attendance report successfully sent to ${adminEmail}`,
        recipient: adminEmail,
        id: resendResult.id,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.error('Resend API error:', resendResult);
      res.status(500).json({
        success: false,
        message: resendResult.message || 'Failed to send attendance report via Resend',
        error: resendResult,
      });
    }
  } catch (err: any) {
    console.error('Attendance email endpoint error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while sending attendance report',
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

// API route for sending new teacher application notifications to theeninstitute@gmail.com via Resend
app.post('/api/send-teacher-application-notification', async (req, res) => {
  try {
    const data = req.body || {};
    const adminEmail = process.env.THEEN_ADMIN_EMAIL || 'theeninstitute@gmail.com';
    const resendApiKey = process.env.RESEND_API_KEY || process.env.THEEN_RESEND_API_KEY;
    const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'THEEN Institute <onboarding@resend.dev>';

    if (!resendApiKey) {
      console.warn('RESEND_API_KEY is not configured in server environment variables.');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: RESEND_API_KEY is missing.',
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
        from: resendFromEmail,
        to: [adminEmail],
        subject: subject,
        html: htmlBody,
      }),
    });

    const resendResult = await resendResponse.json().catch(() => ({}));

    if (resendResponse.ok) {
      res.status(200).json({
        success: true,
        message: `Teacher application notification successfully dispatched to ${adminEmail}`,
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
    console.error('Teacher application email endpoint error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while sending teacher application notification',
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
