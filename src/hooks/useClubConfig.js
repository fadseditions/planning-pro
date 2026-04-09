import { useState, useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { clubConfigRef } from '../lib/firebase';

export function useClubConfig() {
  const [config, setConfig] = useState({ clubName: 'Mon Club Sportif', adminPassword: 'admin' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(clubConfigRef, (snap) => {
      if (snap.exists()) {
        setConfig(snap.data());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { config, loading };
}
