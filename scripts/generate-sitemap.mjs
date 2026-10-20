// Gera dist/sitemap.xml com todas as páginas que saíram no build (site + blog).
// Roda no fim do build-all.mjs, depois que o blog já foi copiado para dist/blog/,
// então posts novos do Sanity entram sozinhos a cada rebuild.
//
// Ficam de fora: o Sanity Studio e páginas com <meta name="robots" content="noindex">
// (ex.: o redirect legado /sobre/).
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const SITE = 'https://multazero.co';
const DIST = 'dist';
const SKIP = ['blog/studio'];

function* indexPages(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* indexPages(p);
    else if (name === 'index.html') yield p;
  }
}

const urls = [];
for (const file of indexPages(DIST)) {
  // dist/blog/post/x/index.html -> 'blog/post/x'
  const dir = relative(DIST, file).split(sep).slice(0, -1).join('/');
  if (SKIP.some((s) => dir === s || dir.startsWith(`${s}/`))) continue;
  if (/<meta[^>]+name="robots"[^>]+noindex/i.test(readFileSync(file, 'utf8'))) continue;
  // Com barra no fim: é a URL final que o CloudFront entrega (sem ela há um 301)
  urls.push(`${SITE}/${dir ? `${dir}/` : ''}`);
}
urls.sort();

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`;

writeFileSync(join(DIST, 'sitemap.xml'), xml);
console.log(`[sitemap] ${urls.length} URLs em dist/sitemap.xml`);
