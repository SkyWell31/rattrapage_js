import { useMemo, useState } from 'react';
import { containsHtmlLikeInput, sanitizePlainText } from '../utils/security.js';
import { STATUS_OPTIONS } from '../utils/media.js';

const INITIAL_FORM = {
  title: '',
  director: '',
  status: 'À voir',
  genre: '',
  year: '',
  rating: '',
  description: '',
};

function AddMediaForm({ onAdd }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const currentYear = useMemo(() => new Date().getFullYear() + 1, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function validate() {
    const nextErrors = {};

    const cleanedTitle = sanitizePlainText(formData.title, 120);
    const cleanedDirector = sanitizePlainText(formData.director, 120);
    const cleanedGenre = sanitizePlainText(formData.genre, 60);
    const cleanedDescription = sanitizePlainText(formData.description, 800);

    if (!cleanedTitle) {
      nextErrors.title = 'Le titre est obligatoire.';
    }

    if (!cleanedDirector) {
      nextErrors.director = 'Le réalisateur ou créateur est obligatoire.';
      {/* Oui, c'est un if/else déguisé,
        mais au moins on a pas de risque d'injection par là car on utilise sanitizePlainText dans security.js */}
    }

    [
      ['title', formData.title, 'Le titre contient du contenu non autorisé.'],
      ['director', formData.director, 'Le réalisateur contient du contenu non autorisé.'],
      ['genre', formData.genre, 'Le genre contient du contenu non autorisé.'],
      ['description', formData.description, 'La description contient du contenu non autorisé.'],
    ].forEach(([key, value, message]) => {
      if (containsHtmlLikeInput(value)) {
        nextErrors[key] = message;
      }
    });

    if (formData.year) {
      const parsedYear = Number(formData.year);
      if (!Number.isInteger(parsedYear) || parsedYear < 1888) {
        nextErrors.year = `Chef, même les elfes n'avaient pas créé de films avant 1888...`;
      }
      if (parsedYear > currentYear) {
        nextErrors.year = `Ta vie c'est voyage vers le futur? Je m'en fiche j'accepte pas car LOTR > Retour vers le futur.`;
      }
    }

    if (formData.rating) {
      const parsedRating = Number(formData.rating);
      if (Number.isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
        nextErrors.rating = `La note doit être comprise entre 0 et 5. Sauf pour LOTR où là c'est 100/5 évidemment.`;
      }
    }

    if (cleanedGenre.length > 60) {
      nextErrors.genre = 'Le genre est trop long.';
    }

    if (cleanedDescription.length > 800) {
      nextErrors.description = 'La description est trop longue.';
    }

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    // Si le conseil d’Elrond refuse le formulaire, on n’avance pas.
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const safeStatus = STATUS_OPTIONS.includes(formData.status) ? formData.status : 'À voir';

    onAdd({
      title: sanitizePlainText(formData.title, 120),
      director: sanitizePlainText(formData.director, 120),
      status: safeStatus,
      genre: sanitizePlainText(formData.genre, 60) || 'Non renseigné',
      year: formData.year ? Number(formData.year) : '',
      rating: formData.rating ? Number(formData.rating) : null,
      description:
        sanitizePlainText(formData.description, 800) || 'Aucune description fournie.',
      favorite: false,
      source: 'local',
    });

    setFormData(INITIAL_FORM);
    setErrors({});
  }

  return (
    <form className="media-form" onSubmit={handleSubmit} noValidate>
      <p className="form-intro">
        Tu peux ajouter tes films à la main, mais personne n’empêchera jamais la trilogie de
        reprendre la première place.
      </p>

      <div className="form-grid">
        <label className="field">
          <span>Titre *</span>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            maxLength={120}
            autoComplete="off"
          />
          {errors.title ? <small className="field-error">{errors.title}</small> : null}
        </label>

        <label className="field">
          <span>Réalisateur / créateur *</span>
          <input
            name="director"
            type="text"
            value={formData.director}
            onChange={handleChange}
            maxLength={120}
            autoComplete="off"
          />
          {errors.director ? <small className="field-error">{errors.director}</small> : null}
        </label>

        <label className="field">
          <span>Statut</span>
          <select name="status" value={formData.status} onChange={handleChange}>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Genre</span>
          <input
            name="genre"
            type="text"
            value={formData.genre}
            onChange={handleChange}
            maxLength={60}
            autoComplete="off"
          />
          {errors.genre ? <small className="field-error">{errors.genre}</small> : null}
        </label>

        <label className="field">
          <span>Année</span>
          <input
            name="year"
            type="number"
            min="1888"
            max={currentYear}
            value={formData.year}
            onChange={handleChange}
            inputMode="numeric"
          />
          {errors.year ? <small className="field-error">{errors.year}</small> : null}
        </label>

        <label className="field">
          <span>Note /5</span>
          <input
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.5"
            value={formData.rating}
            onChange={handleChange}
            inputMode="decimal"
          />
          {errors.rating ? <small className="field-error">{errors.rating}</small> : null}
        </label>
      </div>

      <label className="field">
        <span>Description</span>
        <textarea
          name="description"
          rows="5"
          value={formData.description}
          onChange={handleChange}
          maxLength={800}
          placeholder="Résumé, critique, éléments importants..."
        />
        {errors.description ? <small className="field-error">{errors.description}</small> : null}
      </label>

      <button type="submit" className="primary-button">
        Ajouter à la collection
      </button>
    </form>
  );
}

export default AddMediaForm;
