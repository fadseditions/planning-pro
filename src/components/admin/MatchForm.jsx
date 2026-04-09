import { useState, useEffect } from 'react';
import { addMatch, updateMatch } from '../../lib/firebase';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const EMPTY_OFFICIALS = {
  arbitre1: '',
  arbitre2: '',
  chronometreur: '',
  marqueur: '',
  responsableSalle: '',
};

const ROLE_LABELS = {
  arbitre1: 'Arbitre 1',
  arbitre2: 'Arbitre 2',
  chronometreur: 'Chronométreur',
  marqueur: 'Marqueur',
  responsableSalle: 'Responsable de salle',
};

const INITIAL_STATE = {
  category: '',
  opponent: '',
  date: '',
  time: '',
  venue: '',
  isHome: true,
  officials: { ...EMPTY_OFFICIALS },
};

export default function MatchForm({ editingMatch, onDone }) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingMatch) {
      const dt =
        editingMatch.dateTime instanceof Date
          ? editingMatch.dateTime
          : new Date(editingMatch.dateTime);
      setForm({
        category: editingMatch.category || '',
        opponent: editingMatch.opponent || '',
        date: format(dt, 'yyyy-MM-dd'),
        time: format(dt, 'HH:mm'),
        venue: editingMatch.venue || '',
        isHome: editingMatch.isHome ?? true,
        officials: editingMatch.officials
          ? { ...EMPTY_OFFICIALS, ...editingMatch.officials }
          : { ...EMPTY_OFFICIALS },
      });
    } else {
      setForm(INITIAL_STATE);
    }
  }, [editingMatch]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOfficialChange = (role, value) => {
    setForm((prev) => ({
      ...prev,
      officials: { ...prev.officials, [role]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category.trim() || !form.opponent.trim() || !form.date || !form.time) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSaving(true);
    const dateTime = `${form.date}T${form.time}`;
    const matchData = {
      category: form.category.trim(),
      opponent: form.opponent.trim(),
      dateTime,
      venue: form.venue.trim(),
      isHome: form.isHome,
      officials: form.isHome ? form.officials : {},
    };

    try {
      if (editingMatch) {
        await updateMatch(editingMatch.id, matchData);
        toast.success('Match modifié avec succès');
      } else {
        await addMatch(matchData);
        toast.success('Match créé avec succès');
      }
      setForm(INITIAL_STATE);
      onDone?.();
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setForm(INITIAL_STATE);
    onDone?.();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
        {editingMatch ? 'Modifier le match' : 'Nouveau match'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Catégorie *
            </label>
            <input
              type="text"
              placeholder="Ex: U15 Féminines"
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Adversaire *
            </label>
            <input
              type="text"
              placeholder="Ex: Club Adverse"
              value={form.opponent}
              onChange={(e) => handleChange('opponent', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date *</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Heure *</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => handleChange('time', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Lieu</label>
            <input
              type="text"
              placeholder="Ex: Gymnase Jean Moulin"
              value={form.venue}
              onChange={(e) => handleChange('venue', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer pb-2">
              <input
                type="checkbox"
                checked={form.isHome}
                onChange={(e) => handleChange('isHome', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Match à domicile</span>
            </label>
          </div>
        </div>

        {form.isHome && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Affectation des officiels
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(ROLE_LABELS).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    placeholder="Nom Prénom"
                    value={form.officials[key]}
                    onChange={(e) => handleOfficialChange(key, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
          >
            {saving
              ? 'Sauvegarde...'
              : editingMatch
              ? 'Modifier'
              : 'Créer le match'}
          </button>
          {editingMatch && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
