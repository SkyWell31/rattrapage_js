import StatusBadge from './StatusBadge.jsx';

function MediaCard({ item, isSelected, onSelect, onToggleFavorite, onToggleStatus, onDelete }) {
  return (
    <article className={`media-card ${isSelected ? 'media-card--selected' : ''}`}>
      <div className="media-card__top">
        <div>
          <h3>{item.title}</h3>
          <p className="media-card__subtitle">
            {item.director}
            {item.year ? ` • ${item.year}` : ''}
          </p>
        </div>

        <button
          type="button"
          className={`favorite-button ${item.favorite ? 'is-active' : ''}`}
          onClick={() => onToggleFavorite(item.id)}
          aria-label={item.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          title={item.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          {/* Y'a pas de if/else ici, sinon on peut se prendre une injection par là 
          Et merci chat gpt pour les symboles*/}
          {item.favorite ? '★' : '☆'}
        </button>
      </div>

      <p className="media-card__meta">Genre : {item.genre}</p>
      <StatusBadge status={item.status} />

      <div className="media-card__actions">
        <button type="button" className="primary-button" onClick={() => onSelect(item.id)}>
          Détails
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={() => onToggleStatus(item.id)}
        >
          {item.status === 'Vu' ? 'Remettre à voir' : 'Marquer comme vu'} {/* Hop là j'te vois toi, tu passes en if/else */}
        </button>

        <button type="button" className="danger-button" onClick={() => onDelete(item.id)}>
          Supprimer
        </button>
      </div>
    </article>
  );
}

export default MediaCard;
