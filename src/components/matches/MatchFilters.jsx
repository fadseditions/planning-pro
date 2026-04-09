export default function MatchFilters({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  showPast,
  onShowPastChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Rechercher (équipe, catégorie, lieu)..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        {[
          { value: 'all', label: 'Tous' },
          { value: 'home', label: 'Domicile' },
          { value: 'away', label: 'Extérieur' },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => onFilterChange(opt.value)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === opt.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
        <button
          onClick={() => onShowPastChange(!showPast)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            showPast
              ? 'bg-gray-700 text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {showPast ? 'Masquer passés' : 'Voir passés'}
        </button>
      </div>
    </div>
  );
}
