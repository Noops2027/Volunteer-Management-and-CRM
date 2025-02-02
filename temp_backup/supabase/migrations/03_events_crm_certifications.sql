-- Create enum types
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled');
CREATE TYPE interaction_type AS ENUM ('email', 'call', 'meeting', 'note');
CREATE TYPE donation_type AS ENUM ('one_time', 'recurring');
CREATE TYPE donation_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE certification_status AS ENUM ('active', 'expired', 'revoked');

-- Create events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT NOT NULL,
    max_volunteers INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    status event_status DEFAULT 'draft',
    CONSTRAINT event_dates_check CHECK (end_date > start_date)
);

-- Create appointment types table
CREATE TABLE appointment_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- Duration in minutes
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(organization_id, name)
);

-- Create appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    type_id UUID NOT NULL REFERENCES appointment_types(id) ON DELETE RESTRICT,
    status appointment_status DEFAULT 'scheduled',
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    CONSTRAINT appointment_times_check CHECK (end_time > start_time)
);

-- Create appointment_participants table
CREATE TABLE appointment_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(appointment_id, user_id)
);

-- Create interactions table
CREATE TABLE interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type interaction_type NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE
);

-- Create donations table
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL,
    type donation_type NOT NULL,
    status donation_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    transaction_id TEXT,
    notes TEXT,
    CONSTRAINT valid_currency CHECK (currency ~ '^[A-Z]{3}$')
);

-- Create certifications table
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    issuing_organization TEXT NOT NULL,
    description TEXT NOT NULL,
    validity_period INTEGER, -- Period in days, NULL if no expiration
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(name, issuing_organization)
);

-- Create volunteer_certifications table
CREATE TABLE volunteer_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    volunteer_id UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
    certification_id UUID NOT NULL REFERENCES certifications(id) ON DELETE RESTRICT,
    issue_date TIMESTAMP WITH TIME ZONE NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE,
    status certification_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    document_url TEXT,
    CONSTRAINT certification_dates_check CHECK (expiry_date IS NULL OR expiry_date > issue_date)
);

-- Create indexes for better query performance
CREATE INDEX idx_events_organization ON events(organization_id);
CREATE INDEX idx_events_program ON events(program_id);
CREATE INDEX idx_events_dates ON events(start_date, end_date);
CREATE INDEX idx_appointments_organization ON appointments(organization_id);
CREATE INDEX idx_appointments_type ON appointments(type_id);
CREATE INDEX idx_appointments_dates ON appointments(start_time, end_time);
CREATE INDEX idx_interactions_user ON interactions(user_id);
CREATE INDEX idx_interactions_organization ON interactions(organization_id);
CREATE INDEX idx_donations_user ON donations(user_id);
CREATE INDEX idx_donations_organization ON donations(organization_id);
CREATE INDEX idx_volunteer_certifications_volunteer ON volunteer_certifications(volunteer_id);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_certifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Events policies
CREATE POLICY "Events viewable by authenticated users" ON events
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Events manageable by organization staff and admins" ON events
    USING (EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('staff', 'admin')
    ));

-- Appointments policies
CREATE POLICY "Users can view their appointments" ON appointments
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM appointment_participants 
        WHERE appointment_id = id 
        AND user_id = auth.uid()
    ));

CREATE POLICY "Staff can manage appointments" ON appointments
    USING (EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('staff', 'admin')
    ));

-- Interactions policies
CREATE POLICY "Users can view their interactions" ON interactions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Staff can manage interactions" ON interactions
    USING (EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('staff', 'admin')
    ));

-- Donations policies
CREATE POLICY "Users can view their donations" ON donations
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Staff can view all donations" ON donations
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('staff', 'admin')
    ));

-- Certifications policies
CREATE POLICY "Certifications viewable by all authenticated users" ON certifications
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can manage certifications" ON certifications
    USING (EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('staff', 'admin')
    )); 