-- Drop everything first
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_profile_update on profiles;
drop trigger if exists update_profiles_updated_at on profiles;
drop function if exists handle_new_user();
drop function if exists handle_profile_update();
drop function if exists update_updated_at_column();
drop table if exists profiles;
drop type if exists user_type;

-- Create simple table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text,
  type text check (type in ('volunteer', 'organization')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Simple trigger function
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, type)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    coalesce(new.raw_user_meta_data->>'type', 'volunteer')
  );
  return new;
end;
$$;

-- Create trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Enable RLS
alter table profiles enable row level security;

-- Basic policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id); 