import React, { useState, useEffect } from 'react';
import { TeacherLayout } from './TeacherLayout';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { academicService } from '../../services/academicService';
import { progressService } from '../../services/progressService';
import { Student, StudentProgressRecord, ProgressStatus, CourseType } from '../../types/academic';
import { formatKolkataDate, formatKolkataTime } from '../../utils/timezone';
import {
  TrendingUp,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  X,
  Save,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';

export const TeacherProgressPage: React.FC = () => {
  const { userProfile } = useAuth();
  const { language } = useLanguage();

  const teacherId = userProfile?.teacherId || 'MT001';
  const teacherName = userProfile?.displayName || 'Faculty Member';

  const [students, setStudents] = useState<Student[]>([]);
  const [progressList, setProgressList] = useState<StudentProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form fields
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [lesson, setLesson] = useState('');
  const [homework, setHomework] = useState('');
  const [remarks, setRemarks] = useState('');
  const [progressStatus, setProgressStatus] = useState<ProgressStatus>('ON_TRACK');

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const assigned = await academicService.getStudentsForTeacher(teacherId);
      const progressRecords = await progressService.getProgressForTeacher(teacherId);
      setStudents(assigned);
      setProgressList(progressRecords);

      if (assigned.length > 0 && !selectedStudentId) {
        setSelectedStudentId(assigned[0].studentId);
      }
    } catch (err) {
      console.warn('Progress load warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [teacherId]);

  const handleOpenAddModal = (defaultStudentId?: string) => {
    if (defaultStudentId) {
      setSelectedStudentId(defaultStudentId);
    } else if (students.length > 0) {
      setSelectedStudentId(students[0].studentId);
    }
    setLesson('');
    setHomework('');
    setRemarks('');
    setProgressStatus('ON_TRACK');
    setFeedback(null);
    setIsModalOpen(true);
  };

  const handleSaveProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !lesson.trim()) {
      return;
    }

    const studentObj = students.find((s) => s.studentId === selectedStudentId);
    if (!studentObj) return;

    setSaving(true);
    setFeedback(null);

    try {
      await progressService.saveProgress({
        studentId: studentObj.studentId,
        studentName: studentObj.name,
        teacherId,
        course: studentObj.course,
        lesson: lesson.trim(),
        homework: homework.trim(),
        remarks: remarks.trim(),
        progressStatus,
        updatedBy: teacherName,
      });

      // Reload
      const updatedList = await progressService.getProgressForTeacher(teacherId);
      setProgressList(updatedList);
      setIsModalOpen(false);
    } catch (err: any) {
      setFeedback('Unable to save progress entry.');
    } finally {
      setSaving(false);
    }
  };

  const filteredProgress = progressList.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.studentName.toLowerCase().includes(q) ||
      item.studentId.toLowerCase().includes(q) ||
      item.lesson.toLowerCase().includes(q) ||
      item.course.toLowerCase().includes(q)
    );
  });

  return (
    <TeacherLayout
      activeTab="progress"
      title="Student Learning & Progress Tracking"
      subtitle={`Record lesson updates, homework, and observations for assigned students`}
    >
      <div className="space-y-6 text-start">
        {/* Top Header Action Bar */}
        <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#071A3D] dark:text-[#F3EFE6]">
              Academic Progress Log
            </h2>
            <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4]">
              Track syllabus completion, memorized surahs, and daily homework.
            </p>
          </div>

          <button
            onClick={() => handleOpenAddModal()}
            disabled={students.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A869] text-[#071A3D] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#D4BC82] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record New Lesson / Progress</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] p-4 shadow-xs">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5E6D84] dark:text-[#9EADC4]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search progress logs by student, ID, lesson..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-lg text-[#071A3D] dark:text-[#F3EFE6] placeholder-[#5E6D84] focus:outline-hidden focus:border-[#C5A869]"
            />
          </div>
        </div>

        {/* Progress List */}
        {loading ? (
          <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-12 text-center text-xs text-[#5E6D84]">
            Loading progress records...
          </div>
        ) : filteredProgress.length === 0 ? (
          <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-12 text-center space-y-2">
            <TrendingUp className="w-8 h-8 text-[#C5A869] mx-auto" />
            <h3 className="text-sm font-bold text-[#071A3D] dark:text-[#F3EFE6]">
              No progress records found.
            </h3>
            <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4]">
              Click 'Record New Lesson / Progress' above to log your first student progress report.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProgress.map((item) => (
              <div
                key={item.progressId}
                className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] p-5 sm:p-6 shadow-xs space-y-4 text-start"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E2D5] dark:border-[#1F3354]">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm text-[#071A3D] dark:text-[#F3EFE6]">
                      {item.studentName}
                    </span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#F4EFE6] dark:bg-[#15253F] text-[#8A7038] dark:text-[#D4BC82]">
                      {item.studentId}
                    </span>
                    <span className="font-bold uppercase text-[11px] text-[#071A3D] dark:text-[#D4BC82] bg-[#F4EFE6] dark:bg-white/5 px-2 py-0.5 rounded">
                      {item.course}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${
                        item.progressStatus === 'ON_TRACK'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : item.progressStatus === 'NEEDS_ATTENTION'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                          : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                      }`}
                    >
                      {item.progressStatus.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-[#5E6D84] dark:text-[#9EADC4]">
                      {formatKolkataDate(item.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Lesson & Homework Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] block">
                      Lesson / Surah Covered
                    </span>
                    <p className="text-[#071A3D] dark:text-[#F3EFE6] font-medium leading-relaxed">
                      {item.lesson}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] block">
                      Assigned Homework
                    </span>
                    <p className="text-[#071A3D] dark:text-[#F3EFE6] font-medium leading-relaxed">
                      {item.homework || 'No specific homework assigned.'}
                    </p>
                  </div>
                </div>

                {item.remarks && (
                  <div className="p-3 rounded-lg bg-[#F4EFE6]/40 dark:bg-white/5 text-xs text-[#5E6D84] dark:text-[#9EADC4] italic">
                    Teacher Remarks: “{item.remarks}”
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Record Progress Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#071A3D]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl text-start my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5] dark:border-[#1F3354]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#071A3D] text-[#C5A869] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                  Record Student Progress
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded text-[#5E6D84] hover:text-[#071A3D] dark:text-[#9EADC4] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgress} className="space-y-4 text-xs">
              {/* Select Student */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] block mb-1">
                  Select Assigned Student *
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-lg text-[#071A3D] dark:text-[#F3EFE6] focus:outline-hidden focus:border-[#C5A869]"
                >
                  {students.map((s) => (
                    <option key={s.studentId} value={s.studentId}>
                      {s.name} ({s.studentId}) — Course: {s.course.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Progress Status */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] block mb-1">
                  Progress Status Evaluation *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['ON_TRACK', 'NEEDS_ATTENTION', 'COMPLETED'] as ProgressStatus[]).map(
                    (status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setProgressStatus(status)}
                        className={`py-2 px-2 text-center rounded-lg font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
                          progressStatus === status
                            ? status === 'ON_TRACK'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : status === 'NEEDS_ATTENTION'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-blue-600 text-white shadow-xs'
                            : 'bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] text-[#5E6D84] dark:text-[#9EADC4]'
                        }`}
                      >
                        {status.replace('_', ' ')}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Lesson Covered */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] block mb-1">
                  Lesson / Surah / Portion Covered *
                </label>
                <textarea
                  rows={2}
                  value={lesson}
                  onChange={(e) => setLesson(e.target.value)}
                  required
                  placeholder="e.g. Surah Al-Kahf Ayah 1-10 revision, Ayah 11-15 new memorization..."
                  className="w-full px-3 py-2 bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-lg text-[#071A3D] dark:text-[#F3EFE6] placeholder-[#5E6D84] focus:outline-hidden focus:border-[#C5A869]"
                />
              </div>

              {/* Homework */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] block mb-1">
                  Assigned Homework / Daily Target
                </label>
                <textarea
                  rows={2}
                  value={homework}
                  onChange={(e) => setHomework(e.target.value)}
                  placeholder="e.g. Practice Ayah 11-15 three times with tajweed rules..."
                  className="w-full px-3 py-2 bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-lg text-[#071A3D] dark:text-[#F3EFE6] placeholder-[#5E6D84] focus:outline-hidden focus:border-[#C5A869]"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A7038] dark:text-[#D4BC82] block mb-1">
                  Teacher Observations / Remarks
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Good rhythm, needs extra focus on letter 'Qaf' makhraj..."
                  className="w-full px-3 py-2 bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded-lg text-[#071A3D] dark:text-[#F3EFE6] placeholder-[#5E6D84] focus:outline-hidden focus:border-[#C5A869]"
                />
              </div>

              {feedback && (
                <p className="text-rose-600 dark:text-rose-400 font-semibold">{feedback}</p>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E2D5] dark:border-[#1F3354]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-[#5E6D84] dark:text-[#9EADC4] hover:text-[#071A3D] dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !lesson.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A869] text-[#071A3D] font-bold uppercase tracking-wider rounded-lg hover:bg-[#D4BC82] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Progress Entry'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </TeacherLayout>
  );
};
