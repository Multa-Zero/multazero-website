# Multa Zero — Landing Page

> Gestão inteligente de multas para frotas corporativas.

Site institucional da **Multa Zero**, plataforma SaaS que centraliza multas, recursos com IA e pagamentos da frota em um único ambiente.

---

## 🖥 Preview

![Dashboard Preview](./images/Visão%20Geral.png)

---

## ⚡ Stack

| Camada       | Tecnologia                          |
|--------------|-------------------------------------|
| Build Tool   | [Vite](https://vitejs.dev/)         |
| Linguagem    | Vanilla JavaScript (ES Modules)     |
| Animações    | [GSAP](https://greensock.com/gsap/) + ScrollTrigger |
| Tipografia   | Aileron (custom) + Inter (Google Fonts) |
| Estilo       | CSS puro com Custom Properties      |

---

## 📁 Estrutura

```
multazero-website/
├── docs/                     # Documentação de design e copy
│   ├── DESIGN-SYSTEM-BRIEF.md
│   ├── CONVERSION-COPY-GUIDE.md
│   └── MULTAZERO-WEBSITE-BLUEPRINT.md
├── font/                     # Fontes Aileron (OTF)
├── images/                   # Assets visuais
├── videos/                   # Vídeo hero background
├── index.html                # Página principal (SPA)
├── styles.css                # Design system + estilos
├── main.js                   # Animações GSAP + interações
├── package.json              # Dependências
└── README.md
```

---

## 🎨 Design System

Tokens definidos em `styles.css` como CSS Custom Properties:

### Cores

| Token              | Valor     | Uso                    |
|--------------------|-----------|------------------------|
| `--primary-bg`     | `#105DFB` | Ações primárias        |
| `--blue-ribbon-9`  | `#02256E` | Botões, CTA, destaque  |
| `--text-primary`   | `#303641` | Texto principal        |
| `--text-secondary` | `#6B7585` | Texto auxiliar         |
| `--surface-default`| `#FAFBFC` | Fundo padrão           |
| `--surface-elevated`| `#FFFFFF`| Cartões e superfícies  |

### Tipografia

- **Aileron** — Headings (h1–h6), peso 300–700
- **Inter** — Body text, fallback

| Classe       | Tamanho | Peso |
|--------------|---------|------|
| `.heading-1` | 54px    | 700  |
| `.heading-2` | 42px    | 700  |
| `.heading-3` | 32px    | 700  |
| `.body-L`    | 18px    | 400  |
| `.body-M`    | 16px    | 400  |
| `.body-S`    | 14px    | 400  |

### Espaçamento

Escala de 4px → 80px: `--space-4`, `--space-8`, `--space-12`, `--space-16`, `--space-24`, `--space-32`, `--space-40`, `--space-48`, `--space-64`, `--space-80`

### Componentes

- **Botões**: `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-outline-light` — Tamanhos: `.btn-L`, `.btn-M`, `.btn-S`
- **Cards**: `.card`, `.card-neutral`, `.card-shadow` (com hover lift)
- **Tags**: `.tag` com variações de cor
- **Formulários**: `.form-input`, `.form-textarea`, `.form-label`
- **Navbar**: Glassmorphism com `backdrop-filter: blur()`, transição transparente → sólida via scroll

---

## 📐 Seções da Página

| #  | Seção           | ID             | Descrição                                         |
|----|-----------------|----------------|----------------------------------------------------|
| 1  | Hero            | `#home`        | Vídeo background, headline, CTA duplo              |
| 2  | Logos           | —              | Prova social com empresas parceiras                 |
| 3  | Problema        | `#problema`    | 4 cards de pain points                              |
| 4  | Solução         | `#solucao`     | Split layout com features e imagem                  |
| 5  | Como Funciona   | `#como-funciona` | Timeline de 4 passos                              |
| 6  | Diferenciais    | `#diferenciais`| Bento grid com IA, CNH, pagamento                   |
| 7  | Resultados      | `#resultados`  | Stats animados + 3 depoimentos                     |
| 8  | Oferta          | `#oferta`      | Formulário de contato consultivo                    |
| 9  | FAQ             | `#faq`         | 5 perguntas com accordion                           |
| 10 | CTA Final       | —              | Bloco de conversão final                            |
| 11 | Footer          | —              | Links, redes sociais, termos legais                 |

---

## 🎬 Animações (GSAP)

- **Scroll Reveal**: Fade-up para textos (`.reveal-up`) e cards (`.reveal-card`)
- **Stagger**: Cards e timeline steps aparecem em sequência
- **Counter**: Números da seção Resultados animam de 0 ao valor final
- **FAQ Accordion**: Expand/collapse suave
- **Navbar**: Transição transparente → glassmorphism ao atingir a seção de logos

---

## 🚀 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar dev server
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

---

## 📋 UX & Design Decisions

- **Glassmorphism Navbar**: `backdrop-filter: blur(24px)` aplicado via `::before` pseudo-element para evitar conflito de stacking context com o dropdown mobile
- **Hero Gradient**: Gradiente vertical de preto transparente (topo) para azul marca (base), permitindo o vídeo background ser visível
- **Cards Hover**: Micro-animação `translateY(-4px)` + shadow upgrade no hover
- **Stats Inline**: Números e sufixos (%, k+) em linha via flexbox
- **Mobile First**: Hero 85vh no mobile, tipografia responsiva reduzida, nav compacta
- **Section Titles**: Max-width 640px para headings, 864px para CTA final

---

## 📖 Documentação Complementar

- [`docs/DESIGN-SYSTEM-BRIEF.md`](./docs/DESIGN-SYSTEM-BRIEF.md) — Tokens, componentes e regras de design
- [`docs/CONVERSION-COPY-GUIDE.md`](./docs/CONVERSION-COPY-GUIDE.md) — Copy de conversão por seção
- [`docs/MULTAZERO-WEBSITE-BLUEPRINT.md`](./docs/MULTAZERO-WEBSITE-BLUEPRINT.md) — Blueprint e fluxo UX da página

---

## 📄 Licença

© 2026 Multa Zero Tecnologia. Todos os direitos reservados.
