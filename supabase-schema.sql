-- ===========================================
-- Planning Sportif - Schéma Supabase
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- ===========================================

-- Table des matchs
create table if not exists matches (
  id uuid default gen_random_uuid() primary key,
  category text not null,
  opponent text not null,
  date_time timestamptz not null,
  venue text default '',
  is_home boolean default true,
  arbitre1 text default '',
  arbitre2 text default '',
  chronometreur text default '',
  marqueur text default '',
  responsable_salle text default '',
  created_at timestamptz default now()
);

-- Table de configuration du club
create table if not exists config (
  id text primary key default 'club',
  club_name text default 'Mon Club Sportif',
  admin_password text default 'admin'
);

-- Insérer la config par défaut
insert into config (id, club_name, admin_password)
values ('club', 'Mon Club Sportif', 'admin')
on conflict (id) do nothing;

-- Activer le Realtime sur les deux tables
alter publication supabase_realtime add table matches;
alter publication supabase_realtime add table config;

-- RLS : lecture publique, écriture libre (protégée par mot de passe dans l'app)
alter table matches enable row level security;
alter table config enable row level security;

create policy "Lecture publique des matchs" on matches
  for select using (true);

create policy "Écriture des matchs" on matches
  for all using (true) with check (true);

create policy "Lecture publique config" on config
  for select using (true);

create policy "Écriture config" on config
  for all using (true) with check (true);

-- Index pour le tri chronologique
create index if not exists idx_matches_date_time on matches (date_time asc);
