import { useState, useMemo } from 'react';
import { useMatches } from '../hooks/useMatches';
import OfficialLogin from '../components/officials/OfficialLogin';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ROLE_LABELS = {
  arbitre1: 'Arbitre 1',
  arbitre2: 'Arbitre 2',
  chronometreur: 'Chronométreur',
  marqueur: 'Marqueur',
  responsableSalle: 'Responsable de salle',
};

export default function OfficialsPage() {
  const { matches, loading } = useMatches();
  const [officialName, setOfficialName] = useState(
    () => localStorage.getItem('officialName') || ''
  );

  const handleLogout = () => {
    localStorage.removeItem('officialName');
    setOfficialName('');
  };

  const myMissions = useMemo(() => {
    if (!officialName) return [];
    const nameLower = officialName.toLowerCase();
    const now = new Date();

    return matches
      .filter((match) => {
        if (!match.isHome || !match.officials) return false;
        const dt = match.dateTime instanceof Date ? match.dateTime : new Date(match.dateTime);
        if (dt < now) return false;
        return Object.values(match.officials).some(
          (v) => v && v.toLowerCase().includes(nameLower)
        );
      })
      .map((match) => {
        const roles = Object.entries(match.officials)
          .filter(([, v]) => v && v.toLowerCase().includes(nameLower))
          .map(([key]) => ROLE_LABELS[key] || key);
        return { ...match, assignedRoles: roles };
      });
  }, [matches, officialName]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!officialName) {
    return <OfficialLogin onLogin={setOfficialName} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Missions</h1>
          <p className="text-sm text-gray-500">
            Connecté en tant que <span className="font-medium text-gray-700">{officialName}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Changer
        </button>
      </div>

      {myMissions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500">Aucune mission à venir pour le moment.</p>
          <p className="text-xs text-gray-400 mt-1">
            Vérifiez que votre nom correspond à celui utilisé par l'administrateur.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {myMissions.map((mission) => {
            const dt =
              mission.dateTime instanceof Date
                ? mission.dateTime
                : new Date(mission.dateTime);

            return (
              <div
                key={mission.id}
                className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500"
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {mission.assignedRoles.map((role) => (
                    <span
                      key={role}
                      className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700"
                    >
                      {role}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {mission.category} vs {mission.opponent}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {format(dt, 'EEEE d MMMM yyyy', { locale: fr })}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.828a1 1 0 101.415-1.414L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {format(dt, 'HH:mm')}
                  </span>
                  {mission.venue && (
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {mission.venue}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
