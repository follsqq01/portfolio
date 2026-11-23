import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

// Publish only generated public pages and browser assets, never server bindings.
execFileSync('node', ['node_modules/vinext/dist/cli.js', 'build', '--prerender-all'], { stdio: 'inherit' });
const output = '.vercel/output';
await rm(output, { recursive: true, force: true });
await mkdir(`${output}/static`, { recursive: true });
await cp('dist/client', `${output}/static`, { recursive: true });
await cp('dist/server/prerendered-routes', `${output}/static`, { recursive: true });
await rm(`${output}/static/_headers`, { force: true });
await rm(`${output}/static/vinext-client-entry-manifest.json`, { force: true });

const routes = [
  { src: '/_next/static/(.*)', headers: { 'Cache-Control': 'public, max-age=31536000, immutable' }, continue: true },
  { src: '/(media|fonts|audio)/(.*)', headers: { 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' }, continue: true },
  { src: '/projects/?', headers: { Location: '/#projects' }, status: 308 },
  { src: '/', dest: '/index.html' },
  { src: '/about/?', dest: '/about.html' },
];
const projectPages = (await readdir(`${output}/static/projects`)).filter(file => file.endsWith('.html'));
if (projectPages.length === 0) throw new Error('No project pages were generated');
for (const page of projectPages) {
  const slug = page.slice(0, -5);
  routes.push({ src: `/projects/${slug}/?`, dest: `/projects/${page}` });
}
routes.push({ handle: 'filesystem' }, { src: '/(.*)', dest: '/404.html', status: 404 });
await writeFile(join(output, 'config.json'), JSON.stringify({ version: 3, routes }, null, 2));
console.log(`Vercel output ready: Home, About, ${projectPages.length} projects, and a 404 page.`);
