import EmptyState from './EmptyState.jsx';
import MediaCard from './MediaCard.jsx';

function MediaList({ items, selectedId, onSelect, onToggleFavorite, onToggleStatus, onDelete }) {
  /* Y'a pas de onDelete qui passe sur LOTR */
  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="media-list">
      {items.map((item) => (
        <MediaCard
          key={item.id}
          item={item}
          isSelected={selectedId === item.id}
          onSelect={onSelect}
          onToggleFavorite={onToggleFavorite}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default MediaList;
