import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { fetchMatches } from '../lib/supabase';

export function useMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchMatches();
      setMatches(data);
    } catch (err) {
      console.error('Erreur chargement matchs:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();

    // Supabase Realtime : écoute les changements sur la table matches
    const channel = supabase
      .channel('matches-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches' },
        () => {
          // Recharger tous les matchs à chaque changement
          load();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  return { matches, loading };
}
