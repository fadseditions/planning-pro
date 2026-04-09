import { useState, useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { matchesQuery } from '../lib/firebase';

export function useMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(matchesQuery(), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        dateTime: doc.data().dateTime?.toDate?.() || new Date(doc.data().dateTime),
      }));
      setMatches(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { matches, loading };
}
