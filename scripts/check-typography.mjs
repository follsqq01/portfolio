import assert from 'node:assert/strict';
import { typography } from '../lib/typography.ts';
const cases = [
  ['Я в Москве и на работе', 'Я\u00a0в\u00a0Москве и\u00a0на\u00a0работе'],
  ['Дизайн для людей, а не ради наград', 'Дизайн для\u00a0людей, а\u00a0не\u00a0ради\u00a0наград'],
  ['Письмо из-за границы', 'Письмо из-за\u00a0границы'],
  ['«Я здесь» и «мы рядом»', '«Я\u00a0здесь» и\u00a0«мы\u00a0рядом»'],
  ['It is an example of my work', 'It\u00a0is\u00a0an\u00a0example of\u00a0my\u00a0work'],
  ['Да, это я. А — буква', 'Да, это я. А — буква'],
  ['Одна строка и\nдругая строка', 'Одна строка и\nдругая строка'],
  ['https://t.me/me me@example.com 12 / 03', 'https://t.me/me me@example.com 12 / 03'],
  ['Дизайн на', 'Дизайн на'],
  ['и  работа', 'и\u00a0работа'],
  ['в\u00a0Москве', 'в\u00a0Москве'],
];
for (const [input, expected] of cases) {
  assert.equal(typography(input), expected);
  assert.equal(typography(expected), expected, 'Formatting must be idempotent');
}
console.log(`PASS: ${cases.length} typography cases and idempotence, including RU/EN, punctuation, URLs and explicit newlines.`);
