import { archiveEnv, archiveFailure } from '../../../../../lib/archive-server';
export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  try {
    const { key } = await params;
    if (!/^[a-f0-9-]+\.(png|jpg|webp|gif)$/.test(key)) return new Response('Not found', { status: 404 });
    const object = await archiveEnv().BUCKET.get(`archive/${key}`);
    if (!object) return new Response('Not found', { status: 404 });
    return new Response(object.body, { headers: {
      'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    } });
  } catch (e) { return archiveFailure(e); }
}
