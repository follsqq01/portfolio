import { env } from 'cloudflare:workers';
import seed from '../data/archive.json';
import type { ArchiveCategoryInfo, ArchiveItem } from './archive';

export interface ArchiveData {
  categories: ArchiveCategoryInfo[];
  items: ArchiveItem[];
  revision: number;
}
interface Bindings { DB: D1Database; BUCKET: R2Bucket; ADMIN_PASSWORD?: string }
export const archiveEnv = () => env as unknown as Bindings;
export class ArchiveError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export async function getArchiveDataServer(): Promise<ArchiveData> {
  const { DB } = archiveEnv();
  await DB.prepare('INSERT OR IGNORE INTO archive_state (id, payload, revision) VALUES (1, ?, 0)')
    .bind(JSON.stringify(seed)).run();
  const row = await DB.prepare('SELECT payload, revision FROM archive_state WHERE id = 1')
    .first<{ payload: string; revision: number }>();
  if (!row) throw new Error('Archive storage unavailable');
  return { ...JSON.parse(row.payload), revision: row.revision };
}
export async function saveArchiveData(data: ArchiveData, revision: number) {
  const result = await archiveEnv().DB.prepare('UPDATE archive_state SET payload = ?, revision = revision + 1 WHERE id = 1 AND revision = ?')
    .bind(JSON.stringify({ items: data.items, categories: data.categories }), revision).run();
  if (!result.meta.changes) throw new ArchiveError('Архив изменился в другой вкладке. Обновите страницу и повторите сохранение.', 409);
  return { ...data, revision: revision + 1 };
}
export function checkOrigin(req: Request) {
  const origin = req.headers.get('origin');
  if (!origin || origin !== new URL(req.url).origin) throw new ArchiveError('Недопустимый источник запроса.', 403);
}
const hex = (bytes: ArrayBuffer) => Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
export async function digest(value: string) { return hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))); }
async function signature(value: string) {
  const password = archiveEnv().ADMIN_PASSWORD;
  if (!password) throw new ArchiveError('Вход автора ещё не настроен.', 503);
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)));
}
function equal(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}
export async function isArchiveAuthor(req: Request) {
  const token = req.headers.get('cookie')?.split(';').map(s => s.trim()).find(s => s.startsWith('archive_session='))?.slice(16);
  if (!token || !archiveEnv().ADMIN_PASSWORD) return false;
  const [expiry, nonce, mac] = token.split('.');
  if (!expiry || !nonce || !mac || !/^\d+$/.test(expiry) || Number(expiry) < Date.now()) return false;
  return equal(mac, await signature(`${expiry}.${nonce}`));
}
export async function requireAuthor(req: Request) {
  checkOrigin(req);
  if (!await isArchiveAuthor(req)) throw new ArchiveError('Войдите в режим автора.', 401);
}
export async function createSession(password: string) {
  const expected = archiveEnv().ADMIN_PASSWORD;
  if (!expected) throw new ArchiveError('Вход автора ещё не настроен.', 503);
  if (!equal(await digest(password), await digest(expected))) throw new ArchiveError('Неверный пароль.', 401);
  const value = `${Date.now() + 7 * 86400000}.${crypto.randomUUID()}`;
  return `${value}.${await signature(value)}`;
}
export function archiveResponse(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}
export function archiveFailure(error: unknown) {
  if (error instanceof ArchiveError) return archiveResponse({ error: error.message }, error.status);
  console.error('[archive]', error);
  return archiveResponse({ error: 'Не удалось обратиться к архиву. Попробуйте ещё раз.' }, 503);
}
