-- Create a new table for saved passwords
create table saved_passwords (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  password_label text not null,
  password_value text not null,
  created_at timestamp with time zone default now() not null
);

-- Add Row Level Security (RLS) policies
alter table saved_passwords enable row level security;

-- Create policy to allow users to view only their own passwords
create policy "Users can view their own saved passwords"
  on saved_passwords for select
  using (auth.uid() = user_id);

-- Create policy to allow users to insert their own passwords
create policy "Users can insert their own saved passwords"
  on saved_passwords for insert
  with check (auth.uid() = user_id);

-- Create policy to allow users to delete their own passwords
create policy "Users can delete their own saved passwords"
  on saved_passwords for delete
  using (auth.uid() = user_id);

-- Set up indexing for faster queries
create index saved_passwords_user_id_idx on saved_passwords(user_id);