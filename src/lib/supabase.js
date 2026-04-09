import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Helpers pour convertir entre format DB et format app ---

function dbToMatch(row) {
  return {
    id: row.id,
    category: row.category,
    opponent: row.opponent,
    dateTime: new Date(row.date_time),
    venue: row.venue || '',
    isHome: row.is_home,
    officials: row.is_home
      ? {
          arbitre1: row.arbitre1 || '',
          arbitre2: row.arbitre2 || '',
          chronometreur: row.chronometreur || '',
          marqueur: row.marqueur || '',
          responsableSalle: row.responsable_salle || '',
        }
      : {},
    createdAt: row.created_at,
  };
}

// --- Matches CRUD ---

export async function fetchMatches() {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('date_time', { ascending: true });

  if (error) throw error;
  return (data || []).map(dbToMatch);
}

export async function addMatch(matchData) {
  const row = {
    category: matchData.category,
    opponent: matchData.opponent,
    date_time: matchData.dateTime,
    venue: matchData.venue,
    is_home: matchData.isHome,
    arbitre1: matchData.officials?.arbitre1 || '',
    arbitre2: matchData.officials?.arbitre2 || '',
    chronometreur: matchData.officials?.chronometreur || '',
    marqueur: matchData.officials?.marqueur || '',
    responsable_salle: matchData.officials?.responsableSalle || '',
  };

  const { data, error } = await supabase.from('matches').insert(row).select().single();
  if (error) throw error;
  return data.id;
}

export async function updateMatch(id, matchData) {
  const row = {
    category: matchData.category,
    opponent: matchData.opponent,
    date_time: matchData.dateTime,
    venue: matchData.venue,
    is_home: matchData.isHome,
    arbitre1: matchData.officials?.arbitre1 || '',
    arbitre2: matchData.officials?.arbitre2 || '',
    chronometreur: matchData.officials?.chronometreur || '',
    marqueur: matchData.officials?.marqueur || '',
    responsable_salle: matchData.officials?.responsableSalle || '',
  };

  const { error } = await supabase.from('matches').update(row).eq('id', id);
  if (error) throw error;
}

export async function deleteMatch(id) {
  const { error } = await supabase.from('matches').delete().eq('id', id);
  if (error) throw error;
}

// --- Club Config ---

export async function getClubConfig() {
  const { data, error } = await supabase
    .from('config')
    .select('*')
    .eq('id', 'club')
    .single();

  if (error || !data) {
    return { clubName: 'Mon Club Sportif', adminPassword: 'admin' };
  }

  return {
    clubName: data.club_name,
    adminPassword: data.admin_password,
  };
}

export async function updateClubConfig(configData) {
  const { error } = await supabase
    .from('config')
    .upsert({
      id: 'club',
      club_name: configData.clubName,
      admin_password: configData.adminPassword,
    });

  if (error) throw error;
}
