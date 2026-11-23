import { archiveEnv, archiveResponse, archiveFailure, ArchiveError, checkOrigin, createSession, digest, isArchiveAuthor } from '../../../../lib/archive-server';
export const dynamic = 'force-dynamic';
function cookie(req: Request, value: string, age: number) {
  return `archive_session=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${age}${new URL(req.url).protocol === 'https:' ? '; Secure' : ''}`;
}
export async function GET(req: Request) {
  try { return archiveResponse({ isAdmin: await isArchiveAuthor(req) }); } catch (e) { return archiveFailure(e); }
}
export async function POST(req: Request) {
  try {
    checkOrigin(req);
    if (Number(req.headers.get('content-length')) > 2048) throw new ArchiveError('Слишком длинный запрос.', 413);
    const body = await req.json() as { password?: unknown } | null;
    const password = body?.password;
    if (typeof password !== 'string' || password.length > 256) throw new ArchiveError('Введите пароль.');
    const { DB } = archiveEnv();
    const key = await digest(req.headers.get('cf-connecting-ip') || 'local');
    const now = Date.now();
    await DB.prepare('DELETE FROM archive_login_attempts WHERE expires < ?').bind(now).run();
    await DB.prepare('INSERT INTO archive_login_attempts (key, attempts, expires) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET attempts = attempts + 1').bind(key, now + 900000).run();
    const limit = await DB.prepare('SELECT attempts FROM archive_login_attempts WHERE key = ?').bind(key).first<{ attempts: number }>();
    if (limit && limit.attempts > 10) throw new ArchiveError('Слишком много попыток. Попробуйте через 15 минут.', 429);
    const token = await createSession(password);
    await DB.prepare('DELETE FROM archive_login_attempts WHERE key = ?').bind(key).run();
    return archiveResponse({ isAdmin: true }, 200, { 'Set-Cookie': cookie(req, token, 604800) });
  } catch (e) { return archiveFailure(e); }
}
export async function DELETE(req: Request) {
  try { checkOrigin(req); return archiveResponse({ isAdmin: false }, 200, { 'Set-Cookie': cookie(req, '', 0) }); }
  catch (e) { return archiveFailure(e); }
}
