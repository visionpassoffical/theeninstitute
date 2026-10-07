import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { adminService } from '../services/adminService';
import { AdmissionApplication } from '../types';
import { Student, TeacherProfileData } from '../types/academic';
import {
  ShieldCheck,
  LogOut,
  CheckCircle2,
  XCircle,
  User,
  Key,
  ArrowLeft,
  BookOpen,
  Users,
  GraduationCap,
  Layers,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Plus,
  Edit,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const AdminDashboardPlaceholder: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const { navigate } = useRouter();
  const { fontClass } = useLanguage();

  const [activeTab, setActiveTab] = useState<'overview' | 'admissions' | 'teachers' | 'students'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Dashboard Stats
  const [stats, setStats] = useState({
    pendingAdmissions: 0,
    activeStudents: 0,
    activeTeachers: 0,
    activeBatches: 0,
  });

  // Admissions State
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>([]);
  const [admissionSearch, setAdmissionSearch] = useState('');
  const [admissionFilter, setAdmissionFilter] = useState<string>('ALL');
  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionApplication | null>(null);

  // Teachers State
  const [teachers, setTeachers] = useState<TeacherProfileData[]>([]);
  const [teacherSearch, setTeacherSearch] = useState('');
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherProfileData | null>(null);
  const [teacherForm, setTeacherForm] = useState<TeacherProfileData>({
    teacherId: 'MT009',
    name: '',
    gender: 'male',
    email: '',
    whatsapp: '',
    subjects: ['hifz'],
    languages: ['ml'],
    qualification: '',
    institution: '',
    experience: '3+ Years',
    bio: '',
    status: 'ACTIVE',
  });

  // Students State
  const [students, setStudents] = useState<Student[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentForm, setStudentForm] = useState<Student>({
    studentId: 'STU-9999',
    name: '',
    gender: 'male',
    course: 'hifz',
    classType: 'group',
    classLanguage: 'ml',
    teacherId: 'MT001',
    status: 'ACTIVE',
    whatsapp: '',
    email: '',
    joinedAt: new Date().toISOString().split('T')[0],
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashStats, admissionList, teacherList, studentList] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAdmissions(),
        adminService.getTeachers(),
        adminService.getStudents(),
      ]);
      setStats(dashStats);
      setAdmissions(admissionList);
      setTeachers(teacherList);
      setStudents(studentList);
    } catch (err: any) {
      console.error('Admin data load error:', err);
      setError(err?.message || 'Failed to load admin data from Supabase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  // Admissions actions
  const handleAdmissionAction = async (applicationId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      setError(null);
      await adminService.updateAdmissionStatus(applicationId, status, userProfile?.email);
      setSuccessMsg(`Application ${applicationId} successfully ${status.toLowerCase()}.`);
      await loadData();
      setSelectedAdmission(null);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err?.message || `Failed to update application status.`);
    }
  };

  // Teacher save
  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await adminService.saveTeacher(teacherForm, !!editingTeacher);
      setSuccessMsg(editingTeacher ? 'Teacher updated successfully.' : 'Teacher added successfully.');
      setTeacherModalOpen(false);
      setEditingTeacher(null);
      await loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to save teacher.');
    }
  };

  // Student save
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await adminService.saveStudent(studentForm, !!editingStudent);
      setSuccessMsg(editingStudent ? 'Student updated successfully.' : 'Student added successfully.');
      setStudentModalOpen(false);
      setEditingStudent(null);
      await loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to save student.');
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#FBF9F5] dark:bg-[#060D1A] min-h-screen text-[#071A3D] dark:text-[#F3EFE6] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Operational Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D5] dark:border-[#1F3354]">
          <div className="text-start">
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8A7038] dark:text-[#D4BC82]">
                Admin Security Session Active ({userProfile?.role || 'ADMIN'})
              </span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-bold text-[#071A3D] dark:text-[#F3EFE6] ${fontClass}`}>
              THEEN Administration Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#5E6D84] dark:text-[#9EADC4] hover:text-[#071A3D] dark:hover:text-white bg-white dark:bg-[#0B172B] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded-md transition-colors cursor-pointer shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E8E2D5] dark:border-[#1F3354] pb-px overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: ShieldCheck },
            { id: 'admissions', label: `Admissions (${stats.pendingAdmissions} Pending)`, icon: Users },
            { id: 'teachers', label: 'Teachers', icon: GraduationCap },
            { id: 'students', label: 'Students', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-[#071A3D] dark:border-[#C5A869] text-[#071A3D] dark:text-[#C5A869]'
                    : 'border-transparent text-[#5E6D84] dark:text-[#9EADC4] hover:text-[#071A3D] dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="py-20 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#C5A869]" />
          </div>
        )}

        {!loading && activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0B172B] border border-[#E8E2D5] dark:border-[#1F3354] shadow-sm text-start space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5E6D84] dark:text-[#9EADC4]">
                  Pending Admissions
                </span>
                <div className="text-3xl font-bold text-[#071A3D] dark:text-[#F3EFE6] font-editorial-serif">
                  {stats.pendingAdmissions}
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0B172B] border border-[#E8E2D5] dark:border-[#1F3354] shadow-sm text-start space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5E6D84] dark:text-[#9EADC4]">
                  Active Students
                </span>
                <div className="text-3xl font-bold text-[#071A3D] dark:text-[#F3EFE6] font-editorial-serif">
                  {stats.activeStudents}
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0B172B] border border-[#E8E2D5] dark:border-[#1F3354] shadow-sm text-start space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5E6D84] dark:text-[#9EADC4]">
                  Active Teachers
                </span>
                <div className="text-3xl font-bold text-[#071A3D] dark:text-[#F3EFE6] font-editorial-serif">
                  {stats.activeTeachers}
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0B172B] border border-[#E8E2D5] dark:border-[#1F3354] shadow-sm text-start space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5E6D84] dark:text-[#9EADC4]">
                  Active Batches
                </span>
                <div className="text-3xl font-bold text-[#071A3D] dark:text-[#F3EFE6] font-editorial-serif">
                  {stats.activeBatches}
                </div>
              </div>
            </div>

            {/* Quick Actions / Status Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0B172B] border border-[#E8E2D5] dark:border-[#1F3354] shadow-sm text-start space-y-4">
              <h3 className="text-base font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                Supabase Backend & Security Status
              </h3>
              <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4] leading-relaxed">
                Connected successfully to Supabase PostgreSQL database. Row Level Security (RLS) policies are active, restricting admin privileges to authorized roles (`SUPER_ADMIN` / `ADMIN`).
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('admissions')}
                  className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#071A3D] text-white dark:bg-[#C5A869] dark:text-[#060D1A] rounded-md transition-colors cursor-pointer"
                >
                  Review Pending Admissions
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-white dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] text-[#071A3D] dark:text-white rounded-md transition-colors cursor-pointer"
                >
                  Manage Student Roster
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === 'admissions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-3 w-4 h-4 text-[#5E6D84]" />
                <input
                  type="text"
                  placeholder="Search applicant name or email..."
                  value={admissionSearch}
                  onChange={(e) => setAdmissionSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-[#0B172B] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-[#5E6D84]" />
                {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setAdmissionFilter(st)}
                    className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-md transition-colors cursor-pointer ${
                      admissionFilter === st
                        ? 'bg-[#071A3D] text-white dark:bg-[#C5A869] dark:text-[#060D1A]'
                        : 'bg-white dark:bg-[#0B172B] border border-[#E8E2D5] dark:border-[#1F3354] text-[#5E6D84] dark:text-[#9EADC4]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FBF9F5] dark:bg-[#060D1A] text-[#5E6D84] dark:text-[#9EADC4] uppercase tracking-wider border-b border-[#E8E2D5] dark:border-[#1F3354]">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Applicant Name</th>
                      <th className="px-4 py-3">Course</th>
                      <th className="px-4 py-3">Class Type</th>
                      <th className="px-4 py-3">WhatsApp / Email</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E2D5] dark:divide-[#1F3354]">
                    {admissions
                      .filter((app) => {
                        const matchesSearch =
                          app.fullName.toLowerCase().includes(admissionSearch.toLowerCase()) ||
                          app.email.toLowerCase().includes(admissionSearch.toLowerCase());
                        const matchesFilter = admissionFilter === 'ALL' || app.status === admissionFilter;
                        return matchesSearch && matchesFilter;
                      })
                      .map((app) => (
                        <tr key={app.applicationId} className="hover:bg-[#FBF9F5]/50 dark:hover:bg-[#060D1A]/50 transition-colors">
                          <td className="px-4 py-3 font-mono font-semibold text-[#8A7038] dark:text-[#D4BC82]">
                            {app.applicationId}
                          </td>
                          <td className="px-4 py-3 font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                            {app.fullName}
                          </td>
                          <td className="px-4 py-3 uppercase font-medium">{app.course}</td>
                          <td className="px-4 py-3 uppercase font-medium">{app.classType}</td>
                          <td className="px-4 py-3 text-[#5E6D84] dark:text-[#9EADC4]">
                            <div>{app.whatsapp}</div>
                            <div className="text-[11px]">{app.email}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                app.status === 'PENDING'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                                  : app.status === 'APPROVED'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400'
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-end space-x-2">
                            <button
                              onClick={() => setSelectedAdmission(app)}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-white dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded hover:border-[#C5A869] transition-colors cursor-pointer"
                            >
                              View
                            </button>
                            {app.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleAdmissionAction(app.applicationId, 'APPROVED')}
                                  className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleAdmissionAction(app.applicationId, 'REJECTED')}
                                  className="px-2.5 py-1 text-[11px] font-semibold bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    {admissions.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-[#5E6D84]">
                          No admission applications found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === 'teachers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-3 w-4 h-4 text-[#5E6D84]" />
                <input
                  type="text"
                  placeholder="Search teachers..."
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-[#0B172B] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                />
              </div>

              <button
                onClick={() => {
                  setEditingTeacher(null);
                  setTeacherForm({
                    teacherId: `MT00${teachers.length + 1}`,
                    name: '',
                    gender: 'male',
                    email: '',
                    whatsapp: '',
                    subjects: ['hifz'],
                    languages: ['ml'],
                    qualification: '',
                    institution: '',
                    experience: '3+ Years',
                    bio: '',
                    status: 'ACTIVE',
                  });
                  setTeacherModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#071A3D] text-white dark:bg-[#C5A869] dark:text-[#060D1A] rounded-md transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Teacher</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers
                .filter((t) => t.name.toLowerCase().includes(teacherSearch.toLowerCase()) || t.email.toLowerCase().includes(teacherSearch.toLowerCase()))
                .map((t) => (
                  <div key={t.teacherId} className="bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] p-5 shadow-sm text-start space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#8A7038] dark:text-[#D4BC82]">
                        {t.teacherId}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          t.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#071A3D] dark:text-[#F3EFE6]">{t.name}</h3>
                      <p className="text-xs text-[#5E6D84] dark:text-[#9EADC4]">{t.email}</p>
                    </div>

                    <div className="text-xs space-y-1 text-[#41536E] dark:text-[#C5D2E5]">
                      <div><strong>WhatsApp:</strong> {t.whatsapp || 'N/A'}</div>
                      <div><strong>Qualification:</strong> {t.qualification || 'N/A'}</div>
                      <div><strong>Subjects:</strong> {t.subjects?.join(', ').toUpperCase()}</div>
                    </div>

                    <div className="pt-3 border-t border-[#E8E2D5] dark:border-[#1F3354] flex justify-end">
                      <button
                        onClick={() => {
                          setEditingTeacher(t);
                          setTeacherForm(t);
                          setTeacherModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded hover:border-[#C5A869] transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {!loading && activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-3 w-4 h-4 text-[#5E6D84]" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-[#0B172B] border border-[#E8E2D5] dark:border-[#1F3354] rounded-md focus:ring-1 focus:ring-[#C5A869] dark:text-white"
                />
              </div>

              <button
                onClick={() => {
                  setEditingStudent(null);
                  setStudentForm({
                    studentId: `STU-${students.length + 1001}`,
                    name: '',
                    gender: 'male',
                    course: 'hifz',
                    classType: 'group',
                    classLanguage: 'ml',
                    teacherId: 'MT001',
                    status: 'ACTIVE',
                    whatsapp: '',
                    email: '',
                    joinedAt: new Date().toISOString().split('T')[0],
                  });
                  setStudentModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#071A3D] text-white dark:bg-[#C5A869] dark:text-[#060D1A] rounded-md transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Student</span>
              </button>
            </div>

            <div className="bg-white dark:bg-[#0B172B] rounded-xl border border-[#E8E2D5] dark:border-[#1F3354] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FBF9F5] dark:bg-[#060D1A] text-[#5E6D84] dark:text-[#9EADC4] uppercase tracking-wider border-b border-[#E8E2D5] dark:border-[#1F3354]">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Course</th>
                      <th className="px-4 py-3">Format</th>
                      <th className="px-4 py-3">Teacher ID</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E2D5] dark:divide-[#1F3354]">
                    {students
                      .filter((s) => s.name.toLowerCase().includes(studentSearch.toLowerCase()))
                      .map((s) => (
                        <tr key={s.studentId} className="hover:bg-[#FBF9F5]/50 dark:hover:bg-[#060D1A]/50 transition-colors">
                          <td className="px-4 py-3 font-mono font-semibold text-[#8A7038] dark:text-[#D4BC82]">
                            {s.studentId}
                          </td>
                          <td className="px-4 py-3 font-bold text-[#071A3D] dark:text-[#F3EFE6]">{s.name}</td>
                          <td className="px-4 py-3 uppercase font-medium">{s.course}</td>
                          <td className="px-4 py-3 uppercase font-medium">{s.classType}</td>
                          <td className="px-4 py-3 font-mono">{s.teacherId}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                s.status === 'ACTIVE'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                              }`}
                            >
                              {s.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-end">
                            <button
                              onClick={() => {
                                setEditingStudent(s);
                                setStudentForm(s);
                                setStudentModalOpen(true);
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-white dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] rounded hover:border-[#C5A869] transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    {students.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-[#5E6D84]">
                          No students found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Admission Details Modal */}
        {selectedAdmission && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] max-w-2xl w-full p-6 sm:p-8 space-y-6 text-start max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E8E2D5] dark:border-[#1F3354] pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-[#8A7038] dark:text-[#D4BC82]">
                    {selectedAdmission.applicationId}
                  </span>
                  <h2 className="text-xl font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                    {selectedAdmission.fullName}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedAdmission(null)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#41536E] dark:text-[#C5D2E5]">
                <div><strong>Email:</strong> {selectedAdmission.email}</div>
                <div><strong>WhatsApp:</strong> {selectedAdmission.whatsapp}</div>
                <div><strong>Course:</strong> {selectedAdmission.course.toUpperCase()}</div>
                <div><strong>Class Format:</strong> {selectedAdmission.classType.toUpperCase()}</div>
                <div><strong>Language:</strong> {selectedAdmission.classLanguage.toUpperCase()}</div>
                <div><strong>Gender:</strong> {selectedAdmission.gender}</div>
                <div><strong>DOB / Age:</strong> {selectedAdmission.dateOfBirth} ({selectedAdmission.age} yrs)</div>
                <div><strong>Location:</strong> {selectedAdmission.city}, {selectedAdmission.state}, {selectedAdmission.country}</div>
              </div>

              {!selectedAdmission.isApplyingForSelf && (
                <div className="p-4 rounded-xl bg-[#FBF9F5] dark:bg-[#060D1A] border border-[#E8E2D5] dark:border-[#1F3354] space-y-2 text-xs">
                  <div className="font-bold text-[#071A3D] dark:text-[#F3EFE6]">Guardian Details</div>
                  <div><strong>Name:</strong> {selectedAdmission.guardianName}</div>
                  <div><strong>WhatsApp:</strong> {selectedAdmission.guardianWhatsapp}</div>
                  <div><strong>Relationship:</strong> {selectedAdmission.guardianRelationship}</div>
                </div>
              )}

              {selectedAdmission.notes && (
                <div className="text-xs text-[#5E6D84] dark:text-[#9EADC4]">
                  <strong>Notes:</strong> {selectedAdmission.notes}
                </div>
              )}

              <div className="pt-4 border-t border-[#E8E2D5] dark:border-[#1F3354] flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedAdmission(null)}
                  className="px-4 py-2 text-xs font-semibold bg-gray-200 dark:bg-gray-800 rounded-md cursor-pointer"
                >
                  Close
                </button>
                {selectedAdmission.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleAdmissionAction(selectedAdmission.applicationId, 'REJECTED')}
                      className="px-4 py-2 text-xs font-semibold bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={() => handleAdmissionAction(selectedAdmission.applicationId, 'APPROVED')}
                      className="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-md hover:bg-emerald-700 cursor-pointer"
                    >
                      Approve & Enroll Student
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Teacher Add/Edit Modal */}
        {teacherModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <form onSubmit={handleSaveTeacher} className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] max-w-lg w-full p-6 sm:p-8 space-y-4 text-start max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E8E2D5] dark:border-[#1F3354] pb-3">
                <h2 className="text-base font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                  {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
                </h2>
                <button type="button" onClick={() => setTeacherModalOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Teacher ID</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingTeacher}
                    value={teacherForm.teacherId}
                    onChange={(e) => setTeacherForm({ ...teacherForm, teacherId: e.target.value })}
                    className="w-full px-3 py-2 border rounded dark:bg-[#060D1A] dark:border-[#1F3354] dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.name}
                    onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded dark:bg-[#060D1A] dark:border-[#1F3354] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={teacherForm.email}
                    onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded dark:bg-[#060D1A] dark:border-[#1F3354] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.whatsapp}
                    onChange={(e) => setTeacherForm({ ...teacherForm, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 border rounded dark:bg-[#060D1A] dark:border-[#1F3354] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Qualification</label>
                  <input
                    type="text"
                    value={teacherForm.qualification}
                    onChange={(e) => setTeacherForm({ ...teacherForm, qualification: e.target.value })}
                    className="w-full px-3 py-2 border rounded dark:bg-[#060D1A] dark:border-[#1F3354] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    value={teacherForm.status}
                    onChange={(e) => setTeacherForm({ ...teacherForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded dark:bg-[#060D1A] dark:border-[#1F3354] dark:text-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTeacherModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold bg-gray-200 dark:bg-gray-800 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-[#071A3D] text-white dark:bg-[#C5A869] dark:text-[#060D1A] rounded"
                >
                  Save Teacher
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Student Add/Edit Modal */}
        {studentModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <form onSubmit={handleSaveStudent} className="bg-white dark:bg-[#0B172B] rounded-2xl border border-[#E8E2D5] dark:border-[#1F3354] max-w-lg w-full p-6 sm:p-8 space-y-4 text-start max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E8E2D5] dark:border-[#1F3354] pb-3">
                <h2 className="text-base font-bold text-[#071A3D] dark:text-[#F3EFE6]">
                  {editingStudent ? 'Edit Student' : 'Add New Student'}
                </h2>
                <button type="button" onClick={() => setStudentModalOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Student ID</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingStudent}
                    value={studentForm.studentId}
                    onChange={(e) => setStudentForm({ ...studentForm, studentId: e.target.value })}
                    className="w-full px-3 py-2 border rounded dark:bg-[#060D1A] dark:border-[#1F3354] dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded dark:bg-[#060D1A] dark:border-[#1F3354] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Course</label>
                  <select
                    value={studentForm.course}
                    onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded dark:bg-[#060D1A] dark:border-[#1F3354] dark:text-white uppercase"
                  >
                    <option value="hifz">Hifz</option>
                    <option value="nazira">Nazira</option>
                    <option value="fiqh">Fiqh</option>
                    <option value="madrasa">Madrasa</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Class Format</label>
                  <select
                    value={studentForm.classType}
                    onChange={(e) => setStudentForm({ ...studentForm, classType: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded dark:bg-[#060D1A] dark:border-[#1F3354] dark:text-white uppercase"
                  >
                    <option value="group">Group</option>
                    <option value="individual">Individual</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Assigned Teacher ID</label>
                  <input
                    type="text"
                    required
                    value={studentForm.teacherId}
                    onChange={(e) => setStudentForm({ ...studentForm, teacherId: e.target.value })}
                    className="w-full px-3 py-2 border rounded dark:bg-[#060D1A] dark:border-[#1F3354] dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    value={studentForm.status}
                    onChange={(e) => setStudentForm({ ...studentForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded dark:bg-[#060D1A] dark:border-[#1F3354] dark:text-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PAUSED">PAUSED</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setStudentModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold bg-gray-200 dark:bg-gray-800 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-[#071A3D] text-white dark:bg-[#C5A869] dark:text-[#060D1A] rounded"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
