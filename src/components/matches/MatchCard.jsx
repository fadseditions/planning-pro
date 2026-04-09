import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ROLE_LABELS = {
  arbitre1: 'Arbitre 1',
  arbitre2: 'Arbitre 2',
  chronometreur: 'Chronométreur',
  marqueur: 'Marqueur',
  responsableSalle: 'Responsable de salle',
};

export default function MatchCard({ match, showOfficials = false }) {
  const isHome = match.isHome;
  const dateTime = match.dateTime instanceof Date ? match.dateTime : new Date(match.dateTime);

  const hasVacancy =
    isHome &&
    match.officials &&
    Object.values(match.officials).some((v) => !v);

  const vacantCount =
    isHome && match.officials
      ? Object.values(match.officials).filter((v) => !v).length
      : 0;

  // Google Calendar link
  const startDate = format(dateTime, "yyyyMMdd'T'HHmmss");
  const endDate = format(
    new Date(dateTime.getTime() + 2 * 60 * 60 * 1000),
    "yyyyMMdd'T'HHmmss"
  );
  const calTitle = `${match.category} - ${isHome ? 'vs' : '@'} ${match.opponent}`;
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calTitle)}&dates=${startDate}/${endDate}&location=${encodeURIComponent(match.venue || '')}`;

  return (
    <div
      className={`rounded-xl border-l-4 p-4 bg-white shadow-sm transition-shadow hover:shadow-md ${
        isHome ? 'border-blue-500' : 'border-orange-500'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                isHome
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-orange-100 text-orange-700'
              }`}
            >
              {isHome ? 'DOM' : 'EXT'}
            </span>
            <span className="text-sm font-medium text-gray-500">
              {match.category}
            </span>
            {hasVacancy && (
              <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700 animate-pulse">
                {vacantCount} poste{vacantCount > 1 ? 's' : ''} à pourvoir
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold mt-1 text-gray-900">
            {isHome
              ? `${match.category} vs ${match.opponent}`
              : `${match.category} @ ${match.opponent}`}
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              {format(dateTime, 'EEEE d MMMM yyyy', { locale: fr })}
            </span>
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.828a1 1 0 101.415-1.414L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {format(dateTime, 'HH:mm')}
            </span>
            {match.venue && (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {match.venue}
              </span>
            )}
          </div>
        </div>
        <a
          href={gcalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          title="Ajouter au calendrier"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          <span className="hidden sm:inline">Calendrier</span>
        </a>
      </div>

      {showOfficials && isHome && match.officials && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Officiels
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(match.officials).map(([role, name]) => (
              <span
                key={role}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                  name
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                <span className="font-medium">{ROLE_LABELS[role] || role}:</span>
                {name || 'À pourvoir'}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
