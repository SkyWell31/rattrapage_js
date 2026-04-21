export function sanitizePlainText(value, maxLength = 200) {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .normalize('NFKC')
    .replace(/[\u0000-\u001F\u007F]/g, ' ') // les orcs invisibles dégagent
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function containsHtmlLikeInput(value) {
  if (typeof value !== 'string') {
    return false;
  }

  return /<|>|javascript:|data:text\/html|vbscript:|on\w+\s*=|<script|<iframe/i.test(value);
}
