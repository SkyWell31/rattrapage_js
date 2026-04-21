# 🧙‍♂️ CinéScope de la Terre du Milieu

> **One app to list them all, One app to find them,  
> One app to bring them all, and in the interface bind them.**

## 1. Description courte

**CinéScope** est une mini-application frontend réalisée avec React + Vite permettant de gérer une collection de films et séries dans une interface inspirée par un culte absolu :
- la supériorité morale et cinématographique du **⚔️Seigneur des Anneaux🔥**.

L’application permet de :

- afficher une liste de médias sous forme de cartes ;
- rechercher un média par titre ;
- filtrer les médias par statut ;
- afficher le détail complet d’un média ;
- ajouter un nouveau média via un formulaire contrôlé ;
- marquer un média en favori ;
- changer son statut (À voir / Vu) ;
- supprimer un média ;
- charger les données initiales via `fetch()` depuis un fichier JSON mocké ;
- importer des films depuis TMDB via une recherche externe.

---

## 2. Thème choisi

- **Gestion de films / séries**

Mais spirituellement, l’application défend surtout une vérité simple :

> **Les 3 Seigneurs des Anneaux méritent d’être en favoris.**

Tant que cette vérité n’est pas respectée, le thème devient volontairement plus agressif.  
Plus les films de la trilogie sont remis en favoris, plus l’interface retrouve la paix.

---

## 3. Installation & lancement

### Prérequis

- **Node.js**
- **npm**

### Commandes

```bash
git clone https://github.com/SkyWell31/rattrapage_js.git
npm install
npm run dev
```

### Build de production

```bash
npm run build
npm run preview
```

---

### Rôle des principaux fichiers

- `App.jsx` : logique principale de l’application, état global, chargement, filtres, favoris, suppression, import externe.
- `pages/HomePage.jsx` : composition générale de la page.
- `components/MediaList.jsx` : affichage de la liste des médias.
- `components/MediaDetail.jsx` : fiche détaillée d’un média sélectionné.
- `components/AddMediaForm.jsx` : formulaire contrôlé pour l’ajout manuel.
- `components/MovieImportPanel.jsx` : recherche et import de films depuis TMDB.
- `utils/media.js` : constantes et fonctions utilitaires liées aux médias.
- `utils/security.js` : nettoyage et sécurisation basique des entrées utilisateur.
- `public/data/movies.json` : fausse API utilisée avec `fetch()` pour initialiser la collection.

---

## 4. Fonctionnalités implémentées

### Fonctionnalités obligatoires

- ✅ Liste des éléments affichée sous forme de cartes
- ✅ Affichage du titre, d’une information complémentaire et du statut
- ✅ Recherche par titre
- ✅ Filtre par statut
- ✅ Détail d’un élément via sélection
- ✅ Formulaire contrôlé avec `useState`
- ✅ Validation des champs obligatoires
- ✅ Affichage de messages d’erreur simples
- ✅ Changement de statut
- ✅ Gestion des favoris
- ✅ Suppression avec `confirm()`
- ✅ Chargement initial via `fetch('/data/movies.json')`
- ✅ Appel asynchrone dans `useEffect()`
- ✅ Gestion de l’état de chargement
- ✅ Gestion d’un message d’erreur si le chargement échoue

### Bonus

- ⭐ Persistance locale avec `localStorage`
- ⭐ Interface responsive
- ⭐ Thème dynamique selon le nombre de films LOTR en favoris
- ⭐ Import de films via **TMDB**
- ⭐ Protection visuelle et symbolique des films du Seigneur des Anneaux
- ⭐ Validation et nettoyage des champs texte pour limiter les entrées malveillantes
- ⭐ Statistiques en en-tête

### Sécurité

- ⚔️🔥J'ai fait mon possible pour que ce projet soit imperméable à de potentielles attaques.🔥⚔️

---

## 5. Ambiance LOTR intégrée au projet

Cette application contient plusieurs mécaniques volontairement humoristiques :

- les **3 films du Seigneur des Anneaux** occupent une place spéciale dans la collection ;
- le thème devient plus agressif si la trilogie n’est pas correctement honorée ;
- certains messages et commentaires du code font référence à la Terre du Milieu ;
- l’interface considère implicitement que **LOTR vaut 100/5 dans le coeur**.

Ce choix a été fait pour rendre le projet plus vivant, plus personnel, et plus mémorable, tout en respectant la structure demandée.

---

## 6. Limites connues / pistes d’amélioration

### Limites actuelles

- Les données restent locales et ne sont pas synchronisées avec une vraie base distante, tout tourne en local un F12 + localStorage.clear() et tout part.
- Il n’y a pas encore d’édition complète d’un média existant.
- La navigation repose surtout sur l’état local plutôt que sur un routeur.
- L’import TMDB dépend d’une variable d’environnement configurée manuellement.

### Améliorations possibles

- Permettre la modification d’un média existant.
- Ajouter un tri par note, année ou titre.
- Ajouter l’affichage d’affiches / posters pour les films importés.
- Ajouter une persistance côté backend.
- Mettre en place de vrais tests unitaires et d’intégration.

---

## 7. Déploiement

L’application peut être déployée facilement sur **Vercel** :

Voici le lien vers la page : https://rattrapage-js.vercel.app/

---

## 8. Conclusion

Ce projet répond à la consigne d’une mini-application React de gestion de médias, tout en ajoutant une identité visuelle et narrative forte.

En résumé :

- **React + Vite** ✅
- **Fonctionnalités demandées** ✅
- **fetch() + useEffect()** ✅
- **README structuré** ✅
- **Un profond respect de la trilogie LOTR** ✅

> **Même la Communauté de l’Anneau aurait validé ce rendu.**