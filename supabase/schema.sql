create extension if not exists pgcrypto;

create table if not exists public.tasks (
  id text primary key,
  title text not null,
  category text not null check (category in ('personal', 'school')),
  deadline text not null,
  isPriority boolean not null default false,
  isCompleted boolean not null default false,
  completedAt text,
  createdAt text not null,
  weekKey text
);

alter table public.tasks enable row level security;

create policy "Allow public read/write for task tracking"
on public.tasks
for all
using (true)
with check (true);

create index if not exists tasks_created_at_idx
on public.tasks (createdAt);

create index if not exists tasks_completed_idx
on public.tasks (isCompleted, weekKey);
