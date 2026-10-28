import { AttendanceSubmissionPayload, EmailReportResult } from '../types/academic';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { formatKolkataTime } from '../utils/timezone';

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
   * Sent via secure backend proxy route (/api/send-attendance-report) to avoid exposing secrets.
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
        // Record log to Supabase email_logs
        await emailService.logEmailDispatch({
          logId: `LOG-${Date.now()}`,
          recipient,
          subject,
          status: 'SENT',
          teacherId: payload.teacherId,
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

      await emailService.logEmailDispatch({
        logId: `LOG-${Date.now()}`,
        recipient,
        subject,
        status: 'FAILED',
        teacherId: payload.teacherId,
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
   * Send new student admission notification to official THEEN administration email: theeninstitute@gmail.com
   */
  sendAdmissionNotification: async (
    applicationData: any
  ): Promise<EmailReportResult> => {
    const recipient = 'theeninstitute@gmail.com';
    const subject = `New Student Admission — ${applicationData.applicationId} (${applicationData.fullName})`;
    const logId = `LOG-APP-${Date.now()}`;

    try {
      const response = await fetch('/api/send-admission-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      if (response.ok) {
        await emailService.logEmailDispatch({
          logId,
          recipient,
          subject,
          status: 'SENT',
        });

        return {
          sent: true,
          message: `Admission notification sent to ${recipient}`,
          recipient,
        };
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Server status ${response.status}`);
      }
    } catch (err: any) {
      console.warn('Admission email dispatch notice:', err?.message || err);

      await emailService.logEmailDispatch({
        logId,
        recipient,
        subject,
        status: 'FAILED',
      });

      return {
        sent: false,
        message: 'Admission was saved, but email notification could not be sent.',
        recipient,
        error: err?.message,
      };
    }
  },

  /**
   * Log email dispatch directly to Supabase public.email_logs table
   */
  logEmailDispatch: async (log: {
    logId: string;
    recipient: string;
    subject: string;
    status: string;
    teacherId?: string;
  }) => {
    if (!isSupabaseConfigured) return;

    try {
      await supabase.from('email_logs').insert({
        log_id: log.logId,
        recipient: log.recipient,
        subject: log.subject,
        status: log.status,
        teacher_id: log.teacherId || null,
      });
    } catch (err) {
      console.warn('Supabase email log error:', err);
    }
  },

  getEmailLogs: async () => {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  },
};
