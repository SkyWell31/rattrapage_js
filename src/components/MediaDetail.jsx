import StatusBadge from './StatusBadge.jsx';

function MediaDetail({ item, onToggleFavorite, onToggleStatus }) {
  if (!item) {
    return (
      <div className="detail-placeholder">
        <h2>Détail du média</h2>
        <p>Sélectionne un film ou une série dans la liste pour afficher sa fiche complète.</p>
      </div>
    );
  }

  return (
    <div className="detail-card">
      <div className="detail-card__header">
        <div>
          <p className="eyebrow">Fiche détaillée</p>
          <h2>{item.title}</h2>
          <p className="detail-card__subtitle">
            {item.director}
            {item.year ? ` • ${item.year}` : ''}
          </p>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <dl className="detail-grid">
        <div>
          <dt>Genre</dt>
          <dd>{item.genre}</dd>
        </div>
        <div>
          <dt>Note</dt>
          <dd>{item.rating ? `${item.rating}/5` : 'Non noté'}</dd>
        </div>
        <div>
          <dt>Favori</dt>
          <dd>{item.favorite ? 'Oui' : 'Non'}</dd> {/*toujours et encore if/else : sinon bam j'drop le .env*/}
        </div>
        <div>
          <dt>Source</dt>
          <dd>{item.source === 'tmdb' ? 'Import TMDB' : 'Collection locale'}</dd>
        </div>
      </dl>

      <div className="detail-card__body">
        <h3>Description</h3>
        <p>{item.description}</p>
      </div>

      <div className="detail-card__actions">
        <button type="button" className="primary-button" onClick={() => onToggleFavorite(item.id)}>
          {item.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        </button>
        <button type="button" className="secondary-button" onClick={() => onToggleStatus(item.id)}>
          {item.status === 'Vu' ? 'Remettre à voir' : 'Marquer comme vu'}
        </button>
      </div>
    </div>
  );
}

export default MediaDetail;
