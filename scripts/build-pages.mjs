import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, readdir, rename, rm, rmdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const output = 'dist/pages';
const basePath = process.env.PAGES_BASE_PATH ?? '/portfolio';
if (basePath && (!/^\/[\w.-]+(?:\/[\w.-]+)*$/.test(basePath) || /(?:^|\/)\.{1,2}(?:\/|$)/.test(basePath))) {
  throw new Error(`Invalid GitHub Pages base path: ${basePath}`);
}

execFileSync(process.execPath, ['node_modules/vinext/dist/cli.js', 'build', '--prerender-all'], {
  env: { ...process.env, PORTFOLIO_BUILD_ASSET_PREFIX: basePath },
  stdio: 'inherit',
});
await rm(output, { recursive: true, force: true });
await cp('dist/client', output, { recursive: true });
await cp('dist/server/prerendered-routes', output, { recursive: true });
await rm(join(output, '_headers'), { force: true });
await rm(join(output, 'vinext-client-entry-manifest.json'), { force: true });

// Vinext emits prefixed assets under the base path. Pages mounts the whole artifact there.
if (basePath) {
  const prefixDirectory = join(output, basePath.slice(1));
  await rename(join(prefixDirectory, '_next'), join(output, '_next'));
  if ((await readdir(prefixDirectory)).length === 0) await rmdir(prefixDirectory);
}

// Pages serves directory indexes in place of the extensionless Vercel routes.
const about = join(output, 'about');
await mkdir(about);
await rename(join(output, 'about.html'), join(about, 'index.html'));

const projects = join(output, 'projects');
for (const file of await readdir(projects)) {
  if (extname(file) !== '.html') continue;
  const route = join(projects, file.slice(0, -5));
  await mkdir(route);
  await rename(join(projects, file), join(route, 'index.html'));
}

// Public URLs occur in HTML, embedded React payloads, browser code and CSS.
// Preserve the router's internal route patterns and all external URLs.
const assetPath = /(["'`(\s])\/(?=(?:media|fonts|audio)\/|favicon\.svg\b)/g;
const pageLink = /(\bhref(?:\\?["'])?\s*[=:]\s*(?:\\?["']|`))\/(?=about\b|projects\b|#projects\b|\\?["'`])/g;
const textExtensions = new Set(['.html', '.css', '.js', '.rsc']);
for (const entry of await readdir(output, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile() || !basePath || !textExtensions.has(extname(entry.name))) continue;
  const path = join(entry.parentPath, entry.name);
  const content = await readFile(path, 'utf8');
  const rewritten = content
    .replace(assetPath, `$1${basePath}/`)
    .replace(pageLink, `$1${basePath}/`);
  if (rewritten !== content) await writeFile(path, rewritten);
}

await writeFile(join(projects, 'index.html'),
  `<!doctype html><meta charset="utf-8"><title>Projects</title><meta http-equiv="refresh" content="0;url=${basePath}/#projects"><a href="${basePath}/#projects">Projects</a>\n`);

console.log(`GitHub Pages output ready in ${output} for ${basePath || '/'}.`);
