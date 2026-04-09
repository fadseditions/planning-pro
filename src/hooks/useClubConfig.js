import { useState, useEffect, useCallback } from 'react';
import { supabase, getClubConfig } from '../lib/supabase';

export function useClubConfig() {
  const [config, setConfig] = useState({ clubName: 'Mon Club Sportif', adminPassword: 'admin' });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await getClubConfig();
      setConfig(data);
    } catch (err) {
      console.error('Erreur chargement config:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();

    // Supabase Realtime : écoute les changements sur la table config
    const channel = supabase
      .channel('config-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'config' },
        () => {
          load();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  return { config, loading };
}
