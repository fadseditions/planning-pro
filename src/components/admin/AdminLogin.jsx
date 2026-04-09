import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminLogin({ config, onLogin }) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === config.adminPassword) {
      sessionStorage.setItem('adminAuth', 'true');
      onLogin();
      toast.success('Connexion réussie');
    } else {
      toast.error('Mot de passe incorrect');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
          Administration
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Entrez le mot de passe administrateur pour accéder à la gestion.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm mb-4"
            autoFocus
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
