# Home · cards do blog vindos do Sanity (build-time)

**Data:** 2026-07-10 · **Status:** aprovado

## Problema

A seção "Direto do nosso blog" da home (`index.html`, `#blog`) tinha 3 artigos
**hardcoded** apontando para slugs que não existem no Sanity (404), divergindo
do conteúdo real de `/blog`.

## Decisão

Injetar os posts **no build** (aprovado pelo Renato em 2026-07-10), não no
navegador. Como publicar no Sanity dispara rebuild completo via webhook
(`docs/DEPLOY-BLOG.md`), a home fica em sincronia com `/blog` automaticamente,
sem JS extra, sem CORS e sem prejuízo de SEO. A alternativa runtime (fetch no
navegador) foi descartada: frescor igual (todo publish rebuilda), custo maior.

## Como funciona

1. `index.html` deixa de ter cards fixos; entre os marcadores
   `<!-- BLOG-TEASERS:START -->` / `<!-- BLOG-TEASERS:END -->` fica só o
   fallback "Em breve, novos artigos por aqui." (mesmo empty state do blog).
2. Novo passo no `scripts/build-all.mjs`, após o build do Vite:
   `node scripts/inject-blog-teasers.mjs`.
3. O script consulta a API HTTP pública do Sanity (projeto `57jbjtzh`,
   dataset `production`) com a mesma GROQ do blog, pega os **3 mais recentes**
   e substitui o trecho entre os marcadores no `dist/index.html` pelos cards
   (`.blog-teaser-card`, markup idêntico ao anterior — CSS intocado).
4. Regras espelhadas do blog (`blog/src/lib/sanity.js`): tag ausente →
   "Conteúdo"; sem capa → `/blog/sample-cover.jpg`; tempo de leitura =
   palavras/200. Título/resumo/tag passam por escape de HTML.
5. Com **1 ou 2 posts**, o script adiciona `blog-teaser-grid--1`/`--2` ao grid
   e o CSS centraliza os cards (colunas de até 400px, `justify-content:
   center`) em vez de deixá-los largados à esquerda do grid de 3. Em ≤600px
   volta a empilhar em coluna única. Pedido do Renato em 2026-07-10.

## Falhas

- Sanity fora do ar ou 0 posts → home publica com o fallback (nunca links
  quebrados) e o build **não** falha — um soluço do Sanity não pode bloquear
  o deploy do site.
- `npm run dev` (Vite serve o `index.html` fonte) mostra o fallback estático;
  os cards reais só existem no output do build.

## Verificação

`npm run build` → `dist/index.html` deve conter card(s) com slug real do
Sanity (hoje: `gestao-de-multas-frota-custo-oculto`) e nenhum dos 3 slugs
antigos hardcoded.
