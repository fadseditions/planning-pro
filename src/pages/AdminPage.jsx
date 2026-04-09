import { useState, useEffect } from 'react';
import { useMatches } from '../hooks/useMatches';
import { useClubConfig } from '../hooks/useClubConfig';
import { deleteMatch } from '../lib/supabase';
import AdminLogin from '../components/admin/AdminLogin';
import MatchForm from '../components/admin/MatchForm';
import ClubSettings from '../components/admin/ClubSettings';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { matches, loading } = useMatches();
  const { config, loading: configLoading } = useClubConfig();
  const [authenticated, setAuthenticated] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);

  useEffect(() => {
    if (sessionStorage.getItem('adminAuth') === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const handleDelete = async (match) => {
    if (!window.confirm(`Supprimer le match ${match.category} vs ${match.opponent} ?`)) {
      return;
    }
    try {
      await deleteMatch(match.id);
      toast.success('Match supprimé');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setAuthenticated(false);
  };

  if (loading || configLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin config={config} onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Déconnexion
        </button>
      </div>

      <ClubSettings config={config} />

      <MatchForm
        editingMatch={editingMatch}
        onDone={() => setEditingMatch(null)}
      />

      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
          Tous les matchs ({matches.length})
        </h2>
        {matches.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-white rounded-xl shadow-sm">
            <p>Aucun match enregistré. Créez votre premier match ci-dessus.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {matches.map((match) => {
              const dt =
                match.dateTime instanceof Date
                  ? match.dateTime
                  : new Date(match.dateTime);
              const hasVacancy =
                match.isHome &&
                match.officials &&
                Object.values(match.officials).some((v) => !v);

              return (
                <div
                  key={match.id}
                  className={`bg-white rounded-lg shadow-sm p-3 border-l-4 flex flex-col sm:flex-row sm:items-center gap-2 ${
                    match.isHome ? 'border-blue-500' : 'border-orange-500'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                          match.isHome
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {match.isHome ? 'DOM' : 'EXT'}
                      </span>
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {match.category} vs {match.opponent}
                      </span>
                      {hasVacancy && (
                        <span className="px-1.5 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">
                          À pourvoir
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(dt, 'EEEE d MMM yyyy à HH:mm', { locale: fr })}
                      {match.venue && ` — ${match.venue}`}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setEditingMatch(match)}
                      className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(match)}
                      className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
