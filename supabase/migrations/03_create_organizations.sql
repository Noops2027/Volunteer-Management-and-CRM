-- Organizations table
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  website text,
  logo_url text,
  contact_email text not null,
  contact_phone text,
  address jsonb,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Organization relationships (for org-to-org associations)
create table public.organization_relationships (
  id uuid primary key default gen_random_uuid(),
  parent_org_id uuid references organizations(id),
  child_org_id uuid references organizations(id),
  relationship_type text not null, -- e.g., 'partner', 'subsidiary', 'affiliate'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(parent_org_id, child_org_id)
);

-- Organization members (for org admins/staff)
create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  user_id uuid references auth.users(id),
  role text not null, -- e.g., 'admin', 'coordinator', 'staff'
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(organization_id, user_id)
);

-- Organization volunteers
create table public.organization_volunteers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  volunteer_id uuid references volunteers(id),
  status text default 'pending', -- 'pending', 'active', 'inactive'
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(organization_id, volunteer_id)
);

-- Add RLS policies
alter table organizations enable row level security;
alter table organization_relationships enable row level security;
alter table organization_members enable row level security;
alter table organization_volunteers enable row level security; 