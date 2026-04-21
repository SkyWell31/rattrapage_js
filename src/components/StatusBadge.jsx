function StatusBadge({ status }) {
  const statusClass = status === 'Vu' ? 'status-badge--done' : 'status-badge--todo';
  /*
  Note ici pour moi même et pour toujours : 
  Toujours mettre en if else, sinon on peut se prendre une injection par là
  Et même l'Unique ne tentera pas de faire du code injection dans le status.

  Par exemple, si jamais on injectait <a href="../.env">.env</a> dans le status
  là chui cooked, mais avec un if/else, ça ne passera pas et
  on affichera juste le texte tel quel, sans interpréter les balises HTML.
  Hop hop hop trop de reveal de manières d'attaque, on va pas aider les hackers quand même.
  J'te dirai pas comment on injecte du code, c'est mort. 
  */

  return <span className={`status-badge ${statusClass}`}>{status}</span>;
}

export default StatusBadge;
