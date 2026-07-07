# Blog MultaZero — Guia completo do desenvolvedor

Tudo o que o dev precisa saber para **rodar, alterar, publicar e manter** o blog em `https://multazero.co/blog`: arquitetura, mapa de arquivos, fluxo de conteúdo, receitas de alteração e deploy.

> Complementa o [DEPLOY-BLOG.md](./DEPLOY-BLOG.md), que cobre a **configuração da infra** (secrets AWS, token GitHub, webhook Sanity). Este guia cobre o **dia a dia do dev**.

---

## 1. Arquitetura em 1 minuto

O blog é um **site estático (SSG)** gerado pelo **Astro**, com conteúdo vindo do **Sanity** (CMS headless). O Sanity Studio (painel de edição) roda **embutido no próprio site**, em `/blog/studio`.

```
┌─────────────────────────────────────────────────────────────────┐
│  multazero.co            (S3 + CloudFront)                      │
│                                                                 │
│  /            → site institucional (Vite, raiz do repo)         │
│  /blog        → lista de posts       (Astro, pasta blog/)       │
│  /blog/post/<slug> → página do post  (Astro, gerada no build)   │
│  /blog/studio → Sanity Studio        (painel de edição, React)  │
└─────────────────────────────────────────────────────────────────┘

Conteúdo:   Sanity (projectId 57jbjtzh, dataset production)
            └─ lido UMA VEZ, durante o build (GROQ query)

Publicação: Studio "Publish" → webhook Sanity → GitHub repository_dispatch
            → GitHub Actions roda `npm run build` → S3 sync → CloudFront
            → post no ar em ~1–2 min
```

**Consequência importante:** como o conteúdo é lido **no build**, publicar/editar um post **não aparece sozinho** — precisa de um rebuild. O webhook (já configurado, ver DEPLOY-BLOG.md) faz isso automaticamente ao clicar **Publish** no Studio.

### Stack

| Camada | Tecnologia | Onde |
|---|---|---|
| Gerador do blog | Astro 6 (output estático) | `blog/` |
| CMS | Sanity 5 (headless) | projeto `57jbjtzh`, dataset `production` |
| Studio | `@sanity/astro` (embutido) + React 19 | montado em `/blog/studio` |
| Conteúdo rico | Portable Text → HTML (`@portabletext/to-html`) | `blog/src/lib/sanity.js` |
| Imagens | Sanity CDN (`@sanity/image-url`) | idem |
| Site raiz | Vite (HTML/CSS/JS puro) | raiz do repo |
| Deploy | GitHub Actions → S3 + CloudFront | `.github/workflows/deploy.yml` |

---

## 2. Mapa de arquivos — o que mexer para cada coisa

### `blog/` (projeto Astro — o blog em si)

| Arquivo | O que é | Mexa quando quiser… |
|---|---|---|
| `blog/astro.config.mjs` | Config do Astro: `site`, `base: '/blog'`, integração Sanity (`projectId`, `dataset`, `studioBasePath: '/studio'`) | trocar projeto/dataset da Sanity, mudar a base do blog |
| `blog/sanity.config.ts` | Config do **Studio** (plugins, schema, `basePath: '/blog/studio'`) | adicionar plugin do Studio, mudar título do painel |
| `blog/sanity.cli.ts` | Config do CLI da Sanity (`npx sanity …` dentro de `blog/`) | quase nunca |
| `blog/sanity/schemaTypes/post.ts` | **Schema do Post** (título, slug, resumo, categoria, autor, capa, data, corpo) | adicionar/remover campo do post |
| `blog/sanity/schemaTypes/author.ts` | Schema do Autor (nome, foto, bio) | mudar campos de autor |
| `blog/sanity/schemaTypes/category.ts` | Schema da Categoria (título, slug) | mudar campos de categoria |
| `blog/sanity/schemaTypes/index.ts` | Registra os schemas no Studio | criar um **novo** tipo de documento |
| `blog/src/lib/sanity.js` | **Coração dos dados**: client, query GROQ (`POSTS_QUERY`), `normalize()` (formata post p/ os templates), Portable Text → HTML, tempo de leitura, fallback de dev | expor um campo novo nos templates, mudar formatação de data/imagem/corpo |
| `blog/src/pages/index.astro` | Página **lista de posts** (`/blog`) — hero + grid de cards + empty state | mudar layout/copy da home do blog |
| `blog/src/pages/post/[slug].astro` | Página **do post** (`/blog/post/<slug>`) — byline, capa, corpo, share, comentários (placeholder) | mudar layout do post |
| `blog/src/layouts/Base.astro` | **Layout comum**: `<head>` (SEO/meta), navbar do blog, footer | mudar nav/footer/meta tags do blog |
| `blog/src/styles/blog.css` | Estilos do blog (cards, post, nav, footer) | qualquer ajuste visual do blog |
| `blog/src/styles/multazero.css` | Design tokens da marca (cores, fontes) usados pelo blog | mudar identidade visual |
| `blog/src/data/posts.js` | Posts **de exemplo** — usados **só em dev** quando a Sanity está vazia/inacessível (nunca em produção) | mudar os dados fake de desenvolvimento |
| `blog/public/` | Estáticos do blog (fontes Aileron, logos, favicon, `sample-cover.jpg`) — copiados p/ `/blog/…` | adicionar imagem/fonte estática do blog |

### Raiz do repo (site + build + deploy)

| Arquivo | O que é | Mexa quando quiser… |
|---|---|---|
| `scripts/build-all.mjs` | **Build combinado**: builda o site Vite → `dist/`, builda o Astro → `blog/dist/`, copia para `dist/blog/` | mudar como os dois builds se combinam |
| `.github/workflows/deploy.yml` | CI: roda em push na `main` **e** no `repository_dispatch: sanity-publish` (webhook); build + `aws s3 sync` + invalidation | mudar pipeline de deploy |
| `scripts/deploy-s3.sh` | Deploy **manual** sem CI (`S3_BUCKET=… CF_DISTRIBUTION_ID=… ./scripts/deploy-s3.sh`) | deploy de emergência |
| `infra/cloudfront-subdir-index.js` | CloudFront Function que resolve `/blog/`, `/blog/post/x`, `/blog/studio` → `index.html` correto | nunca (só se a infra mudar) |
| `index.html` (≈ linha 780, seção `#blog`) | **Teaser "Direto do nosso blog"** na landing — cards com links **hardcoded** para posts | ⚠️ novo post importante? Atualize os cards **manualmente** aqui |

---

## 3. Rodar localmente

São **dois projetos com `node_modules` separados**. Instale os dois na primeira vez:

```bash
# na raiz do repo
npm install          # deps do site (Vite)
cd blog
npm install          # deps do blog (Astro/Sanity — ~900 pacotes, demora)
```

### 3a. Desenvolver o BLOG (o caso comum)

```bash
cd blog
npm run dev
# → http://localhost:4321/blog          (lista)
# → http://localhost:4321/blog/post/... (post)
# → http://localhost:4321/blog/studio   (Studio — pede login Sanity)
```

- Hot reload em `.astro`, `.css`, schemas etc.
- **Se a Sanity estiver vazia ou fora do ar**, em dev o blog mostra os posts de exemplo de `src/data/posts.js` (em produção mostraria o empty state "Em breve…" — nunca conteúdo fake).
- Conteúdo real: o dev local busca da mesma Sanity de produção. Publicou algo no Studio? Recarregue a página (o fetch acontece a cada render em dev).

### 3b. Desenvolver o SITE raiz

```bash
# na raiz
npm run dev
# → http://localhost:5173/
```

⚠️ O dev server do Vite **não serve o blog** — `/blog` só existe no build combinado ou no dev do Astro (3a). Para testar o conjunto:

```bash
npm run build        # gera dist/ com site + dist/blog/
npm run preview      # serve o dist/ completo
```

### 3c. Testar o resultado final (como produção)

```bash
npm run build && npm run preview
# → http://localhost:4173/       (site)
# → http://localhost:4173/blog   (blog buildado, com conteúdo REAL da Sanity)
```

---

## 4. Fluxo de conteúdo — como um post nasce

### Passo a passo no Studio (`multazero.co/blog/studio`)

1. **Login** com conta Sanity que seja membro do projeto `57jbjtzh` (convites em [sanity.io/manage](https://www.sanity.io/manage) → projeto → Members).
2. Primeira vez? Crie primeiro os documentos de apoio:
   - **Autor** → nome (obrigatório), foto, bio.
   - **Categoria** → título (obrigatório), slug.
3. **Post** → preencha:
   | Campo | Obrigatório | Observação |
   |---|---|---|
   | Título | ✅ | vira o `<h1>` e o `<title>` |
   | Slug (URL) | ✅ | clique **Generate** (deriva do título) — vira `/blog/post/<slug>`. **Não mude depois de publicado** (quebra links) |
   | Resumo | — | aparece no card da lista e como subtítulo/meta description do post |
   | Categoria | — | referencia uma Categoria (vira a "tag pill"; sem ela mostra "Conteúdo") |
   | Autor | — | referencia um Autor (sem ele mostra "Equipe MultaZero") |
   | Imagem de destaque | — | capa; cortada em 1280×720 via CDN da Sanity (sem ela usa `sample-cover.jpg`) |
   | Publicado em | — | preenchida automaticamente; define a **ordem** na lista (mais recente primeiro) |
   | Conteúdo | — | texto rico (headings, bold, listas, links) + imagens inline |
4. Clique **Publish** (não basta salvar — rascunho não dispara nada).
5. O webhook dispara o GitHub Actions → **~1–2 min** depois o post está em `multazero.co/blog`. Acompanhe em GitHub → Actions → run "repository_dispatch".

### O caminho técnico do dado (para debugar)

```
Studio publica → documento no dataset `production`
                          │
build (npm run build) ────┤
                          ▼
blog/src/lib/sanity.js :: POSTS_QUERY (GROQ)
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)
  { slug, title, excerpt, tag: category->title, coverImage,
    authorName: author->name, publishedAt, body }
                          │ normalize()  (cover URL, data pt-BR,
                          │  iniciais do autor, tempo de leitura,
                          ▼  Portable Text → HTML)
pages/index.astro (cards)   e   pages/post/[slug].astro (getStaticPaths)
                          │
                          ▼
blog/dist/  →  dist/blog/  →  S3  →  CloudFront
```

Para inspecionar o dataset direto: Studio → ícone **Vision** (plugin instalado) → rode a `POSTS_QUERY` e veja o JSON cru.

---

## 5. Receitas — alterações comuns e exatamente onde mexer

### 5.1 Adicionar um campo ao post (ex.: `seoTitle`)

Quatro arquivos, nesta ordem:

1. **Schema** — `blog/sanity/schemaTypes/post.ts`: adicione o `defineField({ name: 'seoTitle', title: 'Título SEO', type: 'string' })` no array `fields`. O Studio embutido é buildado junto com o site, então a mudança aparece no Studio **após o próximo deploy** (em dev, aparece na hora em `localhost:4321/blog/studio`).
2. **Query** — `blog/src/lib/sanity.js`, `POSTS_QUERY`: adicione `seoTitle,` na projeção.
3. **Normalize** — mesmo arquivo, função `normalize()`: adicione `seoTitle: d.seoTitle || d.title,`.
4. **Template** — use `{post.seoTitle}` em `blog/src/pages/post/[slug].astro` (ex.: no `<Base title=…>`).

> Preencha o campo nos posts existentes no Studio e **republique-os** para o dado existir.

### 5.2 Mudar o layout da lista ou do post

- Lista (`/blog`): `blog/src/pages/index.astro` — hero (`.list-hero`), grid (`.post-grid`), card (`.post-card`).
- Post: `blog/src/pages/post/[slug].astro` — byline, capa (`.post__cover`), corpo (`.post__body`, HTML vindo do Portable Text), botão compartilhar, placeholder de comentários.
- Estilos dos dois: `blog/src/styles/blog.css`. Tokens de marca (cores/fontes): `blog/src/styles/multazero.css`.

### 5.3 Mudar navbar / footer / meta tags do blog

Tudo em `blog/src/layouts/Base.astro`. Os links da nav apontam para âncoras do site raiz (`https://multazero.co/#diferenciais` etc.) — se as seções da landing mudarem de id, atualize aqui também.

### 5.4 Criar uma página avulsa no blog (ex.: `/blog/sobre`)

Crie `blog/src/pages/sobre.astro` usando o layout:

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Sobre · Blog MultaZero" description="…">
  <section class="blog-container">…</section>
</Base>
```

A rota vira `/blog/sobre` automaticamente (file-based routing + `base: '/blog'`).

### 5.5 Linkar assets internos do blog (⚠️ pegadinha do `base`)

O blog vive sob `/blog`, então **nunca** escreva `href="/post/x"` ou `src="/images/x.png"` — isso apontaria para a raiz do site. Use sempre:

```astro
const base = import.meta.env.BASE_URL; // '/blog/' (com barra no final)
<a href={`${base}post/${slug}`}>          <!-- ✅ /blog/post/slug -->
<img src={`${base}images/logo.png`} />    <!-- ✅ /blog/images/logo.png -->
```

### 5.6 Atualizar o teaser do blog na landing

Os 3 cards de "Direto do nosso blog" na landing são **estáticos**, em `index.html` (seção `id="blog"`, ≈ linha 780). Publicou um post que merece destaque? Edite os cards manualmente (link `/blog/post/<slug>`, título, resumo) e faça deploy do site.

### 5.7 Renomear o slug de um post publicado

Evite. Se precisar: mude o slug no Studio, republique, e lembre que a URL antiga vira 404 (não há sistema de redirects hoje — se necessário, adicione redirect na CloudFront Function em `infra/cloudfront-subdir-index.js`).

### 5.8 Habilitar comentários

O placeholder está em `blog/src/pages/post/[slug].astro` (seção `.comments`). A sugestão deixada no código é o [Cusdis](https://cusdis.com) (leve, open-source): criar conta → obter `data-app-id` → substituir o placeholder pelo embed deles.

---

## 6. Build & deploy

### O que o `npm run build` (raiz) faz — `scripts/build-all.mjs`

1. `npm run build:site` → Vite builda o site institucional em `dist/` (limpa antes).
2. Se `blog/node_modules` não existe (CI limpo), roda `npm ci` dentro de `blog/`.
3. `npm run build` dentro de `blog/` → Astro gera `blog/dist/` (busca posts na Sanity **neste momento**).
4. Copia `blog/dist/` → `dist/blog/`.

Resultado: um único `dist/` com site + blog + studio, pronto para o S3.

### Quando o deploy acontece (`.github/workflows/deploy.yml`)

| Gatilho | Quando |
|---|---|
| `push` na `main` | mudança de código |
| `repository_dispatch: sanity-publish` | **Publish no Studio** (via webhook Sanity) |
| `workflow_dispatch` | manual, na aba Actions do GitHub |

O workflow tem `concurrency` (um deploy por vez, cancela o anterior em andamento) e cache do `blog/node_modules`.

### Forçar um rebuild sem mudar código

GitHub → Actions → "Deploy site + blog (S3/CloudFront)" → **Run workflow**. Útil se o webhook falhou ou para "puxar" conteúdo recém-publicado.

### Deploy manual (sem CI)

```bash
export S3_BUCKET=…  CF_DISTRIBUTION_ID=…
./scripts/deploy-s3.sh   # build + s3 sync --delete + invalidation
```

---

## 7. Configuração do projeto Sanity (referência)

| Item | Valor |
|---|---|
| Project ID | `57jbjtzh` |
| Dataset | `production` — precisa estar **público** (manage → API → Datasets), pois o build lê sem token |
| Studio | embutido no site (`/blog/studio`) — **não** usa `sanity deploy` |
| CORS | manage → API → CORS origins deve incluir `https://multazero.co` (e `http://localhost:4321` para dev) — sem isso o Studio não autentica |
| Membros | manage → Members — quem pode logar no Studio e publicar |
| Webhook | manage → API → Webhooks — dispara o rebuild (setup completo no [DEPLOY-BLOG.md](./DEPLOY-BLOG.md)) |

Mudanças de **schema** (seção 5.1) não precisam de nada na Sanity — o schema vive no repo e é buildado junto com o Studio embutido.

---

## 8. Troubleshooting

| Sintoma | Causa / correção |
|---|---|
| Publiquei no Studio e não apareceu no site | O rebuild rodou? GitHub → Actions. Não rodou → webhook (ver DEPLOY-BLOG.md, Passo 3/4). Rodou → cache do browser: `Ctrl+Shift+R` |
| Post não aparece nem depois do rebuild | Foi **Publish** ou só rascunho? Slug definido? (query exige `defined(slug.current)`). Dataset público? |
| Blog local mostra posts "fake" | Normal em dev quando a Sanity está vazia/inacessível (`src/data/posts.js`). Em produção nunca acontece |
| `/blog` funciona mas `/blog/post/x` dá 404 no navegador em produção | CloudFront Function ausente/alterada (`infra/cloudfront-subdir-index.js`) |
| Studio em produção não abre / erro de CORS | Adicionar `https://multazero.co` nos CORS origins do projeto Sanity |
| Studio local não mostra campo novo do schema | Reinicie o `npm run dev` do blog; em produção só após deploy |
| Build falha com erro de fetch da Sanity | O build **não** falha por isso — loga warning e segue com 0 posts. Se o `/blog` de produção ficou vazio, foi isso: cheque o log do Actions por `[sanity] fetch falhou` |
| Links do blog apontando para o site raiz (sem `/blog`) | Esqueceu o `import.meta.env.BASE_URL` (seção 5.5) |
| Imagens do post não carregam | Imagens do corpo/capa vêm do CDN `cdn.sanity.io` — cheque se o asset existe no Studio (Vision → query no documento) |

---

## 9. Checklists rápidos

**Novo dev entrando no projeto:**
- [ ] `npm install` na raiz **e** em `blog/`
- [ ] Conta Sanity convidada como membro do projeto `57jbjtzh`
- [ ] `cd blog && npm run dev` → abre `localhost:4321/blog` e `…/blog/studio` (login ok?)
- [ ] Ler este guia + [DEPLOY-BLOG.md](./DEPLOY-BLOG.md)

**Publicar um post (autor/editor):**
- [ ] Autor e Categoria existem no Studio
- [ ] Post com título, slug (Generate), resumo, capa, conteúdo
- [ ] **Publish** (não só salvar)
- [ ] ~2 min → conferir `multazero.co/blog` (Ctrl+Shift+R)
- [ ] Post estratégico? Atualizar o teaser da landing (`index.html`, seção `#blog`) — manual

**Mudança de código no blog:**
- [ ] Testar em `cd blog && npm run dev`
- [ ] Testar o conjunto: `npm run build && npm run preview` (raiz)
- [ ] Branch → commit → merge na `main` → push (`gh auth switch --user arven-org` antes) → Actions faz o resto
