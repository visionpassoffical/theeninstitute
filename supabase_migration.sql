-- ============================================================================
-- THEEN - INSTITUTE OF QUR'AN : SUPABASE PRODUCTION MIGRATION SCRIPT (SECURED & CORRECTED)
-- ============================================================================
-- This script sets up the complete relational PostgreSQL schema, foreign keys,
-- constraints, database-level triggers, secure functions with fixed search_path,
-- and strict Row Level Security (RLS) policies using proper SQL boolean operators.
-- Fully idempotent and safe to run multiple times on a fresh or existing Supabase project.
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
-- PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_students_teacher_id ON public.students(teacher_id);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(status);
CREATE INDEX IF NOT EXISTS idx_attendance_teacher_id ON public.attendance(teacher_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_student_progress_teacher_id ON public.student_progress(teacher_id);
CREATE INDEX IF NOT EXISTS idx_admissions_status ON public.admissions(status);
CREATE INDEX IF NOT EXISTS idx_teacher_applications_status ON public.teacher_applications(status);

-- ============================================================================
-- DATABASE SECURITY TRIGGERS & FUNCTIONS (WITH FIXED SEARCH_PATH)
-- ============================================================================

-- Enforce Group Class Maximum Capacity of 5 Students at Database Level
CREATE OR REPLACE FUNCTION public.check_batch_capacity()
RETURNS TRIGGER AS $$
DECLARE
  current_count INTEGER;
BEGIN
  IF NEW.class_type = 'group' AND NEW.batch_id IS NOT NULL THEN
    SELECT count(*) INTO current_count
    FROM public.students s
    WHERE s.batch_id = NEW.batch_id AND s.id IS DISTINCT FROM NEW.id;

    IF current_count >= 5 THEN
      RAISE EXCEPTION 'Group class batch capacity exceeded. Maximum 5 students allowed per group batch.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS enforce_batch_capacity_trigger ON public.students;
CREATE TRIGGER enforce_batch_capacity_trigger
    BEFORE INSERT OR UPDATE ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION public.check_batch_capacity();

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Helper function to get teacher_id for current user
CREATE OR REPLACE FUNCTION public.get_teacher_id()
RETURNS TEXT AS $$
DECLARE
  t_id TEXT;
BEGIN
  SELECT teacher_id INTO t_id FROM public.profiles WHERE id = auth.uid();
  RETURN t_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) ENABLEMENT
-- ============================================================================
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

-- ============================================================================
-- RLS POLICIES (IDEMPOTENT & SECURE — USING PROPER SQL BOOLEAN OR/AND)
-- ============================================================================

-- Profiles Policies
DROP POLICY IF EXISTS "Users can read own profile or admin reads all" ON public.profiles;
CREATE POLICY "Users can read own profile or admin reads all" ON public.profiles
    FOR SELECT USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert/update profiles" ON public.profiles;
CREATE POLICY "Admins can insert/update profiles" ON public.profiles
    FOR ALL USING (public.is_admin());

-- Admissions Policies
DROP POLICY IF EXISTS "Public can submit admissions" ON public.admissions;
CREATE POLICY "Public can submit admissions" ON public.admissions
    FOR INSERT WITH CHECK (status = 'PENDING');

DROP POLICY IF EXISTS "Admins can manage admissions" ON public.admissions;
CREATE POLICY "Admins can manage admissions" ON public.admissions
    FOR ALL USING (public.is_admin());

-- Teacher Applications Policies
DROP POLICY IF EXISTS "Public can submit teacher applications" ON public.teacher_applications;
CREATE POLICY "Public can submit teacher applications" ON public.teacher_applications
    FOR INSERT WITH CHECK (status = 'PENDING');

DROP POLICY IF EXISTS "Admins can manage teacher applications" ON public.teacher_applications;
CREATE POLICY "Admins can manage teacher applications" ON public.teacher_applications
    FOR ALL USING (public.is_admin());

-- Students Policies
DROP POLICY IF EXISTS "Admins manage students, teachers view assigned" ON public.students;
CREATE POLICY "Admins manage students, teachers view assigned" ON public.students
    FOR SELECT USING (public.is_admin() OR (public.is_teacher() AND teacher_id = public.get_teacher_id()));

DROP POLICY IF EXISTS "Admins can write students" ON public.students;
CREATE POLICY "Admins can write students" ON public.students
    FOR ALL USING (public.is_admin());

-- Teachers Policies
DROP POLICY IF EXISTS "Admins manage teachers, teacher views own" ON public.teachers;
CREATE POLICY "Admins manage teachers, teacher views own" ON public.teachers
    FOR SELECT USING (public.is_admin() OR (public.is_teacher() AND teacher_id = public.get_teacher_id()));

DROP POLICY IF EXISTS "Admins can write teachers" ON public.teachers;
CREATE POLICY "Admins can write teachers" ON public.teachers
    FOR ALL USING (public.is_admin());

-- Batches Policies
DROP POLICY IF EXISTS "Admins manage batches, teacher views assigned" ON public.batches;
CREATE POLICY "Admins manage batches, teacher views assigned" ON public.batches
    FOR SELECT USING (public.is_admin() OR (public.is_teacher() AND teacher_id = public.get_teacher_id()));

DROP POLICY IF EXISTS "Admins can write batches" ON public.batches;
CREATE POLICY "Admins can write batches" ON public.batches
    FOR ALL USING (public.is_admin());

-- Attendance Policies (Strictly Verified against Assigned Students)
DROP POLICY IF EXISTS "Admins manage attendance, teacher views/submits own" ON public.attendance;
CREATE POLICY "Admins manage attendance, teacher views/submits own" ON public.attendance
    FOR SELECT USING (public.is_admin() OR (public.is_teacher() AND teacher_id = public.get_teacher_id()));

DROP POLICY IF EXISTS "Teacher can insert own attendance for assigned student" ON public.attendance;
CREATE POLICY "Teacher can insert own attendance for assigned student" ON public.attendance
    FOR INSERT WITH CHECK (
      public.is_admin() OR 
      (public.is_teacher() 
       AND teacher_id = public.get_teacher_id()
       AND EXISTS (
         SELECT 1 FROM public.students s 
         WHERE s.student_id = attendance.student_id 
           AND s.teacher_id = public.get_teacher_id()
       ))
    );

DROP POLICY IF EXISTS "Teacher can update own attendance for assigned student" ON public.attendance;
CREATE POLICY "Teacher can update own attendance for assigned student" ON public.attendance
    FOR UPDATE USING (
      public.is_admin() OR 
      (public.is_teacher() 
       AND teacher_id = public.get_teacher_id()
       AND EXISTS (
         SELECT 1 FROM public.students s 
         WHERE s.student_id = attendance.student_id 
           AND s.teacher_id = public.get_teacher_id()
       ))
    );

-- Student Progress Policies (Strictly Verified against Assigned Students)
DROP POLICY IF EXISTS "Admins manage progress, teacher manages assigned" ON public.student_progress;
CREATE POLICY "Admins manage progress, teacher manages assigned" ON public.student_progress
    FOR ALL USING (
      public.is_admin() OR 
      (public.is_teacher() 
       AND teacher_id = public.get_teacher_id()
       AND EXISTS (
         SELECT 1 FROM public.students s 
         WHERE s.student_id = student_progress.student_id 
           AND s.teacher_id = public.get_teacher_id()
       ))
    );

-- Finance Policies (Payments & Salary Records) - Admin Only
DROP POLICY IF EXISTS "Admin only payments" ON public.payments;
CREATE POLICY "Admin only payments" ON public.payments
    FOR ALL USING (public.is_super_admin() OR public.is_admin());

DROP POLICY IF EXISTS "Admin only salary records" ON public.salary_records;
CREATE POLICY "Admin only salary records" ON public.salary_records
    FOR ALL USING (public.is_super_admin() OR public.is_admin());

-- Settings Policies
DROP POLICY IF EXISTS "Admin only settings" ON public.settings;
CREATE POLICY "Admin only settings" ON public.settings
    FOR ALL USING (public.is_admin());

-- Email Logs Policies (Admin Only Insertion to prevent spoofing)
DROP POLICY IF EXISTS "Admins and teachers read email logs" ON public.email_logs;
CREATE POLICY "Admins and teachers read email logs" ON public.email_logs
    FOR SELECT USING (public.is_admin() OR (public.is_teacher() AND teacher_id = public.get_teacher_id()));

DROP POLICY IF EXISTS "Admins manage email logs" ON public.email_logs;
CREATE POLICY "Admins manage email logs" ON public.email_logs
    FOR ALL USING (public.is_admin());
