import { useState } from 'react';

export default function OfficialLogin({ onLogin }) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nom.trim() || !prenom.trim()) return;
    const fullName = `${prenom.trim()} ${nom.trim()}`;
    localStorage.setItem('officialName', fullName);
    onLogin(fullName);
  };

  return (
    <div className="max-w-sm mx-auto mt-20">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
          Mes Missions
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Entrez votre nom et prénom pour consulter vos convocations.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Prénom</label>
            <input
              type="text"
              placeholder="Votre prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Nom</label>
            <input
              type="text"
              placeholder="Votre nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={!nom.trim() || !prenom.trim()}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
          >
            Voir mes missions
          </button>
        </form>
      </div>
    </div>
  );
}
