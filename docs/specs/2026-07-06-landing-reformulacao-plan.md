# Reformulação da Landing multazero — Plano de Implementação (Fase 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reformular a landing page (`index.html`) de "venda de dores" para demonstração de funcionalidades: nova foto/subheadline do hero, remover a seção de problema, adicionar 3 novas dobras e atualizar a copy + CTA do bento.

**Architecture:** Site estático (Vite + GSAP). Todas as mudanças da fase 1 ficam em `index.html` (markup/copy) e `styles.css` (estilos das novas seções). **Nenhuma mudança em `main.js`**: as revelações usam a classe `.reveal-up`, que o GSAP já aplica automaticamente via ScrollTrigger (`main.js:94`). Os "motions" descritos no brief entram como **visuais estáticos elegantes** nesta fase; a animação é fase 2.

**Tech Stack:** HTML, CSS (custom properties/design tokens já existentes), GSAP ScrollTrigger (já configurado), Vite.

## Global Constraints

- **Sem framework de testes.** O "ciclo de teste" de cada tarefa é: `npm run build` sem erros + verificação visual no browser via Playwright MCP (dev server `npm run dev`, porta padrão 5173).
- **Reutilizar classes/tokens existentes:** `section-padding`, `container`, `card-neutral`, `heading-2`/`heading-5`, `body-M`/`body-S`, `text-secondary`, `reveal-up`, `tag` (eyebrow global — usar esta, **não** `bento-eyebrow`, que é escopada a `#plataforma-bento`), `btn btn-primary btn-M`. Cores via tokens globais (`--blue-ribbon-*`, `--neutral-*`, `--surface-elevated`, `--border-default`, `--text-secondary`, `--space-*`, `--radius-*`, `--shadow-md`).
- **Todos os CTAs "Falar com representante" apontam para `#oferta`** (o clique aciona o modal de contato já existente).
- **Números mantidos exatamente como no brief:** Dobra Recursos "40% a 80%", card Resultados "40%", Dobra institucional "20% a 140%". Não padronizar.
- **Copy corrigida:** DPVAT/SPVAT (não "DPAVAT/SPAVAT"); "recursos"/"condutor"/"ágeis"/"funcionalidades"/"nosso sistema".
- **Foto do hero:** usar `/hero-truck-sunset.jpg` (já no repositório, otimizado). Não usar o PNG original.
- **Novos ids de seção:** `sistema` (Dobra A), `recursos` (Dobra B), `sobre` (Dobra C). Não alterar navbar/rodapé (continuam apontando para `#diferenciais`, `#resultados`, `#oferta`).
- **Commits frequentes**, um por tarefa, em português, no branch `feat/landing-reformulacao`.

---

## Estrutura de arquivos

| Arquivo | Responsabilidade nesta fase |
|---------|-----------------------------|
| `index.html` | Markup + copy: hero, remoção de `#problema` → Dobra A, bento (copy+CTA), Dobra B, Dobra C |
| `styles.css` | Estilos das novas seções: `#sistema`, `.bento-cta`, `#recursos`, `#sobre`; repurpose do `padding-top` de compensação do peek |
| `public/hero-truck-sunset.jpg` | ✅ já commitado (asset do hero) |
| `main.js` | **sem alterações** |

---

## Task 1: Hero — subheadline + foto

**Files:**
- Modify: `index.html` (hero: `img.hero-bg-image` e `p.hero-subtitle`)

**Interfaces:**
- Consumes: asset `public/hero-truck-sunset.jpg` (servido como `/hero-truck-sunset.jpg`).
- Produces: nada para tarefas seguintes.

- [ ] **Step 1: Trocar a foto de fundo do hero**

Em `index.html`, no bloco `<div class="hero-bg">`, trocar:
```html
<img src="/truckoptmizedfinalv3.jpg" alt="" class="hero-bg-image">
```
por:
```html
<img src="/hero-truck-sunset.jpg" alt="" class="hero-bg-image">
```

- [ ] **Step 2: Trocar a subheadline**

Trocar:
```html
<p class="body-L hero-subtitle">Solução segura e completa para sua frota com auxilio da IA.</p>
```
por:
```html
<p class="body-L hero-subtitle">Solução inteligente para captura, gestão e pagamento de infrações em tempo real, com inteligência artificial.</p>
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build conclui sem erros; `dist/hero-truck-sunset.jpg` presente.

- [ ] **Step 4: Verificação visual**

Iniciar dev server em background: `npm run dev`. Via Playwright MCP: `browser_navigate` para `http://localhost:5173/`, `browser_take_screenshot` do topo.
Expected: hero mostra o caminhão com sol ao fundo (sem marca d'água) e a nova subheadline em uma linha coerente.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(hero): nova foto (caminhão com sol) e subheadline"
```

---

## Task 2: Remover `#problema` e criar Dobra A "O que é o multazero"

**Files:**
- Modify: `index.html` (substituir toda a `<section ... id="problema">`)
- Modify: `styles.css` (repurpose do seletor `#problema` → `#sistema`; adicionar estilos `.sistema-*`)

**Interfaces:**
- Consumes: nada.
- Produces: seção com `id="sistema"` posicionada entre o hero e o bento (herda a compensação do dashboard peek).

- [ ] **Step 1: Substituir o markup da seção**

Em `index.html`, **substituir todo o bloco** `<!-- 3. Problema -->` ... `</section>` (a `<section class="section-padding card-neutral" id="problema">` com o `.problema-grid` de 4 itens) por:

```html
<!-- 2. O que é o multazero (substitui a antiga seção Problema) -->
<section class="section-padding card-neutral" id="sistema">
  <div class="container">
    <div class="sistema-intro reveal-up">
      <span class="tag" style="margin-bottom:16px;">O que é o multazero</span>
      <h2 class="heading-2">Um sistema conectado a todos os órgãos infratores do Brasil</h2>
      <p class="body-M text-secondary sistema-lead">O multazero é um sistema inteligente de gestão de infrações, conectado a todos os órgãos infratores do Brasil, possibilitando a gestão de infrações em tempo real, indicação de condutores, emissão de boletos com descontos, e pagamentos de IPVA, DPVAT/SPVAT e licenciamentos.</p>
    </div>

    <div class="sistema-features reveal-up">
      <div class="sistema-feature">
        <div class="sistema-feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <h3 class="sistema-feature-title">Indicação do real condutor</h3>
        <p class="sistema-feature-desc">Identifique e indique o condutor correto de cada infração, direto na plataforma.</p>
      </div>

      <div class="sistema-feature">
        <div class="sistema-feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2 2 12l10 10 10-10L12 2z"></path><path d="M8 12h8M12 8v8"></path>
          </svg>
        </div>
        <h3 class="sistema-feature-title">Pagamento das multas via PIX</h3>
        <p class="sistema-feature-desc">Quite infrações na hora, com PIX integrado — sem sair do sistema.</p>
      </div>

      <div class="sistema-feature">
        <div class="sistema-feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M3 10h18M7 15h4"></path>
          </svg>
        </div>
        <h3 class="sistema-feature-title">Boleto com 40%/20% de desconto</h3>
        <p class="sistema-feature-desc">Emita boletos com o desconto legal aplicado automaticamente.</p>
      </div>

      <div class="sistema-feature">
        <div class="sistema-feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="5" height="18" rx="1"></rect><rect x="10" y="3" width="5" height="12" rx="1"></rect><rect x="17" y="3" width="4" height="8" rx="1"></rect>
          </svg>
        </div>
        <h3 class="sistema-feature-title">Pipeline de multas em tempo real</h3>
        <p class="sistema-feature-desc">Acompanhe cada infração mudando de etapa, ao vivo, num quadro visual.</p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Repurpose da compensação do peek**

Em `styles.css`, o seletor que compensa o dashboard peek (hoje `#problema`) deve passar a valer para a nova seção. Trocar:
```css
#problema {
    padding-top: clamp(420px, 60vw + 40px, 740px);
}
```
por:
```css
#sistema {
    padding-top: clamp(420px, 60vw + 40px, 740px);
}
```
(Manter o comentário acima do seletor.)

- [ ] **Step 3: Adicionar estilos da Dobra A**

Em `styles.css`, adicionar ao fim do arquivo (ou junto às seções de conteúdo):
```css
/* Dobra A — O que é o multazero */
.sistema-intro {
  max-width: 760px;
  margin: 0 auto 48px;
  text-align: center;
}
.sistema-lead {
  margin-top: 16px;
}
.sistema-features {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-24);
}
@media (min-width: 768px) {
  .sistema-features { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .sistema-features { grid-template-columns: repeat(4, 1fr); }
}
.sistema-feature {
  background: var(--surface-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-24);
}
.sistema-feature-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  background: var(--blue-ribbon-1);
  color: var(--blue-ribbon-7);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-16);
}
.sistema-feature-icon svg { width: 22px; height: 22px; }
.sistema-feature-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--neutral-9);
  margin: 0 0 6px;
}
.sistema-feature-desc {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-secondary);
  margin: 0;
}
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: sem erros.

- [ ] **Step 5: Verificação visual**

Via Playwright MCP no dev server: rolar até logo abaixo do hero.
Expected: o dashboard peek do hero encaixa sobre a nova seção sem sobrepor o texto; eyebrow "O QUE É O MULTAZERO" + H2 + parágrafo + 4 cards (Indicação do condutor, PIX, Boleto 40/20, Pipeline). Nada da antiga "O desafio da sua frota" aparece.

- [ ] **Step 6: Commit**

```bash
git add index.html styles.css
git commit -m "feat(sistema): substitui seção de problema pela dobra 'O que é o multazero'"
```

---

## Task 3: Bento — nova copy + sub-título + CTA

**Files:**
- Modify: `index.html` (cabeçalho do bento + títulos/descrições dos 3 cards + CTA no fim)
- Modify: `styles.css` (`.bento-cta`)

**Interfaces:**
- Consumes: nada. Motions dos cards (`ai-*`, `alertsList`, `score-ring`) **permanecem intactos**.
- Produces: nada.

- [ ] **Step 1: Trocar o sub-título do cabeçalho do bento**

Trocar:
```html
<p class="body-M text-secondary" style="margin-top: 12px;">Pergunte, monitore e analise tudo que sua frota precisa numa experiência só.</p>
```
por:
```html
<p class="body-M text-secondary" style="margin-top: 12px;">Inteligência artificial, prazos em dia e acompanhamento em tempo real — tudo numa experiência só.</p>
```

- [ ] **Step 2: Card IA (`bento-card--hero`)**

Trocar o `<h3 class="bento-card__title">Pergunte. A IA responde.</h3>` por:
```html
<h3 class="bento-card__title">Inteligência artificial no apoio diário</h3>
```
e o `<p class="bento-card__desc">Consulte multas, recursos e prazos em linguagem natural. Sem filtros, sem abas, sem exportar planilha.</p>` por:
```html
<p class="bento-card__desc">Perguntas e respostas em tempo real, linkada ao seu negócio.</p>
```

- [ ] **Step 3: Card Alertas (`bento-card--alerts`)**

Trocar `<h3 class="bento-card__title">Nunca mais perca um prazo</h3>` por:
```html
<h3 class="bento-card__title">Prazos em dia</h3>
```
e o desc `Notificações inteligentes de vencimento, recursos e indicação de condutor, direto da plataforma.` por:
```html
<p class="bento-card__desc">Notificações inteligentes de acompanhamento das infrações.</p>
```

- [ ] **Step 4: Card Condutor (`bento-card--condutor`)**

Trocar `<h3 class="bento-card__title">Score em um piscar de olhos</h3>` por:
```html
<h3 class="bento-card__title">Acompanhamento em tempo real</h3>
```
e o desc `Pontuação, faixa e infrações consolidadas por motorista, direto do prontuário CNH.` por:
```html
<p class="bento-card__desc">Desempenho do motorista consolidado, direto do prontuário CNH.</p>
```

- [ ] **Step 5: Adicionar CTA ao fim da seção**

Logo após o fechamento do `<div class="bento-grid reveal-up"> ... </div>` e antes do `</div>` do `.container`, inserir:
```html
      <div class="bento-cta reveal-up">
        <a href="#oferta" class="btn btn-primary btn-M">Falar com representante</a>
      </div>
```

- [ ] **Step 6: Estilo do CTA**

Em `styles.css`:
```css
.bento-cta {
  text-align: center;
  margin-top: 40px;
}
```

- [ ] **Step 7: Build**

Run: `npm run build`
Expected: sem erros.

- [ ] **Step 8: Verificação visual**

Via Playwright: seção do bento.
Expected: os 3 cards com os novos títulos/descrições, os motions (busca IA com brilho, alertas, score ring) continuam funcionando, e o botão "Falar com representante" aparece centralizado abaixo do grid.

- [ ] **Step 9: Commit**

```bash
git add index.html styles.css
git commit -m "feat(bento): nova copy dos 3 cards, sub-título e CTA"
```

---

## Task 4: Dobra B "Recursos com IA"

**Files:**
- Modify: `index.html` (nova `<section id="recursos">` entre o bento e `#resultados`)
- Modify: `styles.css` (`.recursos-*`, `.recurso-card`, `.recurso-gauge`)

**Interfaces:**
- Consumes: nada.
- Produces: seção `id="recursos"`. Visual estático (fase 1); vira motion na fase 2.

- [ ] **Step 1: Inserir o markup**

Em `index.html`, **entre** o fechamento da seção do bento (`</section>` de `#plataforma-bento`) e o início de `<!-- 4. Resultados -->`, inserir:
```html
  <!-- 3c. Recursos com IA -->
  <section class="section-padding" id="recursos">
    <div class="container">
      <div class="recursos-wrap">
        <div class="recursos-text reveal-up">
          <span class="tag" style="margin-bottom:16px;">Recursos</span>
          <h2 class="heading-2">Recursos com IA que economizam de 40% a 80%</h2>
          <p class="body-M text-secondary" style="margin-top:16px;">Em média, uma transportadora ou locadora economiza de 40% a 80% com a gestão de recursos nas infrações.</p>
          <p class="body-M text-secondary" style="margin-top:16px;">O multazero usa inteligência artificial para gerar recursos inteligentes: em cerca de 1 minuto você tem um documento completo, pronto para enviar ao órgão. A IA analisa o caso e entrega a <strong>% de chance de aprovação</strong> daquele recurso — mais assertividade e economia direta.</p>
          <div class="recursos-cta">
            <a href="#oferta" class="btn btn-primary btn-M">Falar com representante</a>
          </div>
        </div>

        <div class="recursos-visual reveal-up" aria-hidden="true">
          <div class="recurso-card">
            <div class="recurso-card-head">
              <div class="recurso-card-doc-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <div>
                <div class="recurso-card-name">Recurso_AIT129031.pdf</div>
                <div class="recurso-card-meta">Gerado pela IA · 3 páginas</div>
              </div>
            </div>
            <div class="recurso-card-lines">
              <span style="width:92%"></span>
              <span style="width:78%"></span>
              <span style="width:86%"></span>
              <span style="width:64%"></span>
            </div>
            <div class="recurso-gauge">
              <div class="recurso-gauge-ring"><span>87%</span></div>
              <div class="recurso-gauge-label">chance de aprovação estimada pela IA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Adicionar estilos**

Em `styles.css`:
```css
/* Dobra B — Recursos com IA */
.recursos-wrap {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-48);
  align-items: center;
}
@media (min-width: 1024px) {
  .recursos-wrap { grid-template-columns: 1.1fr 0.9fr; gap: 64px; }
}
.recursos-cta { margin-top: var(--space-32); }

.recurso-card {
  background: var(--surface-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--space-32);
  max-width: 420px;
  margin: 0 auto;
}
.recurso-card-head {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  margin-bottom: var(--space-24);
}
.recurso-card-doc-icon {
  width: 40px; height: 40px;
  border-radius: var(--radius-sm);
  background: var(--blue-ribbon-1);
  color: var(--blue-ribbon-7);
  display: flex; align-items: center; justify-content: center;
  flex: 0 0 auto;
}
.recurso-card-doc-icon svg { width: 20px; height: 20px; }
.recurso-card-name { font-size: 15px; font-weight: 600; color: var(--neutral-9); }
.recurso-card-meta { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
.recurso-card-lines { display: flex; flex-direction: column; gap: 10px; margin-bottom: var(--space-24); }
.recurso-card-lines span { height: 8px; border-radius: 4px; background: var(--neutral-2); display: block; }
.recurso-card-lines span:last-child { background: var(--blue-ribbon-2); }

.recurso-gauge {
  display: flex; align-items: center; gap: var(--space-16);
  padding-top: var(--space-24);
  border-top: 1px solid var(--border-default);
}
.recurso-gauge-ring {
  width: 84px; height: 84px; border-radius: 50%;
  flex: 0 0 auto;
  display: flex; align-items: center; justify-content: center;
  background: conic-gradient(var(--blue-ribbon-6) 0turn 0.87turn, var(--neutral-2) 0.87turn 1turn);
}
.recurso-gauge-ring span {
  width: 62px; height: 62px; border-radius: 50%;
  background: var(--surface-elevated);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: 700; color: var(--blue-ribbon-9);
}
.recurso-gauge-label { font-size: 14px; color: var(--text-secondary); line-height: 1.4; }
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: sem erros.

- [ ] **Step 4: Verificação visual**

Via Playwright: seção `#recursos`.
Expected: à esquerda o texto (tag "Recursos", H2 40–80%, 2 parágrafos, CTA); à direita o card de recurso com ícone de PDF, linhas simulando o documento e o anel mostrando "87%" preenchido ~87%. Em mobile, empilha (texto em cima, card embaixo).

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css
git commit -m "feat(recursos): dobra 'Recursos com IA' com card estático de % da IA"
```

---

## Task 5: Dobra C — Institucional / LogTech

**Files:**
- Modify: `index.html` (nova `<section id="sobre">` entre `#diferenciais` e `#blog`)
- Modify: `styles.css` (`.sobre-*`)

**Interfaces:**
- Consumes: nada.
- Produces: seção `id="sobre"`.

- [ ] **Step 1: Inserir o markup**

Em `index.html`, **entre** o fechamento da seção `<!-- 6. Features -->` (`#diferenciais`) e o início de `<!-- 6b. Blog / Conteúdo -->`, inserir:
```html
  <!-- 6a. Institucional / LogTech -->
  <section class="section-padding card-neutral" id="sobre">
    <div class="container">
      <div class="sobre-wrap reveal-up">
        <span class="tag" style="margin-bottom:16px;">Sobre o multazero</span>
        <h2 class="heading-2">Uma LogTech focada em reduzir custos com infrações</h2>
        <div class="sobre-body">
          <p class="body-M text-secondary">O multazero é uma LogTech, fundada em 2025 com foco 100% na redução de custos e no manejo de infrações. O objetivo central é garantir confiabilidade nos dados, gestão aguçada de prazos e status, e pagamentos facilitados.</p>
          <p class="body-M text-secondary">Somos parceiros credenciados do Banco do Brasil e atuamos com API própria documentada, de fácil integração a sistemas terceiros e com compliance absoluto.</p>
          <p class="body-M text-secondary">A economia no mercado de infrações vem da organização, de recursos bem deferidos e de meios de pagamento mais ágeis. Se sua frota busca economizar entre 20% e 140% ao mês com infrações, fale com nossos representantes.</p>
        </div>
        <div class="sobre-badges">
          <span class="sobre-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Parceiro credenciado Banco do Brasil
          </span>
          <span class="sobre-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            API própria documentada
          </span>
          <span class="sobre-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Compliance &amp; LGPD
          </span>
        </div>
        <div class="sobre-cta">
          <a href="#oferta" class="btn btn-primary btn-M">Falar com representante</a>
        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Adicionar estilos**

Em `styles.css`:
```css
/* Dobra C — Institucional / LogTech */
.sobre-wrap { max-width: 860px; margin: 0 auto; text-align: center; }
.sobre-body {
  margin-top: var(--space-24);
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  text-align: left;
}
@media (min-width: 768px) {
  .sobre-body { text-align: center; }
}
.sobre-badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-12);
  justify-content: center;
  margin-top: var(--space-32);
}
.sobre-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--border-default);
  background: var(--surface-elevated);
  font-size: 13px;
  font-weight: 600;
  color: var(--neutral-8);
}
.sobre-badge svg { width: 16px; height: 16px; color: var(--blue-ribbon-7); flex: 0 0 auto; }
.sobre-cta { margin-top: var(--space-32); }
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: sem erros.

- [ ] **Step 4: Verificação visual**

Via Playwright: seção `#sobre` (após "Conheça o MultaZero", antes do blog).
Expected: eyebrow + H2 + 3 parágrafos + 3 badges (Banco do Brasil, API, Compliance/LGPD) + CTA. Fundo neutro (`card-neutral`).

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css
git commit -m "feat(sobre): dobra institucional (LogTech, Banco do Brasil, API, compliance)"
```

---

## Task 6: Verificação holística (desktop + mobile + modal)

**Files:**
- Nenhum arquivo novo; apenas polish se algo destoar.

- [ ] **Step 1: Checar que não há referências órfãs a `#problema`**

Run: `grep -rn "#problema\|problema" index.html main.js`
Expected: nenhum link/JS aponta para `#problema` (a antiga seção foi removida). Se algo aparecer, ajustar.

- [ ] **Step 2: Build final**

Run: `npm run build`
Expected: sem erros.

- [ ] **Step 3: Screenshot de página inteira — desktop**

Via Playwright: `browser_resize` 1440×900, `browser_navigate` `http://localhost:5173/`, `browser_take_screenshot` `fullPage: true`.
Expected: fluxo Hero → O que é o multazero → Bento (nova copy + CTA) → Recursos com IA → Resultados → Oferta → Conheça o MultaZero → Sobre (LogTech) → Blog → FAQ → CTA final → Footer. Sem sobreposições ou seções quebradas.

- [ ] **Step 4: Screenshot de página inteira — mobile**

Via Playwright: `browser_resize` 390×844, recarregar, `browser_take_screenshot` `fullPage: true`.
Expected: todas as novas seções empilham corretamente; features do `#sistema` viram 1 coluna; `#recursos` empilha texto/card; badges do `#sobre` quebram linha.

- [ ] **Step 5: Verificar CTAs → modal**

Via Playwright: clicar em um dos botões "Falar com representante" (ex.: o do bento). 
Expected: o modal de contato (`#contact-modal`) abre. Fechar em seguida.

- [ ] **Step 6: Commit final (se houve polish)**

```bash
git add -A
git commit -m "chore(landing): ajustes finais de layout responsivo da fase 1"
```
(Se nenhum ajuste foi necessário, pular o commit.)

---

## Self-Review (cobertura da spec)

- ✅ Hero subheadline nova → Task 1
- ✅ Hero foto nova (`hero-truck-sunset.jpg`) → Task 1
- ✅ Remover "O desafio da sua frota" → Task 2
- ✅ Dobra A "O que é o multazero" + 4 destaques (condutor, PIX, boleto 40/20, pipeline) → Task 2
- ✅ Compensação do dashboard peek preservada (`#problema`→`#sistema`) → Task 2 Step 2
- ✅ Bento: 3 novos títulos + descrições → Task 3
- ✅ Bento: sub-título do cabeçalho alterado → Task 3 Step 1
- ✅ Bento: CTA "Falar com representante" → Task 3 Step 5
- ✅ Dobra B "Recursos com IA" (40–80%, 1 min, % da IA) + CTA + visual estático → Task 4
- ✅ Dobra C institucional (LogTech 2025, Banco do Brasil, API, compliance, 20–140%) + CTA → Task 5
- ✅ Números mantidos como no brief (40–80% / 40% / 20–140%) → constraints + copy nas Tasks 4/5
- ✅ Sem mudanças em `main.js` (reveal via `.reveal-up`) → constraints
- ✅ Verificação responsiva desktop+mobile + modal → Task 6

## Backlog Fase 2 (fora deste plano)

- Motions animados da Dobra A (indicação de condutor, PIX, boleto, pipeline caindo).
- Motion animado da Dobra B (recurso sendo gerado + medidor de % da IA subindo).
- Reavaliar fusão da Dobra B com `#diferenciais`.
