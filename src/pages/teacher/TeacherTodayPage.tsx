import React, { useState, useEffect } from 'react';
import { TeacherLayout } from './TeacherLayout';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { academicService } from '../../services/academicService';
import { attendanceService } from '../../services/attendanceService';
import { Student, AttendanceRecord, AttendanceStatus, AttendanceSubmissionPayload } from '../../types/academic';
import { getKolkataDateString, formatKolkataDate, formatKolkataTime } from '../../utils/timezone';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Send,
  Sparkles,
  AlertTriangle,
  Clock,
  ShieldCheck,
  RefreshCw,
  Info,
  Check,
  Mail,
} from 'lucide-react';

export const TeacherTodayPage: React.FC = () => {
  const { userProfile } = useAuth();
  const { language, fontClass } = useLanguage();

  const teacherId = userProfile?.teacherId || 'MT001';
  const teacherUid = userProfile?.uid || 'teacher-uid';
  const teacherName = userProfile?.displayName || 'Faculty Member';

  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceState, setAttendanceState] = useState<Record<string, AttendanceStatus>>({});
  const [existingRecords, setExistingRecords] = useState<Record<string, AttendanceRecord>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submittingStudentId, setSubmittingStudentId] = useState<string | null>(null);

  // Status feedback
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [emailNotice, setEmailNotice] = useState<{ sent: boolean; message: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Submit All Confirmation Modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const todayDate = getKolkataDateString();

  const loadTodayData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const assigned = await academicService.getStudentsForTeacher(teacherId);
      const todaySubmitted = await attendanceService.getTodayAttendanceForTeacher(
        teacherId,
        todayDate
      );

      const recordsMap: Record<string, AttendanceRecord> = {};
      const stateMap: Record<string, AttendanceStatus> = {};

      todaySubmitted.forEach((r) => {
        recordsMap[r.studentId] = r;
        stateMap[r.studentId] = r.status;
      });

      // For students not yet submitted, default selection to PRESENT for fast workflow
      assigned.forEach((s) => {
        if (!stateMap[s.studentId]) {
          stateMap[s.studentId] = 'PRESENT';
        }
      });

      setStudents(assigned);
      setExistingRecords(recordsMap);
      setAttendanceState(stateMap);
    } catch (err) {
      setErrorMessage('Unable to load your students. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodayData();
  }, [teacherId, todayDate]);

  // Handle single attendance selection
  const handleSelectStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Submit single student attendance
  const handleSubmitSingle = async (student: Student) => {
    const selectedStatus = attendanceState[student.studentId] || 'PRESENT';
    setSubmittingStudentId(student.studentId);
    setSuccessMessage(null);
    setEmailNotice(null);
    setErrorMessage(null);

    const payload: AttendanceSubmissionPayload = {
      teacherId,
      teacherUid,
      teacherName,
      date: todayDate,
      records: [
        {
          studentId: student.studentId,
          studentName: student.name,
          course: student.course,
          classType: student.classType,
          classLanguage: student.classLanguage,
          status: selectedStatus,
        },
      ],
    };

    try {
      const result = await attendanceService.submitAttendanceBatch(payload);
      if (result.savedRecords.length > 0) {
        setExistingRecords((prev) => ({
          ...prev,
          [student.studentId]: result.savedRecords[0],
        }));

        setSuccessMessage(`Attendance saved for ${student.name} (${selectedStatus}).`);
        setEmailNotice({
          sent: result.emailResult.sent,
          message: result.emailResult.message,
        });
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unable to submit attendance. Please try again.');
    } finally {
      setSubmittingStudentId(null);
    }
  };

  // Submit All Students Attendance
  const handleConfirmSubmitAll = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);
    setSuccessMessage(null);
    setEmailNotice(null);
    setErrorMessage(null);

    const recordsToSubmit = students.map((s) => ({
      studentId: s.studentId,
      studentName: s.name,
      course: s.course,
      classType: s.classType,
      classLanguage: s.classLanguage,
      status: attendanceState[s.studentId] || 'PRESENT',
    }));

    const payload: AttendanceSubmissionPayload = {
      teacherId,
      teacherUid,
      teacherName,
      date: todayDate,
      records: recordsToSubmit,
    };

    try {
      const result = await attendanceService.submitAttendanceBatch(payload);
      const newExistingMap: Record<string, AttendanceRecord> = { ...existingRecords };
      result.savedRecords.forEach((r) => {
        newExistingMap[r.studentId] = r;
      });
      setExistingRecords(newExistingMap);

      setSuccessMessage(
        `Attendance submitted successfully for all ${result.savedRecords.length} students.`
      );
      setEmailNotice({
        sent: result.emailResult.sent,
        message: result.emailResult.message,
      });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unable to submit attendance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalStudents = students.length;
  const submittedCount = Object.keys(existingRecords).length;
  const allSubmitted = totalStudents > 0 && submittedCount === totalStudents;

  return (
    <TeacherLayout
      activeTab="today"
      title="Today's Classes & Live Attendance"
      subtitle={`Standard Timezone: Asia/Kolkata (IST) • ${formatKolkataDate(new Date())}`}
    >
      <div className="space-y-6 text-start">
        {/* Top Operational Bar */}
        <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82]">
                Active Date (IST)
              </span>
              <span className="font-mono text-xs font-bold text-[#071A3D] dark:text-[#F3EFE6] px-2 py-0.5 rounded bg-[#F4EFE6] dark:bg-[#15253F]">
                {todayDate}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#071A3D] dark:text-[#F3EFE6]">
              Mark Daily Student Attendance
            </h2>
            <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4]">
              Select PRESENT or ABSENT for each assigned student and click Submit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadTodayData}
              disabled={loading || submitting}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#5E6D84] dark:text-[#9EADC4] hover:text-[#071A3D] dark:hover:text-white bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            {students.length > 0 && (
              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={submitting || loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A869] text-[#071A3D] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#D4BC82] transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{allSubmitted ? 'Update All Attendance' : 'Submit All Attendance'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Real-time Success Notification */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <p className="text-xs font-bold">{successMessage}</p>
            </div>
            {emailNotice && (
              <div className="pl-7 flex items-center gap-1.5 text-[11px]">
                <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className={emailNotice.sent ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-800 dark:text-amber-300 font-medium'}>
                  {emailNotice.message}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <p className="text-xs font-semibold">{errorMessage}</p>
          </div>
        )}

        {/* Today's Student Cards List */}
        {loading ? (
          <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-12 text-center text-xs text-[#5E6D84] dark:text-[#9EADC4]">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C5A869]" />
            <span>Loading today's assigned classes...</span>
          </div>
        ) : students.length === 0 ? (
          <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-12 text-center space-y-2">
            <Info className="w-8 h-8 text-[#C5A869] mx-auto" />
            <h3 className="text-sm font-bold text-[#071A3D] dark:text-[#F3EFE6]">
              No students assigned yet.
            </h3>
            <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4] max-w-md mx-auto">
              You do not have any active student assignments for today. Please contact THEEN administration.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {students.map((student, idx) => {
              const currentChoice = attendanceState[student.studentId] || 'PRESENT';
              const existing = existingRecords[student.studentId];
              const isSubmittingThis = submittingStudentId === student.studentId;

              return (
                <div
                  key={student.studentId}
                  className={`bg-white dark:bg-[#0B172B] rounded-2xl border transition-all p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                    existing
                      ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                      : 'border-[#E8E2D5] dark:border-[#1F3354]'
                  }`}
                >
                  {/* Student Details & Course Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#071A3D] text-[#C5A869] dark:bg-[#C5A869]/20 font-mono text-[11px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h3 className="text-base font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                        {student.name}
                      </h3>
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#F4EFE6] dark:bg-[#15253F] text-[#8A7038] dark:text-[#D4BC82]">
                        {student.studentId}
                      </span>
                      {existing && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                          <Check className="w-3 h-3" />
                          <span>Submitted: {existing.status}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#5E6D84] dark:text-[#9EADC4]">
                      <span className="font-bold uppercase tracking-wider text-[#071A3D] dark:text-[#D4BC82] bg-[#F4EFE6] dark:bg-white/5 px-2 py-0.5 rounded">
                        Course: {student.course.toUpperCase()}
                      </span>
                      <span>•</span>
                      <span>
                        {student.classType === 'group'
                          ? `Group Batch: ${student.batchName || student.batchId || 'Batch 1'}`
                          : 'Individual (1-on-1)'}
                      </span>
                      <span>•</span>
                      <span className="uppercase">
                        Language: {student.classLanguage === 'ml' ? 'Malayalam' : student.classLanguage === 'ur' ? 'Urdu' : 'English'}
                      </span>
                    </div>
                  </div>

                  {/* High Contrast Attendance Controls & Submit Action */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Toggle Buttons: PRESENT vs ABSENT */}
                    <div className="grid grid-cols-2 p-1 bg-[#FBF9F5] dark:bg-[#060D1A] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] min-w-[220px]">
                      {/* PRESENT Button */}
                      <button
                        type="button"
                        onClick={() => handleSelectStatus(student.studentId, 'PRESENT')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          currentChoice === 'PRESENT'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-[#5E6D84] dark:text-[#9EADC4] hover:text-[#071A3D] dark:hover:text-white'
                        }`}
                        aria-label={`Mark ${student.name} Present`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>PRESENT</span>
                      </button>

                      {/* ABSENT Button */}
                      <button
                        type="button"
                        onClick={() => handleSelectStatus(student.studentId, 'ABSENT')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          currentChoice === 'ABSENT'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-[#5E6D84] dark:text-[#9EADC4] hover:text-[#071A3D] dark:hover:text-white'
                        }`}
                        aria-label={`Mark ${student.name} Absent`}
                      >
                        <XCircle className="w-4 h-4" />
                        <span>ABSENT</span>
                      </button>
                    </div>

                    {/* Single Student Submit Button */}
                    <button
                      type="button"
                      onClick={() => handleSubmitSingle(student)}
                      disabled={isSubmittingThis || submitting}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#071A3D] dark:bg-[#C5A869]/20 hover:bg-[#0D244D] dark:hover:bg-[#C5A869]/30 text-[#F3EFE6] dark:text-[#D4BC82] border border-[#071A3D] dark:border-[#C5A869]/40 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingThis ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>{existing ? 'Update' : 'Submit'}</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Bottom Consolidated Action Bar */}
            <div className="bg-[#FBF9F5] dark:bg-[#060D1A] rounded-2xl border border-[#C5A869]/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div className="space-y-1 text-center sm:text-start">
                <p className="text-xs font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                  Status Summary: {submittedCount} of {totalStudents} students submitted for today
                </p>
                <p className="text-[11px] text-[#5E6D84] dark:text-[#9EADC4]">
                  Submitting triggers an automatic consolidated attendance dispatch to the official THEEN inbox.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={submitting || loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#C5A869] text-[#071A3D] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#D4BC82] transition-colors cursor-pointer shadow-md disabled:opacity-50"
              >
                {submitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{allSubmitted ? 'Update All Attendance' : 'SUBMIT ALL ATTENDANCE'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Submit All Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-[#071A3D]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] max-w-md w-full p-6 space-y-5 shadow-2xl text-start">
            <div className="flex items-center gap-3 pb-3 border-b border-[#E8E2D5] dark:border-[#1F3354]">
              <div className="w-10 h-10 rounded-full bg-[#071A3D] text-[#C5A869] flex items-center justify-center">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                  Confirm Attendance Dispatch
                </h3>
                <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4]">
                  Date: {todayDate} (IST)
                </p>
              </div>
            </div>

            <p className="text-xs text-[#41536E] dark:text-[#C5D2E5] leading-relaxed">
              You are about to submit attendance for <strong className="text-[#071A3D] dark:text-white">{students.length} students</strong>. A report will be saved to your attendance history and sent to the official THEEN administration email (<span className="font-mono">theeninstitute@gmail.com</span>).
            </p>

            <div className="p-3 bg-[#FBF9F5] dark:bg-[#060D1A] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5E6D84] dark:text-[#9EADC4]">Present Count:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {Object.values(attendanceState).filter((s) => s === 'PRESENT').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E6D84] dark:text-[#9EADC4]">Absent Count:</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">
                  {Object.values(attendanceState).filter((s) => s === 'ABSENT').length}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#5E6D84] dark:text-[#9EADC4] hover:text-[#071A3D] dark:hover:text-white bg-transparent border border-[#E8E2D5] dark:border-[#1F3354] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmitAll}
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#071A3D] bg-[#C5A869] hover:bg-[#D4BC82] rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </TeacherLayout>
  );
};
