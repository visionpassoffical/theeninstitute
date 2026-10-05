import React, { useState, useEffect } from 'react';
import { TeacherLayout } from './TeacherLayout';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { attendanceService } from '../../services/attendanceService';
import { academicService } from '../../services/academicService';
import { AttendanceRecord, Student } from '../../types/academic';
import { formatKolkataDate, formatKolkataTime } from '../../utils/timezone';
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Calendar,
  Clock,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

export const TeacherAttendancePage: React.FC = () => {
  const { userProfile } = useAuth();
  const { language } = useLanguage();

  const teacherId = userProfile?.teacherId || 'MT001';

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedStudentId, setSelectedStudentId] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    try {
      const attList = await attendanceService.getAttendanceForTeacher(teacherId);
      const stuList = await academicService.getStudentsForTeacher(teacherId);
      setRecords(attList);
      setStudents(stuList);
    } catch (err) {
      console.warn('Attendance load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [teacherId]);

  // Filtered attendance records
  const filteredRecords = records.filter((r) => {
    const matchesStudent = selectedStudentId === 'all' || r.studentId === selectedStudentId;
    const matchesCourse = selectedCourse === 'all' || r.course === selectedCourse;
    const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;
    const matchesDate = !dateFilter || r.date === dateFilter;

    return matchesStudent && matchesCourse && matchesStatus && matchesDate;
  });

  // Overall Attendance Summary Calculations (Section 14)
  const totalRecords = filteredRecords.length;
  const presentCount = filteredRecords.filter((r) => r.status === 'PRESENT').length;
  const absentCount = filteredRecords.filter((r) => r.status === 'ABSENT').length;
  const attendanceRate =
    totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

  return (
    <TeacherLayout
      activeTab="attendance"
      title="Attendance History & Audit"
      subtitle={`Verified attendance records submitted by Faculty ${teacherId}`}
    >
      <div className="space-y-6 text-start">
        {/* Summary Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#071A3D]/5 dark:bg-[#C5A869]/10 flex items-center justify-center text-[#071A3D] dark:text-[#C5A869]">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5E6D84] dark:text-[#9EADC4]">
                Total Records
              </p>
              <p className="text-2xl font-bold font-mono text-[#071A3D] dark:text-[#F3EFE6] mt-0.5">
                {totalRecords}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5E6D84] dark:text-[#9EADC4]">
                Present
              </p>
              <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                {presentCount}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-700 dark:text-rose-400">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5E6D84] dark:text-[#9EADC4]">
                Absent
              </p>
              <p className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-0.5">
                {absentCount}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5E6D84] dark:text-[#9EADC4]">
                Attendance Rate
              </p>
              <p className="text-2xl font-bold font-mono text-[#8A7038] dark:text-[#D4BC82] mt-0.5">
                {totalRecords > 0 ? `${attendanceRate}%` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#C5A869]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#071A3D] dark:text-[#F3EFE6]">
                Filter Attendance Log
              </h3>
            </div>
            <button
              onClick={() => {
                setSelectedStudentId('all');
                setSelectedCourse('all');
                setSelectedStatus('all');
                setDateFilter('');
              }}
              className="text-xs text-[#8A7038] dark:text-[#D4BC82] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Student Filter */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] block mb-1">
                Student
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-lg text-[#071A3D] dark:text-[#F3EFE6] focus:outline-hidden focus:border-[#C5A869]"
              >
                <option value="all">All Assigned Students</option>
                {students.map((s) => (
                  <option key={s.studentId} value={s.studentId}>
                    {s.name} ({s.studentId})
                  </option>
                ))}
              </select>
            </div>

            {/* Course Filter */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] block mb-1">
                Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-lg text-[#071A3D] dark:text-[#F3EFE6] focus:outline-hidden focus:border-[#C5A869]"
              >
                <option value="all">All Courses</option>
                <option value="hifz">HIFZ</option>
                <option value="nazira">NAZIRA</option>
                <option value="fiqh">FIQH</option>
                <option value="madrasa">MADRASA</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] block mb-1">
                Attendance Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-lg text-[#071A3D] dark:text-[#F3EFE6] focus:outline-hidden focus:border-[#C5A869]"
              >
                <option value="all">All Statuses</option>
                <option value="PRESENT">PRESENT</option>
                <option value="ABSENT">ABSENT</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] block mb-1">
                Date (YYYY-MM-DD)
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-lg text-[#071A3D] dark:text-[#F3EFE6] focus:outline-hidden focus:border-[#C5A869]"
              />
            </div>
          </div>
        </div>

        {/* Attendance Records Table */}
        {loading ? (
          <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-12 text-center text-xs text-[#5E6D84]">
            Loading attendance records...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-12 text-center space-y-2">
            <ClipboardList className="w-8 h-8 text-[#C5A869] mx-auto" />
            <h3 className="text-sm font-bold text-[#071A3D] dark:text-[#F3EFE6]">
              No attendance records found.
            </h3>
            <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4]">
              {records.length === 0
                ? 'You have not submitted any attendance records yet.'
                : 'No records match the selected date or filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FBF9F5] dark:bg-[#060D1A] border-b border-[#E8E2D5] dark:border-[#1F3354] text-[#8A7038] dark:text-[#D4BC82] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Date (IST)</th>
                    <th className="px-5 py-3.5 font-bold">Student Name & ID</th>
                    <th className="px-5 py-3.5 font-bold">Course</th>
                    <th className="px-5 py-3.5 font-bold">Class Type</th>
                    <th className="px-5 py-3.5 font-bold">Language</th>
                    <th className="px-5 py-3.5 font-bold">Status</th>
                    <th className="px-5 py-3.5 font-bold text-right">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D5] dark:divide-[#1F3354]">
                  {filteredRecords.map((r) => (
                    <tr
                      key={r.attendanceId}
                      className="hover:bg-[#FBF9F5] dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-4 font-mono font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                        {r.date}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                          {r.studentName}
                        </div>
                        <span className="font-mono text-[10px] text-[#5E6D84] dark:text-[#9EADC4]">
                          {r.studentId}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold uppercase text-[#8A7038] dark:text-[#D4BC82]">
                          {r.course}
                        </span>
                      </td>
                      <td className="px-5 py-4 uppercase text-[#5E6D84] dark:text-[#9EADC4]">
                        {r.classType}
                      </td>
                      <td className="px-5 py-4 uppercase font-semibold text-[#071A3D] dark:text-[#F3EFE6]">
                        {r.classLanguage}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                            r.status === 'PRESENT'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                          }`}
                        >
                          {r.status === 'PRESENT' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          <span>{r.status}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-mono text-[11px] text-[#5E6D84] dark:text-[#9EADC4]">
                        {formatKolkataTime(r.submittedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
};
