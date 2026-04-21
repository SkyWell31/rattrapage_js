function Header({ totalCount, watchedCount, favoriteCount }) {
  return (
    <header className="hero panel">
      <div>
        <p className="eyebrow">Mini application React / Vite</p>
        <h1>CinéScope Hexagone</h1>
        <p className="hero__text">
          Gère ta collection de films et séries, ajoute tes médias à la main ou importe-les
          depuis TMDB, puis n’oublie pas d’honorer la trilogie sacrée.
        </p>
      </div>

      <div className="hero__stats">
        <div className="stat-card">
          <span className="stat-card__label">Éléments</span>
          <strong>{totalCount}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Déjà vus</span>
          <strong>{watchedCount}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Favoris</span>
          <strong>{favoriteCount}</strong>
        </div>
      </div>
    </header>
  );
}

export default Header;
