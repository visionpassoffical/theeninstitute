import React, { useState, useEffect } from 'react';
import { TeacherLayout } from './TeacherLayout';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { academicService } from '../../services/academicService';
import { attendanceService } from '../../services/attendanceService';
import { progressService } from '../../services/progressService';
import {
  Student,
  AttendanceSummary,
  StudentProgressRecord,
  CourseType,
  ClassType,
  ClassLanguage,
} from '../../types/academic';
import { formatKolkataDate } from '../../utils/timezone';
import {
  Search,
  Filter,
  Users,
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  CalendarCheck,
  TrendingUp,
  Clock,
} from 'lucide-react';

export const TeacherStudentsPage: React.FC = () => {
  const { userProfile } = useAuth();
  const { language } = useLanguage();

  const teacherId = userProfile?.teacherId || 'MT001';

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedClassType, setSelectedClassType] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  // Selected Student for Detail Modal
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentSummary, setStudentSummary] = useState<AttendanceSummary | null>(null);
  const [studentProgressHistory, setStudentProgressHistory] = useState<StudentProgressRecord[]>([]);
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const assigned = await academicService.getStudentsForTeacher(teacherId);
        setStudents(assigned);
      } catch (err) {
        console.warn('Failed to load students:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [teacherId]);

  // Open Student Details Modal
  const handleOpenStudent = async (student: Student) => {
    setSelectedStudent(student);
    setLoadingModal(true);
    try {
      const summary = await attendanceService.calculateStudentAttendanceSummary(
        teacherId,
        student.studentId
      );
      const progress = await progressService.getProgressForStudent(teacherId, student.studentId);
      setStudentSummary(summary);
      setStudentProgressHistory(progress);
    } catch (err) {
      console.warn('Modal load warning:', err);
    } finally {
      setLoadingModal(false);
    }
  };

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      s.name.toLowerCase().includes(query) ||
      s.studentId.toLowerCase().includes(query);

    const matchesCourse = selectedCourse === 'all' || s.course === selectedCourse;
    const matchesType = selectedClassType === 'all' || s.classType === selectedClassType;
    const matchesLang = selectedLanguage === 'all' || s.classLanguage === selectedLanguage;

    return matchesQuery && matchesCourse && matchesType && matchesLang;
  });

  return (
    <TeacherLayout
      activeTab="students"
      title="My Assigned Students"
      subtitle={`Displaying students assigned to Faculty ${teacherId}`}
    >
      <div className="space-y-6 text-start">
        {/* Search & Filter Header */}
        <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5E6D84] dark:text-[#9EADC4]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name or Student ID (e.g. STU-1001)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-xl text-[#071A3D] dark:text-[#F3EFE6] placeholder-[#5E6D84] focus:outline-hidden focus:border-[#C5A869]"
              />
            </div>

            {/* Total Badge */}
            <div className="flex items-center gap-2 self-end md:self-auto text-xs font-semibold text-[#5E6D84] dark:text-[#9EADC4]">
              <span>Showing:</span>
              <span className="px-2.5 py-1 rounded-md bg-[#F4EFE6] dark:bg-[#15253F] text-[#071A3D] dark:text-[#F3EFE6] font-mono font-bold">
                {filteredStudents.length} of {students.length}
              </span>
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#E8E2D5] dark:border-[#1F3354]">
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
                <option value="hifz">HIFZ (Memorization)</option>
                <option value="nazira">NAZIRA (Recitation)</option>
                <option value="fiqh">FIQH (Islamic Jurisprudence)</option>
                <option value="madrasa">MADRASA (Curriculum)</option>
              </select>
            </div>

            {/* Class Type Filter */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] block mb-1">
                Class Type
              </label>
              <select
                value={selectedClassType}
                onChange={(e) => setSelectedClassType(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-lg text-[#071A3D] dark:text-[#F3EFE6] focus:outline-hidden focus:border-[#C5A869]"
              >
                <option value="all">All Class Formats</option>
                <option value="group">Group Class (Max 5)</option>
                <option value="individual">Individual (1-on-1)</option>
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] block mb-1">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-lg text-[#071A3D] dark:text-[#F3EFE6] focus:outline-hidden focus:border-[#C5A869]"
              >
                <option value="all">All Languages</option>
                <option value="ml">Malayalam</option>
                <option value="en">English</option>
                <option value="ur">Urdu</option>
              </select>
            </div>
          </div>
        </div>

        {/* Student Table / Cards */}
        {loading ? (
          <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-12 text-center text-xs text-[#5E6D84] dark:text-[#9EADC4]">
            Loading assigned student directory...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-12 text-center space-y-2">
            <Users className="w-8 h-8 text-[#C5A869] mx-auto" />
            <h3 className="text-sm font-bold text-[#071A3D] dark:text-[#F3EFE6]">
              {students.length === 0 ? 'No students assigned yet.' : 'No students match your criteria.'}
            </h3>
            <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4]">
              {students.length === 0
                ? 'Your student roster is currently empty. The academic administration assigns students.'
                : 'Try adjusting your search keywords or filter dropdowns.'}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FBF9F5] dark:bg-[#060D1A] border-b border-[#E8E2D5] dark:border-[#1F3354] text-[#8A7038] dark:text-[#D4BC82] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Student ID</th>
                    <th className="px-5 py-3.5 font-bold">Name & Gender</th>
                    <th className="px-5 py-3.5 font-bold">Course</th>
                    <th className="px-5 py-3.5 font-bold">Class Type</th>
                    <th className="px-5 py-3.5 font-bold">Language</th>
                    <th className="px-5 py-3.5 font-bold">Status</th>
                    <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D5] dark:divide-[#1F3354]">
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.studentId}
                      className="hover:bg-[#FBF9F5] dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-4 font-mono font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                        {student.studentId}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                          {student.name}
                        </div>
                        <span className="text-[10px] uppercase text-[#5E6D84] dark:text-[#9EADC4]">
                          {student.gender}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold uppercase text-[#8A7038] dark:text-[#D4BC82]">
                          {student.course}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#5E6D84] dark:text-[#9EADC4]">
                        {student.classType === 'group'
                          ? student.batchName || 'Group Batch'
                          : 'Individual'}
                      </td>
                      <td className="px-5 py-4 uppercase font-semibold text-[#071A3D] dark:text-[#F3EFE6]">
                        {student.classLanguage}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          {student.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleOpenStudent(student)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F4EFE6] dark:bg-[#15253F] hover:bg-[#E8E2D5] dark:hover:bg-[#1F3354] text-[#071A3D] dark:text-[#F3EFE6] font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#C5A869]" />
                          <span>Profile</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-[#071A3D]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl text-start my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E8E2D5] dark:border-[#1F3354]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#C5A869] bg-[#C5A869]/10 px-2 py-0.5 rounded border border-[#C5A869]/30">
                    {selectedStudent.studentId}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    {selectedStudent.status}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                  {selectedStudent.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-lg text-[#5E6D84] hover:text-[#071A3D] dark:text-[#9EADC4] dark:hover:text-white bg-[#FBF9F5] dark:bg-[#060D1A] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingModal ? (
              <p className="text-xs text-center py-8 text-[#5E6D84]">
                Calculating real attendance & progress metrics...
              </p>
            ) : (
              <div className="space-y-6">
                {/* Academic Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354]">
                    <span className="text-[10px] uppercase font-bold text-[#8A7038] dark:text-[#D4BC82] block">
                      Course
                    </span>
                    <span className="font-bold text-[#071A3D] dark:text-[#F3EFE6] uppercase">
                      {selectedStudent.course}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354]">
                    <span className="text-[10px] uppercase font-bold text-[#8A7038] dark:text-[#D4BC82] block">
                      Class Format
                    </span>
                    <span className="font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                      {selectedStudent.classType === 'group'
                        ? selectedStudent.batchName || 'Group Class'
                        : 'Individual (1-on-1)'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354]">
                    <span className="text-[10px] uppercase font-bold text-[#8A7038] dark:text-[#D4BC82] block">
                      Language
                    </span>
                    <span className="font-bold text-[#071A3D] dark:text-[#F3EFE6] uppercase">
                      {selectedStudent.classLanguage === 'ml'
                        ? 'Malayalam'
                        : selectedStudent.classLanguage === 'ur'
                        ? 'Urdu'
                        : 'English'}
                    </span>
                  </div>
                </div>

                {/* Real Attendance Summary Card */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-[#F4EFE6]/60 to-[#FBF9F5] dark:from-[#0B172B] dark:to-[#060D1A] border border-[#C5A869]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-[#C5A869]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#071A3D] dark:text-[#F3EFE6]">
                        Verified Attendance Summary
                      </h4>
                    </div>
                    {studentSummary?.hasData && (
                      <span className="font-mono text-sm font-bold text-[#8A7038] dark:text-[#D4BC82]">
                        {studentSummary.attendancePercentage}% Attendance Rate
                      </span>
                    )}
                  </div>

                  {!studentSummary?.hasData ? (
                    <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4] italic">
                      No attendance data yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#E8E2D5] dark:border-[#1F3354]">
                      <div className="p-2.5 rounded-lg bg-white dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354]">
                        <span className="text-[10px] text-[#5E6D84] dark:text-[#9EADC4] uppercase block">
                          Total Classes
                        </span>
                        <span className="font-mono font-bold text-base text-[#071A3D] dark:text-[#F3EFE6]">
                          {studentSummary.totalClasses}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                        <span className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase font-semibold block">
                          Present
                        </span>
                        <span className="font-mono font-bold text-base text-emerald-700 dark:text-emerald-300">
                          {studentSummary.presentCount}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                        <span className="text-[10px] text-rose-800 dark:text-rose-300 uppercase font-semibold block">
                          Absent
                        </span>
                        <span className="font-mono font-bold text-base text-rose-700 dark:text-rose-300">
                          {studentSummary.absentCount}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress History List */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#C5A869]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#071A3D] dark:text-[#F3EFE6]">
                      Academic Progress & Lesson Logs
                    </h4>
                  </div>

                  {studentProgressHistory.length === 0 ? (
                    <div className="p-4 rounded-xl bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] text-center text-xs text-[#5E6D84]">
                      No recorded progress notes for this student yet.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                      {studentProgressHistory.map((item) => (
                        <div
                          key={item.progressId}
                          className="p-3.5 rounded-xl bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#8A7038] dark:text-[#D4BC82]">
                              {formatKolkataDate(item.createdAt)}
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
                          <div>
                            <span className="font-bold text-[#071A3D] dark:text-white">
                              Lesson Covered:{' '}
                            </span>
                            <span className="text-[#41536E] dark:text-[#C5D2E5]">{item.lesson}</span>
                          </div>
                          {item.homework && (
                            <div>
                              <span className="font-bold text-[#071A3D] dark:text-white">
                                Homework:{' '}
                              </span>
                              <span className="text-[#41536E] dark:text-[#C5D2E5]">{item.homework}</span>
                            </div>
                          )}
                          {item.remarks && (
                            <p className="text-[11px] text-[#5E6D84] dark:text-[#9EADC4] italic">
                              Remarks: “{item.remarks}”
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[#E8E2D5] dark:border-[#1F3354] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#071A3D] text-[#F3EFE6] dark:bg-[#C5A869] dark:text-[#071A3D] rounded-lg transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </TeacherLayout>
  );
};
