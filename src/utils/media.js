export const STORAGE_KEY = 'hexagone-cinescope-items';
export const STATUS_OPTIONS = ['À voir', 'Vu'];

export function normalizeMediaItem(item, index = 0) {
  const rawRating = typeof item.rating === 'number' ? item.rating : Number(item.rating);
  const rating = Number.isFinite(rawRating) ? rawRating : null;

  return {
    id: item.id ?? `media-${Date.now()}-${index}`,
    title: item.title ?? 'Sans titre',
    director: item.director ?? 'Inconnu',
    year: item.year ?? '',
    genre: item.genre ?? 'Non renseigné',
    status: STATUS_OPTIONS.includes(item.status) ? item.status : 'À voir',
    description: item.description ?? 'Aucune description fournie.',
    rating,
    favorite: Boolean(item.favorite),
    source: item.source ?? 'local',
  };
}

export function getNextStatus(currentStatus) {
  return currentStatus === 'Vu' ? 'À voir' : 'Vu';
}

export function countFavorites(items) {
  return items.filter((item) => item.favorite).length;
}

export function countWatched(items) {
  return items.filter((item) => item.status === 'Vu').length;
}
