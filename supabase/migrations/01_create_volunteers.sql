-- Create enum for volunteer status
create type volunteer_status as enum ('active', 'inactive', 'pending');

-- Create volunteers table
create table public.volunteers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text,
  skills text[] default '{}',
  interests text[] default '{}',
  availability jsonb not null default '{
    "weekdays": false,
    "weekends": false,
    "mornings": false,
    "afternoons": false,
    "evenings": false
  }',
  status volunteer_status not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.volunteers enable row level security;

-- Create RLS policies
create policy "Users can view all volunteers"
  on volunteers for select
  using (true);

create policy "Users can create their own volunteer profile"
  on volunteers for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own volunteer profile"
  on volunteers for update
  using (auth.uid() = user_id);

-- Create updated_at trigger
create function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on volunteers
  for each row
  execute function handle_updated_at(); 