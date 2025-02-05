-- First, clean up existing objects
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();
drop table if exists profiles;

-- Create a simpler profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text,
  type text,
  created_at timestamptz default now()
);

-- Create a simpler trigger function
create function public.handle_new_user()
returns trigger
security definer
language plpgsql
as $$
begin
  insert into public.profiles (id, email, name, type)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'type'
  );
  return new;
exception when others then
  -- Log the error details
  raise warning 'Error in handle_new_user: %', SQLERRM;
  return new;
end;
$$;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Enable RLS
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Create index
create index profiles_type_idx on profiles(type); 