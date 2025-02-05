-- Create an enum for user types
create type user_type as enum ('volunteer', 'organization');

-- Create profiles table
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null unique,
  user_type user_type not null,
  avatar_url text,
  phone text,
  bio text,
  location text,
  skills text[],
  interests text[],
  availability text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create trigger to automatically update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
    before update on profiles
    for each row
    execute function update_updated_at_column();

-- Enable Row Level Security
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Create indexes
create index profiles_user_type_idx on profiles(user_type);
create index profiles_email_idx on profiles(email);

-- Add comments for documentation
comment on table profiles is 'User profiles for both volunteers and organizations';
comment on column profiles.id is 'References the auth.users uuid';
comment on column profiles.full_name is 'User''s full name or organization name';
comment on column profiles.user_type is 'Type of user - either volunteer or organization';
comment on column profiles.avatar_url is 'URL to user''s avatar image';
comment on column profiles.skills is 'Array of skills (for volunteers)';
comment on column profiles.interests is 'Array of interests/causes';
comment on column profiles.availability is 'Array of availability slots (for volunteers)';

-- Create function to handle profile updates
create or replace function handle_profile_update()
returns trigger as $$
begin
  -- Sync with auth.users metadata
  update auth.users
  set raw_user_meta_data = jsonb_build_object(
    'full_name', new.full_name,
    'type', new.user_type,
    'avatar_url', new.avatar_url
  )
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for profile updates
create trigger on_profile_update
  after update on profiles
  for each row
  execute function handle_profile_update();

-- Create function to automatically create profile on user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id, 
    full_name, 
    email, 
    user_type
  )
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    coalesce(new.raw_user_meta_data->>'type', 'volunteer')  -- Default to volunteer if not set
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user(); 