import { archiveEnv, archiveResponse, archiveFailure, ArchiveError, getArchiveDataServer, saveArchiveData, requireAuthor } from '../../../lib/archive-server';
import type { ArchiveItem } from '../../../lib/archive';
export const dynamic = 'force-dynamic';

export async function GET() {
  try { return archiveResponse(await getArchiveDataServer()); } catch (e) { return archiveFailure(e); }
}
function field(body: Record<string, unknown>, name: string, max = 200): string {
  const value = body[name];
  if (value == null) return '';
  if (typeof value !== 'string' || value.length > max) throw new ArchiveError(`Некорректное поле: ${name}`);
  return value.trim();
}
async function upload(image: string) {
  const match = image.match(/^data:image\/(png|jpeg|webp|gif);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new ArchiveError('Выберите изображение PNG, JPG, WEBP или GIF.');
  const bytes = Uint8Array.from(atob(match[2]), c => c.charCodeAt(0));
  if (!bytes.length || bytes.length > 8 * 1024 * 1024) throw new ArchiveError('Изображение должно быть меньше 8 МБ.', 413);
  const head = Array.from(bytes.slice(0, 12)).map(x => String.fromCharCode(x)).join('');
  const valid = match[1] === 'png' ? bytes[0] === 137 && head.slice(1, 4) === 'PNG'
    : match[1] === 'jpeg' ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
    : match[1] === 'gif' ? /^GIF8[79]a/.test(head)
    : head.startsWith('RIFF') && head.slice(8, 12) === 'WEBP';
  if (!valid) throw new ArchiveError('Файл не соответствует формату изображения.');
  const key = `${crypto.randomUUID()}.${match[1] === 'jpeg' ? 'jpg' : match[1]}`;
  await archiveEnv().BUCKET.put(`archive/${key}`, bytes, { httpMetadata: { contentType: `image/${match[1]}` } });
  return { key, url: `/api/archive/media/${key}` };
}
async function mutate(req: Request, method: 'POST' | 'PATCH' | 'DELETE') {
  let uploaded: string | undefined;
  try {
    await requireAuthor(req);
    if (Number(req.headers.get('content-length')) > 12 * 1024 * 1024) throw new ArchiveError('Файл слишком большой.', 413);
    const text = await req.text();
    if (text.length > 12 * 1024 * 1024) throw new ArchiveError('Файл слишком большой.', 413);
    let body: Record<string, unknown>;
    try { body = JSON.parse(text); } catch { throw new ArchiveError('Некорректный запрос.'); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new ArchiveError('Некорректный запрос.');
    const data = await getArchiveDataServer();
    if (!Number.isInteger(body.revision) || body.revision !== data.revision) throw new ArchiveError('Архив изменился в другой вкладке. Закройте форму, дождитесь обновления и повторите.', 409);
    const id = field(body, 'id');
    const existing = data.items.find(item => item.id === id);
    if (method !== 'POST' && !existing) throw new ArchiveError('Карточка уже удалена.', 404);
    if (method === 'DELETE') {
      data.items = data.items.filter(item => item.id !== id);
    } else {
      const titleRu = field(body, 'titleRu') || field(body, 'titleEn') || 'Новый объект';
      const titleEn = field(body, 'titleEn') || titleRu;
      const categoryId = field(body, 'categoryId', 80) || 'objects';
      if (!/^[a-z0-9-]+$/.test(categoryId) || categoryId === 'all') throw new ArchiveError('Выберите категорию.');
      let category = data.categories.find(c => c.id === categoryId);
      if (!category) {
        const ru = field(body, 'categoryRu') || categoryId;
        category = { id: categoryId, ru, en: field(body, 'categoryEn') || ru };
        data.categories.push(category);
      }
      let image = existing?.image || '';
      if (body.image) {
        if (typeof body.image !== 'string') throw new ArchiveError('Некорректное изображение.');
        const result = await upload(body.image);
        uploaded = result.key;
        image = result.url;
      }
      if (!image) throw new ArchiveError('Добавьте изображение.');
      const item: ArchiveItem = {
        id: existing?.id || crypto.randomUUID(), image, categoryId,
        title: { ru: titleRu, en: titleEn }, category: { ru: category.ru, en: category.en },
        note: { ru: field(body, 'noteRu', 5000), en: field(body, 'noteEn', 5000) || field(body, 'noteRu', 5000) },
        background: existing?.background || '#f4f4f2',
      };
      if (method === 'POST') data.items.unshift(item);
      else data.items = data.items.map(old => old.id === id ? item : old);
    }
    const saved = await saveArchiveData(data, body.revision as number);
    uploaded = undefined;
    return archiveResponse(saved);
  } catch (e) {
    if (uploaded) await archiveEnv().BUCKET.delete(`archive/${uploaded}`).catch(console.error);
    return archiveFailure(e);
  }
}
export const POST = (req: Request) => mutate(req, 'POST');
export const PATCH = (req: Request) => mutate(req, 'PATCH');
export const DELETE = (req: Request) => mutate(req, 'DELETE');
