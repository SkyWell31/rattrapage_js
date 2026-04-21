import { useCallback, useEffect, useMemo, useState } from 'react';
import HomePage from './pages/HomePage.jsx';
import {
  countFavorites,
  countWatched,
  getNextStatus,
  normalizeMediaItem,
  STORAGE_KEY,
} from './utils/media.js';

const LOTR_ITEMS = [
  {
    id: 'm-1',
    title: 'Le Seigneur des Anneaux : La Communauté de l’Anneau',
    director: 'Peter Jackson',
    year: 2001,
    genre: 'Fantasy / Aventure',
    status: 'Vu',
    favorite: true,
    rating: 5,
    description:
      'Frodon hérite d’un anneau au pouvoir absolu et quitte la Comté avec une communauté hétéroclite pour empêcher Sauron de reconquérir la Terre du Milieu.',
    source: 'local',
  },
  {
    id: 'm-2',
    title: 'Le Seigneur des Anneaux : Les Deux Tours',
    director: 'Peter Jackson',
    year: 2002,
    genre: 'Fantasy / Aventure',
    status: 'Vu',
    favorite: true,
    rating: 5,
    description:
      'La communauté est brisée, mais la lutte continue entre les peuples libres et les forces de Saroumane, tandis que Frodon poursuit sa route vers le Mordor.',
    source: 'local',
  },
  {
    id: 'm-3',
    title: 'Le Seigneur des Anneaux : Le Retour du Roi',
    director: 'Peter Jackson',
    year: 2003,
    genre: 'Fantasy / Aventure',
    status: 'Vu',
    favorite: true,
    rating: 5,
    description:
      'Alors que la guerre pour la Terre du Milieu atteint son apogée, Aragorn assume son destin de roi tandis que Frodon approche de la Montagne du Destin.',
    source: 'local',
  },
];

const LOTR_TITLES = LOTR_ITEMS.map((item) => item.title);
const HEXAGONE_THEME_NAME = 'École Hexagone';

function ensureLotrPresence(items) {
  const normalizedCurrentItems = items.map((item, index) => normalizeMediaItem(item, index));

  const nonLotrItems = normalizedCurrentItems.filter(
    (item) => !LOTR_TITLES.includes(item.title),
  );

  const ensuredLotrItems = LOTR_ITEMS.map((canonicalItem, index) => {
    const existingItem = normalizedCurrentItems.find(
      (item) => item.title === canonicalItem.title,
    );

    if (existingItem) {
      return existingItem;
    }

    return normalizeMediaItem(canonicalItem, index);
  });

  return [...ensuredLotrItems, ...nonLotrItems];
}

function App() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBootstrapped, setIsBootstrapped] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/data/movies.json');
      if (!response.ok) {
        throw new Error('Le fichier des médias est introuvable.');
      }

      const fetchedItems = await response.json();
      const savedItems = localStorage.getItem(STORAGE_KEY);

      let initialItems = fetchedItems;
      if (savedItems) {
        try {
          initialItems = JSON.parse(savedItems);
        } catch {
          initialItems = fetchedItems;
        }
      }

      const protectedItems = ensureLotrPresence(initialItems);
      setItems(protectedItems);
      setSelectedId(protectedItems[0]?.id ?? null);
      setIsBootstrapped(true);
    } catch {
      setError('Impossible de charger les médias. Vérifie le fichier public/data/movies.json.');
      setIsBootstrapped(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = `Cinescope - ${HEXAGONE_THEME_NAME}`;
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    if (!isBootstrapped) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isBootstrapped]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.trim().toLowerCase());
      const matchesStatus = statusFilter === 'Tous' ? true : item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, searchTerm, statusFilter]);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );

  const lotrFavoriteCount = useMemo(() => {
    return items.filter((item) => LOTR_TITLES.includes(item.title) && item.favorite).length;
  }, [items]);

  useEffect(() => {
    document.documentElement.setAttribute('data-lotr-favorites', String(lotrFavoriteCount));
  }, [lotrFavoriteCount]);

  function handleSelect(id) {
    setSelectedId(id);
  }

  function handleToggleFavorite(id) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              favorite: !item.favorite,
            }
          : item,
      ),
    );
  }

  function handleToggleStatus(id) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              status: getNextStatus(item.status),
            }
          : item,
      ),
    );
  }

  function handleDelete(id) {
    const mediaToDelete = items.find((item) => item.id === id);

    if (!mediaToDelete) {
      return;
    }

    if (LOTR_TITLES.includes(mediaToDelete.title)) {
      window.alert(
        `Impossible de supprimer « ${mediaToDelete.title} ». La Terre du Milieu refuse cette décision.`,
      );

      setItems((currentItems) => {
        const remainingItems = currentItems.filter((item) => item.id !== id);
        return ensureLotrPresence([...remainingItems, mediaToDelete]);
      });

      setSelectedId(mediaToDelete.id);
      return;
    }

    const confirmed = window.confirm(
      `Supprimer « ${mediaToDelete.title ?? 'cet élément'} » de la collection ?`,
    );

    if (!confirmed) {
      return;
    }

    const remainingItems = items.filter((item) => item.id !== id);
    setItems(remainingItems);

    if (selectedId === id) {
      setSelectedId(remainingItems[0]?.id ?? null);
    }
  }

  function handleAdd(newItem) {
    const itemToInsert = normalizeMediaItem(
      {
        ...newItem,
        id: newItem.id ?? crypto.randomUUID(),
      },
      items.length,
    );

    setItems((currentItems) => {
      const withoutDuplicateId = currentItems.filter((item) => item.id !== itemToInsert.id);
      const withoutDuplicateTmdbTitle = withoutDuplicateId.filter(
        (item) => !(item.source === 'tmdb' && item.title === itemToInsert.title && item.year === itemToInsert.year),
      );
      const updatedItems = [itemToInsert, ...withoutDuplicateTmdbTitle];
      return ensureLotrPresence(updatedItems);
    });

    setSelectedId(itemToInsert.id);
  }

  function handleResetFilters() {
    setSearchTerm('');
    setStatusFilter('Tous');
  }

  return (
    <HomePage
      items={items}
      filteredItems={filteredItems}
      selectedItem={selectedItem}
      selectedId={selectedId}
      searchTerm={searchTerm}
      statusFilter={statusFilter}
      loading={loading}
      error={error}
      totalCount={items.length}
      watchedCount={countWatched(items)}
      favoriteCount={countFavorites(items)}
      lotrFavoriteCount={lotrFavoriteCount}
      onSearchChange={setSearchTerm}
      onStatusChange={setStatusFilter}
      onResetFilters={handleResetFilters}
      onSelect={handleSelect}
      onToggleFavorite={handleToggleFavorite}
      onToggleStatus={handleToggleStatus}
      onDelete={handleDelete}
      onRetry={loadItems}
      onAdd={handleAdd}
    />
  );
}

export default App;
