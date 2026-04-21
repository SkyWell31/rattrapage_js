import { useEffect, useRef, useState } from 'react';
import AddMediaForm from '../components/AddMediaForm.jsx';
import FilterBar from '../components/FilterBar.jsx';
import Header from '../components/Header.jsx';
import MediaDetail from '../components/MediaDetail.jsx';
import MediaList from '../components/MediaList.jsx';
import MovieImportPanel from '../components/MovieImportPanel.jsx';

function HomePage({
  items,
  filteredItems,
  selectedItem,
  selectedId,
  searchTerm,
  statusFilter,
  loading,
  error,
  totalCount,
  watchedCount,
  favoriteCount,
  lotrFavoriteCount,
  onSearchChange,
  onStatusChange,
  onResetFilters,
  onSelect,
  onToggleFavorite,
  onToggleStatus,
  onDelete,
  onRetry,
  onAdd,
}) {
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const detailPanelRef = useRef(null);

  const remainingLotrFavorites = Math.max(0, 3 - lotrFavoriteCount);
  const shouldShowLotrWarning = lotrFavoriteCount < 3;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 980px)');

    function handleViewportChange(event) {
      const mobile = event.matches;
      setIsMobileLayout(mobile);

      if (!mobile) {
        setIsMobileDetailOpen(false);
      }
    }

    setIsMobileLayout(mediaQuery.matches);
    handleViewportChange(mediaQuery);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleViewportChange);
    } else {
      mediaQuery.addListener(handleViewportChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleViewportChange);
      } else {
        mediaQuery.removeListener(handleViewportChange);
      }
    };
  }, []);

  useEffect(() => {
    if (isMobileLayout && isMobileDetailOpen && detailPanelRef.current) {
      detailPanelRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [isMobileLayout, isMobileDetailOpen, selectedItem]);

  function handleSelectWithResponsiveBehavior(id) {
    onSelect(id);

    if (isMobileLayout) {
      setIsMobileDetailOpen(true);
    }
  }

  function handleCloseMobileDetail() {
    setIsMobileDetailOpen(false);
  }

  return (
    <div className="app-shell">
      {shouldShowLotrWarning ? (
        <section className="panel panel--lotr-warning">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Avertissement critique</p>
              <h1 className="hero-warning-title">
                ⚠️ METS LES 3 SEIGNEURS DES ANNEAUX EN FAVORIS ⚠️
              </h1>
            </div>

            <p className="section-heading__text section-heading__text--strong">
              Il en manque encore {remainingLotrFavorites}. Tant que la trilogie n’est pas
              respectée, le thème reste agressif.
            </p>
          </div>
        </section>
      ) : null}

      <Header
        totalCount={totalCount}
        watchedCount={watchedCount}
        favoriteCount={favoriteCount}
      />

      <div className="content-grid">
        <section className="panel panel--list">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Accueil</p>
              <h2>Liste des médias</h2>
            </div>
            <p className="section-heading__text">
              {filteredItems.length} résultat(s) affiché(s) sur {items.length} élément(s).
            </p>
          </div>

          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            statusFilter={statusFilter}
            onStatusChange={onStatusChange}
            onReset={onResetFilters}
          />

          {loading ? <p className="feedback-box">Chargement des données…</p> : null}

          {!loading && error ? (
            <div className="feedback-box feedback-box--error">
              <p>{error}</p>
              <button type="button" className="secondary-button" onClick={onRetry}>
                Réessayer
                </button>
            </div>
          ) : null}

          {!loading && !error ? (
            <MediaList
              items={filteredItems}
              selectedId={selectedId}
              onSelect={handleSelectWithResponsiveBehavior}
              onToggleFavorite={onToggleFavorite}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
            />
          ) : null}
        </section>

        {(!isMobileLayout || isMobileDetailOpen) && (
          <aside
            ref={detailPanelRef}
            className={`panel panel--detail ${isMobileLayout ? 'panel--detail-mobile-open' : ''}`}
          >
            {isMobileLayout ? (
              <div className="panel--detail-mobile-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleCloseMobileDetail}
                >
                  Fermer les détails
                </button>
              </div>
            ) : null}

            <MediaDetail
              item={selectedItem}
              onToggleFavorite={onToggleFavorite}
              onToggleStatus={onToggleStatus}
            />
          </aside>
        )}
      </div>

      <MovieImportPanel onImport={onAdd} />

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Ajout manuel</p>
            <h2>Ajouter un média</h2>
          </div>
          <p className="section-heading__text">
            Tu peux enrichir ta collection à la main, mais l’import TMDB t’épargne quand même
            quelques souffrances bien évitables.
          </p>
        </div>

        <AddMediaForm onAdd={onAdd} />
      </section>
    </div>
  );
}

export default HomePage;
