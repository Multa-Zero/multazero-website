# Reformulação da Landing Page multazero — Design

**Data:** 2026-07-06
**Autor:** Renato (brief) + Claude (design)
**Arquivos afetados:** `index.html`, `styles.css`, `main.js`, `public/hero-truck-sunset.jpg` (novo asset)

---

## Contexto

A landing page (`index.html`, estático Vite + GSAP) tem hoje o seguinte fluxo:

1. Hero — H1 + subheadline + foto do caminhão (`public/truckoptmizedfinalv3.jpg`) + peek do dashboard
2. Problema (`#problema`) — "O desafio da sua frota" + 4 dores
3. Bento (`#plataforma-bento`) — 3 cards (busca IA, alertas, score do condutor) com motions em CSS/JS
4. Resultados (`#resultados`) — 3 stats
5. Oferta (`#oferta`) — CTA que abre modal de contato
6. Features (`#diferenciais`) — accordion (IA Embutida / Gestão de Multas / Criação de Recursos) + 3 motions (typewriter de defesa, pipeline arrastando, 3 passos do recurso)
7. Blog (`#blog`)
8. FAQ (`#faq`)
9. CTA final
10. Footer

Todos os "motions" existentes são **feitos à mão em CSS/JS** — não há exports de Figma no repositório. Os únicos assets de produto são `images/Visão Geral.png` (dashboard) e a foto do hero.

## Objetivo

Reposicionar a página de "venda de copy/dores" para **demonstração de funcionalidades**, conforme o brief do cliente ("Não estamos vendendo copy, e sim funcionalidades").

## Decisões tomadas (brainstorming)

- **Motions das novas dobras:** construídos em código (CSS/JS) no mesmo estilo dos existentes — não dependem de exports de Figma.
- **Foto do hero:** **asset já recebido** (`public/hero-truck-sunset.jpg`) → troca entra na **fase 1**. Imagem original enviada pelo cliente (`public/7504e8a6-...png`, caminhão com sol ao fundo) foi cortada para remover a marca d'água "HIGGSFIELD AI" do canto inferior direito, convertida para JPG e otimizada (1376×672, ~133KB). ⚠️ Caveat: a marca d'água é do gerador (Higgsfield free tier) — cabe ao cliente garantir a licença de uso comercial da imagem.
- **Escopo desta rodada (fase 1):** copy + estrutura **+ troca da foto do hero**. Apenas os **motions animados** ficam para a **fase 2**.
- **Seção `#diferenciais` (Conheça o MultaZero):** **mantida**. A nova dobra "Recursos com IA" entra como resumo benefício-first; `#diferenciais` segue como o "como funciona" detalhado.

## Não-objetivos (fora desta rodada)

- Trocar a foto do hero (aguarda asset do cliente → fase 2).
- Animar os visuais das novas dobras (fase 2).
- Mexer em Blog, FAQ, CTA final, footer, modal de contato.
- Refatorações não relacionadas.

---

## Nova arquitetura de informação

| # | Antes | Depois (fase 1) |
|---|-------|-----------------|
| Hero | subheadline antiga | **nova subheadline** (foto = fase 2) |
| `#problema` | "O desafio da sua frota" (4 dores) | **REMOVIDO** e substituído por → |
| — | *(não existe)* | **Dobra A — "O que é o multazero"** (texto + faixa de 4 destaques com visual estático) |
| `#plataforma-bento` | 3 cards | **novos títulos/textos** + **CTA "Falar com representante"** |
| — | *(não existe)* | **Dobra B — "Recursos com IA"** (economia 40–80%, recurso em ~1 min, % de aprovação) + CTA + visual estático |
| `#resultados` | stats | mantém |
| `#oferta` | form CTA | mantém |
| `#diferenciais` | accordion + motions | mantém |
| — | *(não existe)* | **Dobra C — Institucional/LogTech** |
| `#blog` / `#faq` / CTA final / footer | | mantém |

**Posição das novas dobras:**
- Dobra A ocupa o lugar do antigo `#problema` (entre Hero e Bento).
- Dobra B entra logo **após o Bento** (antes de `#resultados`).
- Dobra C entra **antes do FAQ** (após `#diferenciais`), como bloco de confiança/institucional.

Nenhum link de navegação/rodapé precisa mudar (mantemos `#diferenciais`, `#resultados`, `#oferta`).

---

## Especificação seção a seção (fase 1)

Todas as novas seções reutilizam classes existentes: `section-padding`, `card-neutral`, `container`, `heading-2`, `heading-5`, `body-M`/`body-S`, `text-secondary`, `reveal-up`, `tag`/eyebrow, `btn btn-primary btn-M`. CTAs "Falar com representante" apontam para `#oferta` (abre o modal de contato existente), seguindo o padrão atual.

### Hero — subheadline + foto
Trocar o texto de `.hero-subtitle`:
> Solução inteligente para captura, gestão e pagamento de infrações em tempo real, com inteligência artificial.

Trocar a foto de fundo (`.hero-bg-image`, `src="/truckoptmizedfinalv3.jpg"`) por `/hero-truck-sunset.jpg`. (H1 e CTAs **inalterados** nesta fase.)

### Dobra A — "O que é o multazero" (substitui `#problema`)
Remover o bloco inteiro `<section ... id="problema">`. No lugar, nova seção com:

Texto principal:
> O multazero é um sistema inteligente de gestão de infrações, conectado a todos os órgãos infratores do Brasil, possibilitando a gestão de infrações em tempo real, indicação de condutores, emissão de boletos com descontos, e pagamentos de IPVA, DPVAT/SPVAT e licenciamentos.

Faixa de 4 destaques (cards/itens com ícone — visual estático na fase 1, motions na fase 2):
1. **Indicação do real condutor**
2. **Pagamento das multas via PIX**
3. **Boleto com 40%/20% de desconto**
4. **Pipeline de multas em tempo real**

Área de visual/motion: na fase 1, um bloco estático limpo (pode reaproveitar `images/Visão Geral.png` ou cards estilizados). Reservar o slot para o motion da fase 2.

### Bento (`#plataforma-bento`) — troca de copy + CTA
Motions atuais dos cards **permanecem**. Trocar apenas título + descrição:

| Card | Título novo | Descrição nova |
|------|-------------|----------------|
| IA (`--hero`) | **Inteligência artificial no apoio diário** | Perguntas e respostas em tempo real, linkada ao seu negócio. |
| Alertas (`--alerts`) | **Prazos em dia** | Notificações inteligentes de acompanhamento das infrações. |
| Condutor (`--condutor`) | **Acompanhamento em tempo real** | Desempenho do motorista consolidado, direto do prontuário CNH. |

Adicionar, ao fim da seção, um CTA centralizado: `Falar com representante` → `#oferta`.

**Sub-título do cabeçalho do bento** (decisão: alterar) — trocar o `body-M` que hoje diz "Pergunte, monitore e analise tudo que sua frota precisa numa experiência só." por texto alinhado aos 3 novos cards:
> Inteligência artificial, prazos em dia e acompanhamento em tempo real — tudo numa experiência só.

(Eyebrow "Uma plataforma, tudo resolvido" e H2 "Gestão de multas com IA do começo ao fim" permanecem.)

### Dobra B — "Recursos com IA" (nova, após o Bento)
Eyebrow/tag: **Recursos**. Título e corpo:
> **Em média, uma transportadora ou locadora economiza de 40% a 80% com a gestão de recursos nas infrações.**
>
> O multazero usa inteligência artificial para gerar recursos inteligentes: em cerca de 1 minuto você tem um documento completo, pronto para enviar ao órgão. A IA analisa o caso e entrega a **% de chance de aprovação** daquele recurso — mais assertividade e economia direta.

Visual (fase 1 estático → fase 2 motion): representação de "recurso sendo gerado + medidor de % da IA". Na fase 1, card estático com um documento + um indicador de percentual (ex.: "87% de chance de aprovação").

CTA: `Falar com representante` → `#oferta`.

### Dobra C — Institucional / LogTech (nova, antes do FAQ)
Título curto (ex.: "Sobre o multazero" ou "Uma LogTech de redução de custos"). Corpo em 3 parágrafos:
> O multazero é uma LogTech, fundada em 2025 com foco 100% na redução de custos e no manejo de infrações. O objetivo central é garantir confiabilidade nos dados, gestão aguçada de prazos e status, e pagamentos facilitados.
>
> Somos parceiros credenciados do Banco do Brasil e atuamos com API própria documentada, de fácil integração a sistemas terceiros e com compliance absoluto.
>
> A economia no mercado de infrações vem da organização, de recursos bem deferidos e de meios de pagamento mais ágeis. Se sua frota busca economizar entre 20% e 140% ao mês com infrações, fale com nossos representantes.

Elementos de apoio (usar só o que já existe/for trivial): selo "Parceiro credenciado Banco do Brasil", "API própria documentada", "Compliance LGPD". CTA: `Falar com representante` → `#oferta`.

---

## Correções de texto aplicadas (do brief original)

- "recusos" → "recursos"
- "contudor" → "condutor"
- "funcionalides" → "funcionalidades"
- "agéis" → "ágeis"
- **"DPAVAT/SPAVAT" → "DPVAT/SPVAT"** (nome correto do seguro obrigatório)
- "nossos sistema" → "nosso sistema"

## Pontos revisados com o cliente (resolvidos)

1. **Números divergentes entre seções** → **manter exatamente como no brief** (40–80% na Dobra B, 40% em Resultados, 20–140% na Dobra C). ✅
2. **DPVAT/SPVAT** → grafia correta confirmada. ✅
3. **Sub-título do cabeçalho do Bento** → **alterar** (novo texto definido na seção do Bento). ✅

---

## Estratégia de fase 2 (backlog, não implementar agora)

- Motion Dobra A: indicação de condutor, PIX, boleto 40/20, pipeline caindo.
- Motion Dobra B: recurso sendo gerado + medidor de % da IA animado.
- Reavaliar fusão da Dobra B com `#diferenciais`, se fizer sentido.

## Verificação (fase 1)

- `npm run dev` e inspecionar visualmente a página inteira (desktop + mobile) via Playwright: hero, nova Dobra A no lugar do problema, bento com nova copy + CTA, Dobra B, resultados, diferenciais, Dobra C, FAQ.
- Conferir que os CTAs "Falar com representante" abrem o modal de contato.
- Conferir revelações GSAP (`reveal-up`) nas novas seções.
- Conferir responsividade (breakpoints já existentes no `styles.css`).
- `npm run build` sem erros.
