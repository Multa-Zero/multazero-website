# Aileron WOFF2 (hintada para Windows)

Geradas em 2026-07-12 a partir dos `.otf` originais (CC0), convertendo os
contornos CFF para TrueType (cu2qu) e aplicando autohint (ttfautohint 
`windows_compatibility`, `increase_x_height=0`) + compressão WOFF2.

**Por quê:** os `.otf` originais não têm hinting e o Chrome/DirectWrite no
Windows renderiza texto pequeno (12–16px) com hastes irregulares e letras
"sujas". Estas versões corrigem isso; no macOS a aparência não muda.

**Detalhe do `increase_x_height=0`:** o padrão do ttfautohint (14) engorda a
altura-x em textos ≤14px, o que na Aileron cola o pingo do "i" na haste.
Se um dia regenerar estes arquivos, mantenha essa opção zerada.

## Para usar no app.multazero.co

1. Copie os 16 `.woff2` desta pasta para `public/fonts/aileron/` do app
   (mesma pasta onde já estão os `.otf`).
2. Em cada `@font-face`, acrescente o WOFF2 antes do OTF. Bloco completo
   pronto (mesmos pesos que o app declara hoje):

```css
@font-face { font-family: Aileron; src: url(/fonts/aileron/Aileron-Thin.woff2) format("woff2"), url(/fonts/aileron/Aileron-Thin.otf) format("opentype"); font-weight: 100; font-style: normal; font-display: swap; }
@font-face { font-family: Aileron; src: url(/fonts/aileron/Aileron-ThinItalic.woff2) format("woff2"), url(/fonts/aileron/Aileron-ThinItalic.otf) format("opentype"); font-weight: 100; font-style: italic; font-display: swap; }
@font-face { font-family: Aileron; src: url(/fonts/aileron/Aileron-UltraLight.woff2) format("woff2"), url(/fonts/aileron/Aileron-UltraLight.otf) format("opentype"); font-weight: 200; font-style: normal; font-display: swap; }
@font-face { font-family: Aileron; src: url(/fonts/aileron/Aileron-UltraLightItalic.woff2) format("woff2"), url(/fonts/aileron/Aileron-UltraLightItalic.otf) format("opentype"); font-weight: 200; font-style: italic; font-display: swap; }
@font-face { font-family: Aileron; src: url(/fonts/aileron/Aileron-Light.woff2) format("woff2"), url(/fonts/aileron/Aileron-Light.otf) format("opentype"); font-weight: 300; font-style: normal; font-display: swap; }
@font-face { font-family: Aileron; src: url(/fonts/aileron/Aileron-LightItalic.woff2) format("woff2"), url(/fonts/aileron/Aileron-LightItalic.otf) format("opentype"); font-weight: 300; font-style: italic; font-display: swap; }
@font-face { font-family: Aileron; src: url(/fonts/aileron/Aileron-Regular.woff2) format("woff2"), url(/fonts/aileron/Aileron-Regular.otf) format("opentype"); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: Aileron; src: url(/fonts/aileron/Aileron-Italic.woff2) format("woff2"), url(/fonts/aileron/Aileron-Italic.otf) format("opentype"); font-weight: 400; font-style: italic; font-display: swap; }
@font-face { font-family: Aileron; src: url(/fonts/aileron/Aileron-SemiBold.woff2) format("woff2"), url(/fonts/aileron/Aileron-SemiBold.otf) format("opentype"); font-weight: 600; font-style: normal; font-display: swap; }
@font-face { font-family: Aileron; src: url(/fonts/aileron/Aileron-SemiBoldItalic.woff2) format("woff2"), url(/fonts/aileron/Aileron-SemiBoldItalic.otf) format("opentype"); font-weight: 600; font-style: italic; font-display: swap; }
@font-face { font-family: Aileron; src: url(/fonts/aileron/Aileron-Bold.woff2) format("woff2"), url(/fonts/aileron/Aileron-Bold.otf) format("opentype"); font-weight: 700; font-style: normal; font-display: swap; }
@font-face { font-family: Aileron; src: url(/fonts/aileron/Aileron-BoldItalic.woff2) format("woff2"), url(/fonts/aileron/Aileron-BoldItalic.otf) format("opentype"); font-weight: 700; font-style: italic; font-display: swap; }
@font-face { font-family: Aileron; src: url(/fonts/aileron/Aileron-Heavy.woff2) format("woff2"), url(/fonts/aileron/Aileron-Heavy.otf) format("opentype"); font-weight: 800; font-style: normal; font-display: swap; }
@font-face { font-family: Aileron; src: url(/fonts/aileron/Aileron-HeavyItalic.woff2) format("woff2"), url(/fonts/aileron/Aileron-HeavyItalic.otf) format("opentype"); font-weight: 800; font-style: italic; font-display: swap; }
@font-face { font-family: Aileron; src: url(/fonts/aileron/Aileron-Black.woff2) format("woff2"), url(/fonts/aileron/Aileron-Black.otf) format("opentype"); font-weight: 900; font-style: normal; font-display: swap; }
@font-face { font-family: Aileron; src: url(/fonts/aileron/Aileron-BlackItalic.woff2) format("woff2"), url(/fonts/aileron/Aileron-BlackItalic.otf) format("opentype"); font-weight: 900; font-style: italic; font-display: swap; }
```

Obs.: a Aileron não tem peso 500 (Medium) — `font-weight: 500` resolve para
o Regular. Se o design pedir "medium", use 600 (SemiBold).

Licença: CC0 1.0 (domínio público), igual aos originais — ver
`../CC0 1.0 Universal (CC0 1.0)  Public Domain Dedication.txt`.
