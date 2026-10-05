import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';

// Public Components (Part 1)
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustStrip } from './components/TrustStrip';
import { AboutSection } from './components/AboutSection';
import { CoursesSection } from './components/CoursesSection';
import { ClassSystemSection } from './components/ClassSystemSection';
import { LanguageSection } from './components/LanguageSection';
import { WhyTheenSection } from './components/WhyTheenSection';
import { FounderSection } from './components/FounderSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { AdmissionsSection } from './components/AdmissionsSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdmissionModal } from './components/AdmissionModal';

// Public Applications (Part 2)
import { AdmissionsPage } from './pages/AdmissionsPage';
import { AdmissionSuccessPage } from './pages/AdmissionSuccessPage';
import { TeacherApplicationPage } from './pages/TeacherApplicationPage';
import { TeacherSuccessPage } from './pages/TeacherSuccessPage';

// Authentication & Core Portals (Part 3 & 4)
import { AdminLoginPage } from './pages/AdminLoginPage';
import { TeacherLoginPage } from './pages/TeacherLoginPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminDashboardPlaceholder } from './pages/AdminDashboardPlaceholder';

// Teacher Dashboard Suite (Part 5)
import { TeacherDashboardPage } from './pages/teacher/TeacherDashboardPage';
import { TeacherTodayPage } from './pages/teacher/TeacherTodayPage';
import { TeacherStudentsPage } from './pages/teacher/TeacherStudentsPage';
import { TeacherAttendancePage } from './pages/teacher/TeacherAttendancePage';
import { TeacherProgressPage } from './pages/teacher/TeacherProgressPage';
import { TeacherProfilePage } from './pages/teacher/TeacherProfilePage';

const VALID_ROUTES = [
  '/',
  '/admissions',
  '/admissions/success',
  '/teachers/apply',
  '/teachers/application-success',
  '/admin/login',
  '/admin/dashboard',
  '/admin',
  '/teacher/login',
  '/teacher/dashboard',
  '/teacher/students',
  '/teacher/today',
  '/teacher/attendance',
  '/teacher/progress',
  '/teacher/profile',
  '/teacher',
  '/unauthorized',
];

const MainContent: React.FC = () => {
  const [admissionModalOpen, setAdmissionModalOpen] = useState(false);
  const [selectedAdmissionCourse, setSelectedAdmissionCourse] = useState<string | undefined>('hifz');
  const { fontClass } = useLanguage();
  const { currentRoute, navigate } = useRouter();

  const handleOpenAdmission = (courseId?: string) => {
    navigate('/admissions', { courseId: courseId || 'hifz' });
  };

  const isDashboardRoute =
    currentRoute === '/admin/dashboard' ||
    currentRoute === '/admin' ||
    currentRoute === '/teacher/dashboard' ||
    currentRoute === '/teacher/students' ||
    currentRoute === '/teacher/today' ||
    currentRoute === '/teacher/attendance' ||
    currentRoute === '/teacher/progress' ||
    currentRoute === '/teacher/profile' ||
    currentRoute === '/teacher';

  const isValidRoute = VALID_ROUTES.includes(currentRoute);

  return (
    <div className={`min-h-screen flex flex-col ${fontClass} bg-[#FBF9F5] dark:bg-[#060D1A] text-[#071A3D] dark:text-[#F3EFE6] transition-colors duration-300`}>
      {!isDashboardRoute && isValidRoute && <Header onOpenAdmission={handleOpenAdmission} />}

      <main className="flex-1">
        {!isValidRoute ? (
          <NotFoundPage />
        ) : (
          <>
            {/* Public Admissions and Teacher Application Routes */}
            {currentRoute === '/admissions' && <AdmissionsPage />}
            {currentRoute === '/admissions/success' && <AdmissionSuccessPage />}
            {currentRoute === '/teachers/apply' && <TeacherApplicationPage />}
            {currentRoute === '/teachers/application-success' && <TeacherSuccessPage />}

            {/* Authentication Pages */}
            {currentRoute === '/admin/login' && <AdminLoginPage />}
            {currentRoute === '/teacher/login' && <TeacherLoginPage />}
            {currentRoute === '/unauthorized' && <UnauthorizedPage />}

            {/* Protected Admin Routes */}
            {(currentRoute === '/admin/dashboard' || currentRoute === '/admin') && (
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']} loginPath="/admin/login">
                <AdminDashboardPlaceholder />
              </ProtectedRoute>
            )}

            {/* Protected Teacher Dashboard Routes (Part 5) */}
            {(currentRoute === '/teacher/dashboard' || currentRoute === '/teacher') && (
              <ProtectedRoute allowedRoles={['TEACHER']} loginPath="/teacher/login">
                <TeacherDashboardPage />
              </ProtectedRoute>
            )}

            {currentRoute === '/teacher/today' && (
              <ProtectedRoute allowedRoles={['TEACHER']} loginPath="/teacher/login">
                <TeacherTodayPage />
              </ProtectedRoute>
            )}

            {currentRoute === '/teacher/students' && (
              <ProtectedRoute allowedRoles={['TEACHER']} loginPath="/teacher/login">
                <TeacherStudentsPage />
              </ProtectedRoute>
            )}

            {currentRoute === '/teacher/attendance' && (
              <ProtectedRoute allowedRoles={['TEACHER']} loginPath="/teacher/login">
                <TeacherAttendancePage />
              </ProtectedRoute>
            )}

            {currentRoute === '/teacher/progress' && (
              <ProtectedRoute allowedRoles={['TEACHER']} loginPath="/teacher/login">
                <TeacherProgressPage />
              </ProtectedRoute>
            )}

            {currentRoute === '/teacher/profile' && (
              <ProtectedRoute allowedRoles={['TEACHER']} loginPath="/teacher/login">
                <TeacherProfilePage />
              </ProtectedRoute>
            )}

            {/* Homepage Route (Part 1) */}
            {currentRoute === '/' && (
              <>
                <Hero onOpenAdmission={handleOpenAdmission} />
                <TrustStrip />
                <AboutSection onOpenAdmission={() => handleOpenAdmission()} />
                <CoursesSection onOpenAdmission={handleOpenAdmission} />
                <ClassSystemSection onOpenAdmission={() => handleOpenAdmission()} />
                <LanguageSection />
                <WhyTheenSection />
                <FounderSection />
                <HowItWorksSection />
                <AdmissionsSection onOpenAdmission={() => handleOpenAdmission()} />
                <FaqSection />
                <ContactSection />
              </>
            )}
          </>
        )}
      </main>

      {!isDashboardRoute && isValidRoute && <Footer />}

      <AdmissionModal
        isOpen={admissionModalOpen}
        onClose={() => setAdmissionModalOpen(false)}
        defaultCourseId={selectedAdmissionCourse}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <RouterProvider>
          <AuthProvider>
            <MainContent />
          </AuthProvider>
        </RouterProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
