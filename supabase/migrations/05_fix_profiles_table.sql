-- First, drop existing triggers and functions
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_profile_update on profiles;
drop trigger if exists update_profiles_updated_at on profiles;
drop function if exists handle_new_user();
drop function if exists handle_profile_update();
drop function if exists update_updated_at_column();

-- Drop the table and type
drop table if exists profiles;
drop type if exists user_type;

-- Recreate everything
create type user_type as enum ('volunteer', 'organization');

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,  -- Made nullable to prevent trigger errors
  email text not null,
  user_type user_type not null default 'volunteer',
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

-- Updated trigger function for new users
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
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'),
    new.email,
    (case 
      when new.raw_user_meta_data->>'type' is not null then 
        (new.raw_user_meta_data->>'type')::user_type
      else 'volunteer'
    end)
  );
  return new;
exception
  when others then
    -- Log the error (will appear in Supabase logs)
    raise log 'Error in handle_new_user: %', SQLERRM;
    return new; -- Still return new to prevent user creation from failing
end;
$$ language plpgsql security definer;

-- Recreate triggers
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Enable RLS
alter table profiles enable row level security;

-- Update policies
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