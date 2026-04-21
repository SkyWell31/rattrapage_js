import { useMemo, useState } from 'react';
import { sanitizePlainText } from '../utils/security.js';

const TMDB_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;
/*
si tu vois ça, c'est que t'as pas créé ton token ^^
Allez je t'aide c'est dans le .env, mais avant faut que t'aille créer ton compte.
Puis tu cliques sur "Plus" sur TMDB, puis API for Business.
*/
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function roundVoteToFive(voteAverage) {
  if (!Number.isFinite(voteAverage) || voteAverage <= 0) {
    return null;
  }

  return Math.round((voteAverage / 2) * 10) / 10;
  {/* Comment j'ai demandé à ChatGPT car j'arrivais pas à faire le calcul correctement 🤡 */}
}

function extractYear(dateString) {
  if (!dateString || typeof dateString !== 'string') {
    return '';
  }

  const year = Number(dateString.slice(0, 4));
  return Number.isInteger(year) ? year : '';
}

function MovieImportPanel({ onImport }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [importingId, setImportingId] = useState(null);

  const hasToken = useMemo(() => Boolean(TMDB_TOKEN), []);

  async function searchMovies(event) {
    event.preventDefault();

    const cleanQuery = sanitizePlainText(query, 100);

    if (!cleanQuery) {
      setError('Tape un titre avant de lancer la recherche. Même Gandalf ne devine pas tout.');
      setResults([]);
      return;
    }

    if (!hasToken) {
      setError(
        'Ajoute VITE_TMDB_READ_ACCESS_TOKEN dans ton .env pour activer l’import TMDB.',
      );
      return;
    }

    setLoading(true);
    setError('');
    setInfo('');

    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(cleanQuery)}&language=fr-FR&include_adult=false&page=1`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_TOKEN}`,
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('TMDB a refusé la recherche. Vérifie ton token ou réessaie.');
      }

      const payload = await response.json();
      const nextResults = Array.isArray(payload.results) ? payload.results.slice(0, 6) : [];

      setResults(nextResults);
      {/* Hop hop hop, changement en ternaire le plus rapide de ma vie*/ }
      setInfo(
        nextResults.length > 0
          ? `${nextResults.length} résultat(s) TMDB trouvé(s).`
          : 'Aucun résultat TMDB pour cette recherche.',
      );
    } catch (searchError) {
      setError(searchError.message || 'Impossible de rechercher sur TMDB pour le moment.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  async function importMovie(movieId) {
    if (!hasToken) {
      setError('Impossible d’importer sans token TMDB.');
      return;
    }

    setImportingId(movieId);
    setError('');
    setInfo('');

    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${movieId}?language=fr-FR&append_to_response=credits`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_TOKEN}`,
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Impossible de récupérer le détail du film sur TMDB.');
      }

      const movie = await response.json();
      const director = movie.credits?.crew?.find((person) => person.job === 'Director')?.name;
      const genres = Array.isArray(movie.genres)
        ? movie.genres.map((genre) => genre.name).filter(Boolean).join(' / ')
        : '';

      onImport({
        id: `tmdb-${movie.id}`,
        title: sanitizePlainText(movie.title || movie.original_title || 'Sans titre', 120),
        director: sanitizePlainText(director || 'Réalisateur TMDB à compléter', 120),
        year: extractYear(movie.release_date),
        genre: sanitizePlainText(genres || 'Non renseigné', 80),
        status: 'À voir',
        favorite: false,
        rating: roundVoteToFive(movie.vote_average),
        description:
          sanitizePlainText(movie.overview || 'Importé depuis TMDB, mais sans résumé disponible.', 800),
        source: 'tmdb',
      });

      setInfo(`« ${movie.title} » a rejoint la collection. Un pas de plus vers la gloire.`);
    } catch (importError) {
      setError(importError.message || 'Import TMDB impossible pour le moment.');
    } finally {
      setImportingId(null);
    }
  }

  return (
    <section className="panel panel--import">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Import TMDB</p>
          <h2>Importer un film</h2>
        </div>
        <p className="section-heading__text">
          Cherche un titre, récupère les infos depuis TMDB, puis ajoute le film en un clic.
        </p>
      </div>

      <form className="import-bar" onSubmit={searchMovies}>
        <label className="field">
          <span>Titre à importer</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Interstellar, Whiplash, Parasite..."
            autoComplete="off"
          />
        </label>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Recherche…' : 'Chercher sur TMDB'}
        </button>
      </form>

      {!hasToken ? (
        <div className="feedback-box feedback-box--warning">
          <p>
            Renseigne <code>VITE_TMDB_READ_ACCESS_TOKEN</code> dans ton <code>.env</code> pour
            activer l’import de films.
          </p>
        </div>
      ) : null}

      {error ? (
        <div className="feedback-box feedback-box--error">
          <p>{error}</p>
        </div>
      ) : null}

      {info ? (
        <div className="feedback-box feedback-box--info">
          <p>{info}</p>
        </div>
      ) : null}

      {results.length > 0 ? (
        <div className="import-results">
          {results.map((movie) => (
            <article key={movie.id} className="import-card">
              <div>
                <h3>{movie.title}</h3>
                <p className="import-card__meta">
                  {extractYear(movie.release_date) || 'Année inconnue'}
                  {movie.vote_average ? ` • ${roundVoteToFive(movie.vote_average)}/5` : ''}
                </p>
                <p className="import-card__overview">
                  {sanitizePlainText(
                    movie.overview || 'TMDB n’a pas donné de résumé pour ce film.',
                    220,
                  )}
                </p>
              </div>

              <button
                type="button"
                className="secondary-button"
                onClick={() => importMovie(movie.id)}
                disabled={importingId === movie.id}
              >
                {importingId === movie.id ? 'Import…' : 'Importer'}
              </button>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default MovieImportPanel;
