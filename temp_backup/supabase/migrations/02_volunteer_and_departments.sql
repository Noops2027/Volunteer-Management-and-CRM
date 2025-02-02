-- Create enum types
CREATE TYPE proficiency_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE department_status AS ENUM ('active', 'inactive');
CREATE TYPE program_status AS ENUM ('planning', 'active', 'completed', 'cancelled');

-- Create departments table
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    status department_status DEFAULT 'active',
    UNIQUE(organization_id, name)
);

-- Create programs table
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    status program_status DEFAULT 'planning',
    CONSTRAINT end_date_check CHECK (end_date IS NULL OR end_date > start_date)
);

-- Create volunteer_profiles table
CREATE TABLE volunteer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    availability TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    emergency_contact JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    status user_status DEFAULT 'active',
    UNIQUE(user_id)
);

-- Create skills table
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(name, category)
);

-- Create volunteer_skills table
CREATE TABLE volunteer_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    volunteer_id UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level proficiency_level DEFAULT 'beginner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(volunteer_id, skill_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_departments_organization ON departments(organization_id);
CREATE INDEX idx_programs_organization ON programs(organization_id);
CREATE INDEX idx_programs_department ON programs(department_id);
CREATE INDEX idx_volunteer_profiles_user ON volunteer_profiles(user_id);
CREATE INDEX idx_volunteer_skills_volunteer ON volunteer_skills(volunteer_id);
CREATE INDEX idx_volunteer_skills_skill ON volunteer_skills(skill_id);

-- Enable Row Level Security (RLS)
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_skills ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Departments policies
CREATE POLICY "Departments viewable by authenticated users" ON departments
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Department management by organization staff and admins" ON departments
    USING (EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('staff', 'admin')
    ));

-- Programs policies
CREATE POLICY "Programs viewable by authenticated users" ON programs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Program management by organization staff and admins" ON programs
    USING (EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('staff', 'admin')
    ));

-- Volunteer profiles policies
CREATE POLICY "Users can view their own volunteer profile" ON volunteer_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all volunteer profiles" ON volunteer_profiles
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('staff', 'admin')
    ));

-- Skills policies
CREATE POLICY "Skills viewable by all authenticated users" ON skills
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Skills manageable by staff and admins" ON skills
    USING (EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('staff', 'admin')
    ));

-- Volunteer skills policies
CREATE POLICY "Users can manage their own skills" ON volunteer_skills
    USING (EXISTS (
        SELECT 1 FROM volunteer_profiles
        WHERE id = volunteer_id 
        AND user_id = auth.uid()
    )); 