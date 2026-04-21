import { STATUS_OPTIONS } from '../utils/media.js';

function FilterBar({ searchTerm, onSearchChange, statusFilter, onStatusChange, onReset }) {
  return (
    <div className="filter-bar">
      <label className="field">
        <span>Recherche par titre</span>
        <input
          type="search"
          placeholder="Le Seigneur des Anneaux (faut les voir)"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <label className="field">
        <span>Filtrer par statut</span>
        <select value={statusFilter} onChange={(event) => onStatusChange(event.target.value)}>
          <option value="Tous">Tous</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <button type="button" className="secondary-button" onClick={onReset}>
        Réinitialiser
      </button>
    </div>
  );
}

export default FilterBar;
