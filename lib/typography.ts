/** Display-only typography. Stored text, form values, URLs and explicit newlines stay intact. */
const prepositions = new Set([
  'без', 'безо', 'близ', 'в', 'во', 'вне', 'внутри', 'вокруг', 'возле',
  'вместо', 'вдоль', 'для', 'до', 'за', 'из', 'изо', 'из-за', 'из-под',
  'к', 'ко', 'кроме', 'меж', 'между', 'на', 'над', 'надо', 'о', 'об', 'обо',
  'около', 'от', 'ото', 'перед', 'передо', 'по', 'под', 'подо', 'после',
  'при', 'про', 'ради', 'с', 'со', 'среди', 'у', 'через',
]);
const letters = /^[A-Za-zА-Яа-яЁё]{1,2}$/;
const word = /^[«„“"'([{]*([A-Za-zА-Яа-яЁё]+(?:-[A-Za-zА-Яа-яЁё]+)?)$/;
const nextWord = /^[«„“"'([{]*[A-Za-zА-Яа-яЁё0-9]/;

export function typography(text: string): string {
  // Match complete tokens so email addresses, links and punctuation are never rewritten.
  return text.replace(/([^\s]+)([ \t]+)(?=\S)/g, (match, token: string, _space: string, offset: number) => {
    const value = token.match(word)?.[1];
    if (!value || (!letters.test(value) && !prepositions.has(value.toLowerCase()))) return match;
    const next = text.slice(offset + match.length);
    if (!nextWord.test(next)) return match;
    return `${token}\u00a0`;
  });
}
