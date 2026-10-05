import React, { useState, useEffect } from 'react';
import { TeacherLayout } from './TeacherLayout';
import { useAuth } from '../../auth/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { useLanguage } from '../../context/LanguageContext';
import { academicService } from '../../services/academicService';
import { attendanceService } from '../../services/attendanceService';
import { progressService } from '../../services/progressService';
import { Student, AttendanceRecord, StudentProgressRecord } from '../../types/academic';
import { getKolkataDateString, formatKolkataDate, formatKolkataTime } from '../../utils/timezone';
import {
  Users,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Clock,
  BookOpen,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const TeacherDashboardPage: React.FC = () => {
  const { userProfile } = useAuth();
  const { navigate } = useRouter();
  const { language } = useLanguage();

  const teacherId = userProfile?.teacherId || 'MT001';
  const teacherName = userProfile?.displayName || 'Faculty Member';

  const [students, setStudents] = useState<Student[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([]);
  const [recentProgress, setRecentProgress] = useState<StudentProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const todayDate = getKolkataDateString();

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const assignedStudents = await academicService.getStudentsForTeacher(teacherId);
        const attendanceToday = await attendanceService.getTodayAttendanceForTeacher(
          teacherId,
          todayDate
        );
        const progressList = await progressService.getProgressForTeacher(teacherId);

        setStudents(assignedStudents);
        setTodayAttendance(attendanceToday);
        setRecentProgress(progressList.slice(0, 5));
      } catch (err) {
        console.warn('Dashboard load warning:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [teacherId, todayDate]);

  // Real calculations
  const totalAssignedStudents = students.length;
  const todayClassesCount = students.length; // Each assigned student has active sessions
  const submittedTodayCount = todayAttendance.length;
  const pendingAttendanceCount = Math.max(0, todayClassesCount - submittedTodayCount);

  // Students flagged as needing attention
  const needingAttentionCount = recentProgress.filter(
    (p) => p.progressStatus === 'NEEDS_ATTENTION'
  ).length;

  return (
    <TeacherLayout
      activeTab="dashboard"
      title={`Welcome, ${teacherName}`}
      subtitle={`Faculty Portal • ID: ${teacherId} • ${formatKolkataDate(new Date())}`}
    >
      <div className="space-y-8 text-start">
        {/* Rapid Attendance Callout Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#071A3D] to-[#0D244D] border border-[#C5A869]/40 p-6 sm:p-8 text-white shadow-lg">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A869]/20 border border-[#C5A869]/40 text-[#D4BC82] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Primary Faculty Workflow</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-wide">
                Today's Attendance & Classes
              </h2>
              <p className="text-xs sm:text-sm text-[#C5D2E5] leading-relaxed">
                {pendingAttendanceCount > 0
                  ? `You have ${pendingAttendanceCount} student attendance record${pendingAttendanceCount > 1 ? 's' : ''} pending submission for today.`
                  : 'All assigned student attendance records for today have been submitted successfully.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => navigate('/teacher/today')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C5A869] text-[#071A3D] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#D4BC82] transition-colors cursor-pointer shadow-md"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Open Today's Classes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Overview Metric Cards (Real Database Data) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 1. Assigned Students */}
          <div className="bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#071A3D]/5 dark:bg-[#C5A869]/10 border border-[#071A3D]/10 dark:border-[#C5A869]/20 flex items-center justify-center text-[#071A3D] dark:text-[#C5A869]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5E6D84] dark:text-[#9EADC4]">
                Assigned Students
              </p>
              <p className="text-2xl font-bold text-[#071A3D] dark:text-[#F3EFE6] font-mono mt-0.5">
                {loading ? '...' : totalAssignedStudents}
              </p>
            </div>
          </div>

          {/* 2. Today's Classes */}
          <div className="bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5E6D84] dark:text-[#9EADC4]">
                Today's Sessions
              </p>
              <p className="text-2xl font-bold text-[#071A3D] dark:text-[#F3EFE6] font-mono mt-0.5">
                {loading ? '...' : todayClassesCount}
              </p>
            </div>
          </div>

          {/* 3. Attendance Submitted Today */}
          <div className="bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5E6D84] dark:text-[#9EADC4]">
                Submitted Today
              </p>
              <p className="text-2xl font-bold text-[#071A3D] dark:text-[#F3EFE6] font-mono mt-0.5">
                {loading ? '...' : `${submittedTodayCount} / ${todayClassesCount}`}
              </p>
            </div>
          </div>

          {/* 4. Students Needing Attention */}
          <div className="bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 flex items-center justify-center text-rose-700 dark:text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5E6D84] dark:text-[#9EADC4]">
                Needs Attention
              </p>
              <p className="text-2xl font-bold text-[#071A3D] dark:text-[#F3EFE6] font-mono mt-0.5">
                {loading ? '...' : needingAttentionCount}
              </p>
            </div>
          </div>
        </div>

        {/* Assigned Student Roster Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Assigned Students List */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D5] dark:border-[#1F3354]">
              <div>
                <h3 className="text-base font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                  Assigned Students Roster
                </h3>
                <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4]">
                  Students assigned exclusively to Faculty {teacherId}
                </p>
              </div>

              <button
                onClick={() => navigate('/teacher/students')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#8A7038] dark:text-[#D4BC82] hover:underline cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {loading ? (
              <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4] py-8 text-center">
                Loading student roster...
              </p>
            ) : students.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#5E6D84] dark:text-[#9EADC4]">
                No students assigned yet.
              </div>
            ) : (
              <div className="divide-y divide-[#E8E2D5] dark:divide-[#1F3354]">
                {students.map((student) => {
                  const todayRecord = todayAttendance.find((r) => r.studentId === student.studentId);
                  return (
                    <div
                      key={student.studentId}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FBF9F5] dark:hover:bg-white/5 px-2 rounded-lg transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#071A3D] dark:text-[#F3EFE6]">
                            {student.name}
                          </span>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#F4EFE6] dark:bg-[#15253F] text-[#8A7038] dark:text-[#D4BC82] font-semibold">
                            {student.studentId}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#5E6D84] dark:text-[#9EADC4]">
                          <span className="uppercase font-semibold text-[#071A3D] dark:text-[#D4BC82]">
                            {student.course}
                          </span>
                          <span>•</span>
                          <span>{student.classType === 'group' ? student.batchName || 'Group Class' : 'Individual 1-on-1'}</span>
                          <span>•</span>
                          <span className="uppercase">{student.classLanguage}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        {todayRecord ? (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold uppercase ${
                              todayRecord.status === 'PRESENT'
                                ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                : 'bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{todayRecord.status}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                            <Clock className="w-3 h-3" />
                            <span>Pending Today</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Col: Recent Progress Activity */}
          <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D5] dark:border-[#1F3354]">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#C5A869]" />
                <h3 className="text-base font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                  Recent Progress Notes
                </h3>
              </div>
              <button
                onClick={() => navigate('/teacher/progress')}
                className="text-xs font-semibold text-[#8A7038] dark:text-[#D4BC82] hover:underline cursor-pointer"
              >
                View
              </button>
            </div>

            {loading ? (
              <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4] py-6 text-center">
                Loading progress notes...
              </p>
            ) : recentProgress.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#5E6D84] dark:text-[#9EADC4]">
                No progress notes recorded yet.
              </div>
            ) : (
              <div className="space-y-4">
                {recentProgress.map((item) => (
                  <div
                    key={item.progressId}
                    className="p-3.5 rounded-xl bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                        {item.studentName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          item.progressStatus === 'ON_TRACK'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : item.progressStatus === 'NEEDS_ATTENTION'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                            : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                        }`}
                      >
                        {item.progressStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-[#41536E] dark:text-[#C5D2E5] line-clamp-2">
                      {item.lesson}
                    </p>
                    <span className="text-[10px] text-[#5E6D84] dark:text-[#9EADC4] block">
                      {formatKolkataDate(item.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};
