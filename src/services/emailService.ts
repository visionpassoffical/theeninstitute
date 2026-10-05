import { AttendanceSubmissionPayload, EmailReportResult } from '../types/academic';
import { formatKolkataTime } from '../utils/timezone';

const STORAGE_EMAIL_LOGS_KEY = 'theen_attendance_email_logs';

export const emailService = {
  /**
   * Format consolidated plaintext email body as specified by THEEN institute standards
   */
  generateEmailBody: (payload: AttendanceSubmissionPayload): string => {
    const formattedTime = formatKolkataTime(new Date());

    const studentSections = payload.records
      .map((r, index) => {
        const langLabel =
          r.classLanguage === 'ml' ? 'MALAYALAM' : r.classLanguage === 'ur' ? 'URDU' : 'ENGLISH';
        const typeLabel = r.classType.toUpperCase();
        const courseLabel = r.course.toUpperCase();

        return `--------------------------------------------------
Record #${index + 1}:
Student: ${r.studentName}
Student ID: ${r.studentId}
Course: ${courseLabel}
Class Type: ${typeLabel}
Class Language: ${langLabel}
Attendance: ${r.status}
Submitted At: ${formattedTime}`;
      })
      .join('\n\n');

    return `THEEN – INSTITUTE OF QUR’AN
Attendance Report

Date:
${payload.date}

Teacher:
${payload.teacherName}

Teacher ID:
${payload.teacherId}

Total Records: ${payload.records.length}

${studentSections}

==================================================
This is an automated attendance dispatch from THEEN Institute Faculty Portal.`;
  },

  /**
   * Send attendance report to official THEEN administration email: theeninstitute@gmail.com
   * Note: As per Section 21, if email sending fails, the caller receives a non-fatal status
   * so that the UI states: "Attendance was saved, but the email report could not be sent."
   */
  sendAttendanceReport: async (
    payload: AttendanceSubmissionPayload
  ): Promise<EmailReportResult> => {
    const recipient = 'theeninstitute@gmail.com';
    const subject = `THEEN Attendance Report — ${payload.date} (${payload.teacherId})`;
    const emailBody = emailService.generateEmailBody(payload);

    try {
      const response = await fetch('/api/send-attendance-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient,
          subject,
          date: payload.date,
          teacherId: payload.teacherId,
          teacherName: payload.teacherName,
          records: payload.records,
          body: emailBody,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Log in persistent log
        emailService.logEmailDispatch({
          logId: `LOG-${Date.now()}`,
          attendanceDate: payload.date,
          teacherId: payload.teacherId,
          recipient,
          subject,
          recordsCount: payload.records.length,
          status: 'SENT',
          sentAt: new Date().toISOString(),
        });

        return {
          sent: true,
          message: `Attendance report dispatched to ${recipient}`,
          recipient,
        };
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Server status ${response.status}`);
      }
    } catch (err: any) {
      console.warn('Attendance email dispatch notification:', err?.message || err);

      // Log the failed attempt for audit & transparency
      emailService.logEmailDispatch({
        logId: `LOG-${Date.now()}`,
        attendanceDate: payload.date,
        teacherId: payload.teacherId,
        recipient,
        subject,
        recordsCount: payload.records.length,
        status: 'FAILED',
        sentAt: new Date().toISOString(),
        error: err?.message || 'Email service unavailable',
      });

      return {
        sent: false,
        message: 'Attendance was saved, but the email report could not be sent.',
        recipient,
        error: err?.message,
      };
    }
  },

  /**
   * Keep audit logs in local storage for administration inspection
   */
  logEmailDispatch: (log: any) => {
    try {
      const logs = JSON.parse(localStorage.getItem(STORAGE_EMAIL_LOGS_KEY) || '[]');
      logs.unshift(log);
      // Keep last 50 logs
      localStorage.setItem(STORAGE_EMAIL_LOGS_KEY, JSON.stringify(logs.slice(0, 50)));
    } catch {
      // Ignore
    }
  },

  getEmailLogs: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_EMAIL_LOGS_KEY) || '[]');
    } catch {
      return [];
    }
  },
};
