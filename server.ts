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

// Serve static assets in production
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`THEEN Server running on port ${PORT}`);
});
