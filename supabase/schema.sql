-- 1. Create Profiles Table (Doctor Info)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    doctor_name TEXT NOT NULL,
    specialty TEXT,
    clinic_address TEXT,
    phone_number TEXT,
    booking_link TEXT,
    disclaimer_template TEXT DEFAULT 'هذا المنشور لغرض التثقيف الطبي فقط ولا يغني عن استشارة الطبيب المختص.',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- 2. Create Drafts Table (Saved Generated Content)
CREATE TABLE IF NOT EXISTS public.drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    topic TEXT NOT NULL,
    platform TEXT,
    tone TEXT,
    content TEXT,
    safety_checklist JSONB DEFAULT '{}'::jsonb,
    designer_prompt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Drafts
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own drafts" 
    ON public.drafts FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own drafts" 
    ON public.drafts FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drafts" 
    ON public.drafts FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drafts" 
    ON public.drafts FOR DELETE 
    USING (auth.uid() = user_id);
