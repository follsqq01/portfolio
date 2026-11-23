import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

// Originals remain untouched. Pass the path to ffmpeg as the first argument.
const ffmpeg = process.argv[2];
if (!ffmpeg) throw new Error('Usage: node scripts/optimize-media.mjs /path/to/ffmpeg');
const root = 'public/media';
const out = `${root}/optimized`;
await fs.mkdir(out, { recursive: true });
const manifest = {};
const report = [];
async function walk(dir) {
  const files = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name === 'optimized') continue;
    const file = path.join(dir, entry.name);
    files.push(...(entry.isDirectory() ? await walk(file) : [file]));
  }
  return files;
}
async function exists(file) { return fs.access(file).then(() => true, () => false); }
for (const file of await walk(root)) {
  if (!/\.(webp|png|jpe?g|mp4)$/i.test(file)) continue;
  const data = await fs.readFile(file);
  const id = crypto.createHash('sha256').update(data).update('media-v1').digest('hex').slice(0, 16);
  const src = '/' + file.slice('public/'.length);
  if (!file.endsWith('.mp4')) {
    const meta = await sharp(data).metadata();
    const variants = [];
    for (const width of [320, 640, 960, 1600].filter(w => w < meta.width).concat(Math.min(meta.width, 1920))) {
      const name = `${id}-${width}.webp`;
      if (!await exists(`${out}/${name}`)) await sharp(data).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toFile(`${out}/${name}`);
      variants.push({ src: `/media/optimized/${name}`, width });
    }
    manifest[src] = { width: meta.width, height: meta.height, variants };
    continue;
  }
  let info = '';
  try { execFileSync(ffmpeg, ['-hide_banner', '-i', file], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch (e) { info = String(e.stderr); }
  const dimensions = info.match(/Video:.*? (\d{2,5})x(\d{2,5})/);
  if (!dimensions) throw new Error(`Cannot read dimensions: ${file}`);
  const width = Number(dimensions[1]), height = Number(dimensions[2]);
  const keepAudio = /aboutme-|preview_wallap-/.test(file);
  const variants = [];
  for (const target of [640, 1280]) {
    const name = `${id}-${target}.mp4`;
    const dest = `${out}/${name}`;
    if (!await exists(dest)) execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', file,
      '-vf', `scale=w='min(${target},iw)':h=-2`, '-c:v', 'libx264', '-preset', 'medium', '-crf', target === 640 ? '26' : '24',
      '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
      ...(keepAudio ? ['-c:a', 'aac', '-b:a', '96k'] : ['-an']), dest], { stdio: 'inherit' });
    variants.push({ src: (await fs.stat(dest)).size < data.length ? `/media/optimized/${name}` : src, width: Math.min(target, width) });
  }
  const poster = `${id}-poster.webp`;
  if (!await exists(`${out}/${poster}`)) execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', file, '-frames:v', '1', '-vf', "scale=w='min(960,iw)':h=-2", '-c:v', 'libwebp', '-quality', '75', `${out}/${poster}`], { stdio: 'inherit' });
  manifest[src] = { width, height, variants, poster: `/media/optimized/${poster}` };
  const optimized = await fs.stat('public' + variants[1].src);
  report.push({ src, original: data.length, optimized: optimized.size });
  console.log(`${src}: ${(data.length / 1048576).toFixed(2)} → ${(optimized.size / 1048576).toFixed(2)} MB`);
}
await fs.writeFile('media-optimization-report.json', JSON.stringify(report, null, 2));
await fs.writeFile('lib/media-manifest.json', JSON.stringify(manifest));
