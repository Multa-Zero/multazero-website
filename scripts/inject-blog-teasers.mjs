// Injeta os posts mais recentes do Sanity nos cards da home (dist/index.html).
// Roda no build (build-all.mjs), depois do Vite. Assim a home fica sempre em
// sincronia com /blog: publicar no Sanity -> webhook -> rebuild -> cards novos.
//
// Falha de rede ou 0 posts NÃO quebram o build: a home sai com o fallback
// "Em breve..." que já está no index.html entre os marcadores.
import { readFileSync, writeFileSync } from 'node:fs';

const PROJECT_ID = '57jbjtzh';
const DATASET = 'production';
const MAX_POSTS = 3;
const DIST_HTML = 'dist/index.html';
const START = '<!-- BLOG-TEASERS:START -->';
const END = '<!-- BLOG-TEASERS:END -->';

// Mesma fonte do blog (blog/src/lib/sanity.js), via API HTTP pública
const QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...${MAX_POSTS}]{
  "slug": slug.current, title, excerpt, "tag": category->title, "cover": coverImage.asset->url, body
}`;

function escapeHtml(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

// Espelha readingTime() do blog: palavras / 200
function readingTime(body = []) {
  const words = body
    .filter((b) => b._type === 'block' && Array.isArray(b.children))
    .map((b) => b.children.map((c) => c.text || '').join(''))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min de leitura`;
}

function cardHtml(p) {
  const cover = p.cover ? `${p.cover}?w=800&auto=format` : '/blog/sample-cover.jpg';
  return `        <a class="blog-teaser-card" href="/blog/post/${encodeURIComponent(p.slug)}">
          <div class="blog-teaser-card__cover" style="background-image: url('${cover}');"></div>
          <div class="blog-teaser-card__body">
            <span class="tag">${escapeHtml(p.tag || 'Conteúdo')}</span>
            <h3 class="heading-5 blog-teaser-card__title">${escapeHtml(p.title)}</h3>
            <p class="body-S text-secondary">${escapeHtml(p.excerpt || '')}</p>
            <span class="blog-teaser-card__meta">${readingTime(p.body)}</span>
          </div>
        </a>`;
}

let posts = [];
try {
  const url = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(QUERY)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  posts = (await res.json()).result ?? [];
} catch (err) {
  console.warn(`[blog-teasers] Sanity indisponível (${err.message}) — home sai com o fallback.`);
}

const html = readFileSync(DIST_HTML, 'utf8');
const startIdx = html.indexOf(START);
const endIdx = html.indexOf(END);
if (startIdx === -1 || endIdx === -1) {
  throw new Error(`[blog-teasers] marcadores ${START} / ${END} não encontrados em ${DIST_HTML}`);
}

if (posts.length > 0) {
  const cards = posts.map(cardHtml).join('\n\n');
  let out =
    html.slice(0, startIdx + START.length) + '\n' + cards + '\n        ' + html.slice(endIdx);

  // Com 1 ou 2 posts, centraliza os cards (ver .blog-teaser-grid--N no styles.css)
  if (posts.length < 3) {
    const gridClass = 'class="blog-teaser-grid reveal-up"';
    if (!out.includes(gridClass)) {
      console.warn('[blog-teasers] grid não encontrado para centralizar — layout padrão mantido.');
    } else {
      out = out.replace(gridClass, `class="blog-teaser-grid blog-teaser-grid--${posts.length} reveal-up"`);
    }
  }

  writeFileSync(DIST_HTML, out);
  console.log(`[blog-teasers] ${posts.length} post(s) do Sanity injetado(s) na home.`);
} else {
  console.warn('[blog-teasers] 0 posts — mantido o fallback "Em breve".');
}
