-- ============================================================================
-- THEEN - INSTITUTE OF QUR'AN : SUPABASE PRODUCTION MIGRATION SCRIPT
-- ============================================================================
-- This script sets up the complete relational PostgreSQL schema, foreign keys,
-- constraints, triggers, functions, and Row Level Security (RLS) policies.
-- Safe to run on a fresh Supabase project (uses IF NOT EXISTS).
-- ============================================================================

-- 1. PROFILES TABLE (Linked to Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT,
    role TEXT NOT NULL DEFAULT 'TEACHER' CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'TEACHER')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    teacher_id TEXT UNIQUE,
    gender TEXT CHECK (gender IN ('male', 'female')),
    phone TEXT,
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ADMISSIONS TABLE (Student Inquiries)
CREATE TABLE IF NOT EXISTS public.admissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    dob TEXT,
    age TEXT,
    gender TEXT,
    country TEXT,
    state TEXT,
    city TEXT,
    whatsapp TEXT NOT NULL,
    email TEXT NOT NULL,
    guardian_information JSONB DEFAULT '{}'::jsonb,
    course TEXT NOT NULL CHECK (course IN ('hifz', 'nazira', 'fiqh', 'madrasa')),
    class_type TEXT NOT NULL CHECK (class_type IN ('group', 'individual')),
    class_language TEXT NOT NULL,
    previous_learning TEXT,
    preferred_contact TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    approved_at TIMESTAMPTZ,
    approved_by TEXT,
    rejected_at TIMESTAMPTZ,
    rejected_by TEXT
);

-- 3. STUDENTS TABLE (Active Enrolled Roster)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    gender TEXT NOT NULL,
    course TEXT NOT NULL,
    class_type TEXT NOT NULL,
    class_language TEXT NOT NULL,
    teacher_id TEXT NOT NULL,
    batch_id TEXT,
    batch_name TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    whatsapp TEXT,
    email TEXT,
    joined_at TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TEACHER APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.teacher_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    gender TEXT NOT NULL,
    qualification TEXT NOT NULL,
    experience TEXT,
    subjects JSONB DEFAULT '[]'::jsonb,
    languages JSONB DEFAULT '[]'::jsonb,
    preferred_student_type TEXT,
    availability TEXT,
    device_info TEXT,
    motivation TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    approved_at TIMESTAMPTZ,
    approved_by TEXT,
    rejected_at TIMESTAMPTZ,
    rejected_by TEXT
);

-- 5. TEACHERS TABLE (Active Faculty)
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    whatsapp TEXT,
    qualification TEXT,
    institution TEXT,
    subjects JSONB DEFAULT '[]'::jsonb,
    languages JSONB DEFAULT '[]'::jsonb,
    bio TEXT,
    gender TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. BATCHES TABLE (Group Classes - Max 5 Students)
CREATE TABLE IF NOT EXISTS public.batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id TEXT NOT NULL UNIQUE,
    batch_name TEXT NOT NULL,
    course TEXT NOT NULL,
    teacher_id TEXT NOT NULL,
    current_student_count INTEGER DEFAULT 0,
    max_students INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ATTENDANCE TABLE (Daily Attendance Logs)
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attendance_id TEXT NOT NULL UNIQUE,
    date TEXT NOT NULL,
    teacher_id TEXT NOT NULL,
    teacher_user_id TEXT,
    teacher_name TEXT,
    student_id TEXT NOT NULL,
    student_name TEXT,
    course TEXT,
    class_type TEXT,
    class_language TEXT,
    status TEXT NOT NULL CHECK (status IN ('PRESENT', 'ABSENT')),
    submitted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_student_date_attendance UNIQUE (student_id, date)
);

-- 8. STUDENT PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    progress_id TEXT NOT NULL UNIQUE,
    student_id TEXT NOT NULL,
    student_name TEXT,
    teacher_id TEXT NOT NULL,
    course TEXT,
    lesson TEXT NOT NULL,
    homework TEXT,
    remarks TEXT,
    progress_status TEXT NOT NULL CHECK (progress_status IN ('ON_TRACK', 'NEEDS_ATTENTION', 'COMPLETED')),
    updated_by TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. PAYMENTS TABLE (Private Admin Only)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id TEXT NOT NULL UNIQUE,
    student_id TEXT NOT NULL,
    student_name TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL,
    method TEXT,
    date TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. SALARY RECORDS TABLE (Private Admin Only)
CREATE TABLE IF NOT EXISTS public.salary_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_id TEXT NOT NULL UNIQUE,
    teacher_id TEXT NOT NULL,
    teacher_name TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    period TEXT,
    status TEXT NOT NULL,
    date TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. EMAIL LOGS TABLE
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    log_id TEXT NOT NULL UNIQUE,
    recipient TEXT NOT NULL,
    subject TEXT,
    status TEXT NOT NULL,
    teacher_id TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- HELPER FUNCTIONS & RLS SETUP
-- ============================================================================

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('SUPER_ADMIN', 'ADMIN')
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if current user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'SUPER_ADMIN'
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if current user is teacher
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'TEACHER'
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get teacher_id for current user
CREATE OR REPLACE FUNCTION public.get_teacher_id()
RETURNS TEXT AS $$
DECLARE
  t_id TEXT;
BEGIN
  SELECT teacher_id INTO t_id FROM public.profiles WHERE id = auth.uid();
  RETURN t_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Profiles Policies
CREATE POLICY "Users can read own profile or admin reads all" ON public.profiles
    FOR SELECT USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins can insert/update profiles" ON public.profiles
    FOR ALL USING (public.is_admin());

-- Admissions Policies
CREATE POLICY "Public can submit admissions" ON public.admissions
    FOR INSERT WITH CHECK (status = 'PENDING');

CREATE POLICY "Admins can manage admissions" ON public.admissions
    FOR ALL USING (public.is_admin());

-- Teacher Applications Policies
CREATE POLICY "Public can submit teacher applications" ON public.teacher_applications
    FOR INSERT WITH CHECK (status = 'PENDING');

CREATE POLICY "Admins can manage teacher applications" ON public.teacher_applications
    FOR ALL USING (public.is_admin());

-- Students Policies
CREATE POLICY "Admins manage students, teachers view assigned" ON public.students
    FOR SELECT USING (public.is_admin() OR (public.is_teacher() AND teacher_id = public.get_teacher_id()));

CREATE POLICY "Admins can write students" ON public.students
    FOR ALL USING (public.is_admin());

-- Teachers Policies
CREATE POLICY "Admins manage teachers, teacher views own" ON public.teachers
    FOR SELECT USING (public.is_admin() OR (public.is_teacher() AND teacher_id = public.get_teacher_id()));

CREATE POLICY "Admins can write teachers" ON public.teachers
    FOR ALL USING (public.is_admin());

-- Batches Policies
CREATE POLICY "Admins manage batches, teacher views assigned" ON public.batches
    FOR SELECT USING (public.is_admin() OR (public.is_teacher() AND teacher_id = public.get_teacher_id()));

CREATE POLICY "Admins can write batches" ON public.batches
    FOR ALL USING (public.is_admin());

-- Attendance Policies
CREATE POLICY "Admins manage attendance, teacher views/submits own" ON public.attendance
    FOR SELECT USING (public.is_admin() OR (public.is_teacher() AND teacher_id = public.get_teacher_id()));

CREATE POLICY "Teacher can insert own attendance" ON public.attendance
    FOR INSERT WITH CHECK (public.is_admin() OR (public.is_teacher() AND teacher_id = public.get_teacher_id()));

CREATE POLICY "Teacher can update own attendance" ON public.attendance
    FOR UPDATE USING (public.is_admin() OR (public.is_teacher() AND teacher_id = public.get_teacher_id()));

-- Student Progress Policies
CREATE POLICY "Admins manage progress, teacher manages assigned" ON public.student_progress
    FOR ALL USING (public.is_admin() OR (public.is_teacher() AND teacher_id = public.get_teacher_id()));

-- Finance Policies (Payments & Salary Records) - Admin Only
CREATE POLICY "Admin only payments" ON public.payments
    FOR ALL USING (public.is_super_admin() OR public.is_admin());

CREATE POLICY "Admin only salary records" ON public.salary_records
    FOR ALL USING (public.is_super_admin() OR public.is_admin());

-- Settings Policies
CREATE POLICY "Admin only settings" ON public.settings
    FOR ALL USING (public.is_admin());

-- Email Logs Policies
CREATE POLICY "Admins and teachers read email logs" ON public.email_logs
    FOR SELECT USING (public.is_admin() || (public.is_teacher() AND teacher_id = public.get_teacher_id()));

CREATE POLICY "Authenticated users insert email logs" ON public.email_logs
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins manage email logs" ON public.email_logs
    FOR UPDATE USING (public.is_admin());
