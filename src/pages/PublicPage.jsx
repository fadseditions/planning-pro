import { useState, useMemo } from 'react';
import { useMatches } from '../hooks/useMatches';
import MatchFilters from '../components/matches/MatchFilters';
import MatchList from '../components/matches/MatchList';

export default function PublicPage() {
  const { matches, loading } = useMatches();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showPast, setShowPast] = useState(false);

  const now = new Date();

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      const dateTime = m.dateTime instanceof Date ? m.dateTime : new Date(m.dateTime);

      // Past/future filter
      if (!showPast && dateTime < now) return false;

      // Home/Away filter
      if (filter === 'home' && !m.isHome) return false;
      if (filter === 'away' && m.isHome) return false;

      // Search filter
      if (search) {
        const q = search.toLowerCase();
        const searchable = `${m.category} ${m.opponent} ${m.venue || ''}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }

      return true;
    });
  }, [matches, search, filter, showPast]);

  const upcoming = filtered.filter(
    (m) => (m.dateTime instanceof Date ? m.dateTime : new Date(m.dateTime)) >= now
  );
  const past = filtered
    .filter(
      (m) => (m.dateTime instanceof Date ? m.dateTime : new Date(m.dateTime)) < now
    )
    .reverse();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Planning des matchs</h1>

      <MatchFilters
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        showPast={showPast}
        onShowPastChange={setShowPast}
      />

      {upcoming.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            À venir ({upcoming.length})
          </h2>
          <MatchList matches={upcoming} showOfficials />
        </div>
      )}

      {showPast && past.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            Passés ({past.length})
          </h2>
          <div className="opacity-60">
            <MatchList matches={past} showOfficials />
          </div>
        </div>
      )}

      {upcoming.length === 0 && (!showPast || past.length === 0) && (
        <MatchList matches={[]} emptyMessage="Aucun match trouvé pour ces critères." />
      )}
    </div>
  );
}
