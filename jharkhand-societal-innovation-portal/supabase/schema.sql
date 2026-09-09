-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('University', 'Research Institution', 'Industry', 'Startup', 'MSME', 'CSR organization')),
    description TEXT,
    district TEXT NOT NULL,
    domains TEXT[] NOT NULL DEFAULT '{}',
    expertise TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('citizen', 'organization', 'government')),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. DOMAIN KEYWORDS TABLE
CREATE TABLE IF NOT EXISTS public.domain_keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain TEXT NOT NULL,
    keyword TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PROBLEM ID ATOMIC SEQUENCE
CREATE SEQUENCE IF NOT EXISTS problem_id_seq START WITH 1 INCREMENT BY 1;

-- 5. PROBLEMS TABLE
CREATE TABLE IF NOT EXISTS public.problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    domain TEXT NOT NULL,
    ai_confidence NUMERIC(5,2) DEFAULT 0.00,
    matched_keywords TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'available' 
        CHECK (status IN ('pending', 'valid', 'invalid', 'similar', 'available', 'assigned', 'in_progress', 'solution_submitted', 'validated', 'completed')),
    district TEXT NOT NULL,
    location_text TEXT NOT NULL,
    poster_name TEXT NOT NULL,
    poster_contact TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. PROBLEM MEDIA TABLE
CREATE TABLE IF NOT EXISTS public.problem_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ORGANIZATION MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.organization_problem_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    match_score NUMERIC(5,2) NOT NULL,
    reason TEXT NOT NULL,
    notified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID UNIQUE REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    team_lead TEXT,
    faculty_mentor TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    status TEXT DEFAULT 'assigned',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. PROJECT MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    email TEXT
);

-- 10. MILESTONES TABLE
CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    target_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. COLLABORATION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.collaboration_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
    requesting_organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    assigned_organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    collaboration_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. PARTNERSHIPS TABLE
CREATE TABLE IF NOT EXISTS public.partnerships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    role_description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- TRANSACTION-SAFE STORED FUNCTIONS (RPC)
-- ==========================================

CREATE OR REPLACE FUNCTION fn_generate_problem_id(p_domain TEXT)
RETURNS TEXT AS $$
DECLARE
    v_code TEXT;
    v_year TEXT;
    v_seq BIGINT;
BEGIN
    v_code := CASE p_domain
        WHEN 'Agriculture' THEN 'AGR'
        WHEN 'Education' THEN 'EDU'
        WHEN 'Healthcare' THEN 'HLT'
        WHEN 'Water Resources' THEN 'WAT'
        WHEN 'Environment' THEN 'ENV'
        WHEN 'Energy' THEN 'ENG'
        WHEN 'Urban Development' THEN 'URB'
        WHEN 'Accessibility' THEN 'ACC'
        WHEN 'Public Administration' THEN 'PUB'
        WHEN 'Rural Livelihoods' THEN 'RUR'
        ELSE 'GEN'
    END;
    v_year := to_char(now(), 'YYYY');
    v_seq := nextval('problem_id_seq');
    RETURN 'JH-' || v_code || '-' || v_year || '-' || lpad(v_seq::text, 6, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_claim_problem(p_problem_id UUID, p_org_id UUID, p_team_lead TEXT, p_mentor TEXT, p_email TEXT)
RETURNS JSONB AS $$
DECLARE
    v_status TEXT;
BEGIN
    SELECT status INTO v_status FROM public.problems WHERE id = p_problem_id FOR UPDATE;
    
    IF v_status IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Problem does not exist.');
    END IF;

    IF v_status != 'available' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Problem has already been claimed.');
    END IF;

    UPDATE public.problems SET status = 'assigned', updated_at = now() WHERE id = p_problem_id;

    INSERT INTO public.assignments (problem_id, organization_id, team_lead, faculty_mentor, contact_email)
    VALUES (p_problem_id, p_org_id, p_team_lead, p_mentor, p_email);

    INSERT INTO public.notifications (problem_id, type, title, message)
    VALUES (p_problem_id, 'assignment', 'Problem Claimed', 'A primary organization has accepted and claimed this issue.');

    RETURN jsonb_build_object('success', true, 'message', 'Problem successfully claimed.');
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Organizations" ON public.organizations FOR SELECT USING (true);
CREATE POLICY "Public Read Problems" ON public.problems FOR SELECT USING (true);
CREATE POLICY "Public Read Keywords" ON public.domain_keywords FOR SELECT USING (true);
CREATE POLICY "Public Read Assignments" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Public Read Collab Requests" ON public.collaboration_requests FOR SELECT USING (true);
CREATE POLICY "Public Read Partnerships" ON public.partnerships FOR SELECT USING (true);
CREATE POLICY "Public Read Notifications" ON public.notifications FOR SELECT USING (true);

CREATE POLICY "Anyone Insert Problems" ON public.problems FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated Insert Collab" ON public.collaboration_requests FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated Insert Notifications" ON public.notifications FOR INSERT WITH CHECK (true);

CREATE POLICY "Profiles self management" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Org Collab Update" ON public.collaboration_requests FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ==========================================
-- SUPABASE REALTIME ENABLEMENT
-- ==========================================
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE public.problems;
ALTER PUBLICATION supabase_realtime ADD TABLE public.assignments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.collaboration_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.partnerships;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ==========================================
-- SEED DATA
-- ==========================================
INSERT INTO public.domain_keywords (domain, keyword) VALUES
('Agriculture', 'farmer'), ('Agriculture', 'crop'), ('Agriculture', 'irrigation'), ('Agriculture', 'soil'), ('Agriculture', 'fertilizer'), ('Agriculture', 'harvest'), ('Agriculture', 'paddy'),
('Education', 'school'), ('Education', 'student'), ('Education', 'teacher'), ('Education', 'college'), ('Education', 'classroom'), ('Education', 'literacy'),
('Healthcare', 'hospital'), ('Healthcare', 'doctor'), ('Healthcare', 'medicine'), ('Healthcare', 'health'), ('Healthcare', 'clinic'), ('Healthcare', 'disease'),
('Water Resources', 'water'), ('Water Resources', 'drinking water'), ('Water Resources', 'pipeline'), ('Water Resources', 'river'), ('Water Resources', 'borewell'), ('Water Resources', 'pond'),
('Environment', 'pollution'), ('Environment', 'waste'), ('Environment', 'forest'), ('Environment', 'plastic'), ('Environment', 'climate'), ('Environment', 'mining'),
('Energy', 'electricity'), ('Energy', 'solar'), ('Energy', 'power'), ('Energy', 'grid'), ('Energy', 'street light'),
('Urban Development', 'road'), ('Urban Development', 'traffic'), ('Urban Development', 'drainage'), ('Urban Development', 'city'), ('Urban Development', 'infrastructure'),
('Accessibility', 'disabled'), ('Accessibility', 'wheelchair'), ('Accessibility', 'accessibility'), ('Accessibility', 'blind'), ('Accessibility', 'ramp'),
('Public Administration', 'government'), ('Public Administration', 'certificate'), ('Public Administration', 'public service'), ('Public Administration', 'office'), ('Public Administration', 'document'),
('Rural Livelihoods', 'employment'), ('Rural Livelihoods', 'village'), ('Rural Livelihoods', 'livelihood'), ('Rural Livelihoods', 'self help group'), ('Rural Livelihoods', 'artisan')
ON CONFLICT (keyword) DO NOTHING;

INSERT INTO public.organizations (id, name, type, description, district, domains, expertise) VALUES
('11111111-1111-1111-1111-111111111111', 'VNR VJIET Innovation Hub', 'University', 'Lead research institute specializing in smart agriculture & rural water management.', 'Ranchi', ARRAY['Agriculture', 'Water Resources', 'Rural Livelihoods'], ARRAY['Smart Irrigation', 'IoT Sensors', 'Soil Analytics']),
('22222222-2222-2222-2222-222222222222', 'BIT Mesra Innovation & Incubation Centre', 'University', 'Technical institute focused on urban infrastructure and clean energy solar grids.', 'Ranchi', ARRAY['Education', 'Urban Development', 'Energy', 'Accessibility'], ARRAY['AI/ML', 'Urban Infrastructure', 'Solar Grids']),
('33333333-3333-3333-3333-333333333333', 'Jharkhand Rural Technology Council', 'Research Institution', 'State research center developing affordable healthcare tools and environmental sanitation.', 'Dhanbad', ARRAY['Healthcare', 'Environment', 'Public Administration'], ARRAY['E-Governance', 'Public Sanitation', 'Community Health'])
ON CONFLICT (id) DO NOTHING;
-- Add severity, duplicates, and progress tracking columns to problems table
ALTER TABLE public.problems 
  ADD COLUMN IF NOT EXISTS duplicate_count INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS severity_score INT DEFAULT 10,
  ADD COLUMN IF NOT EXISTS progress_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS resolution_notes TEXT DEFAULT '';

-- Update assignments table with progress tracking
ALTER TABLE public.assignments 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS progress_percentage INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_updated TIMESTAMPTZ DEFAULT NOW();