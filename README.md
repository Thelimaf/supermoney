# Super Money — Landing Page

Landing page da Super Money. **HTML puro, sem build**: é só abrir o
`index.html` num servidor estático.

- **Figma:** `PER-F` — arquivo `CcC0imREfR59yxVvNErIKX`, frame `3270:438`
  (1920 × 13793)
- **Animação:** GSAP 3.15 (ScrollTrigger, SplitText, Draggable) + Lenis, tudo
  local em `vendor/` — nenhum CDN em runtime

## Rodar localmente

```bash
npx serve -l 5173 .
```

## Estrutura

```
index.html                  a página inteira, uma <section> por dobra
assets/css/tokens.css       cores, tipografia, espaçamento, easing
assets/css/base.css         reset, @font-face, container, estados iniciais
assets/css/components.css   botão, card, badge — reuso entre seções
assets/css/sections/        um arquivo por seção, na ordem da página
assets/js/main.js           plugins, Lenis, âncoras, SM.section()
assets/js/lib/presets.js    presets de animação (SM.anim.*)
assets/js/sections/         um arquivo por seção
assets/fonts/               Helvetica Now Display (licenciada), Lato, Inter
vendor/                     GSAP e Lenis
```

## Documentação

- [`DESIGN.md`](DESIGN.md) — tokens, tipografia, inventário de assets, mapa de
  seções e as medidas conferidas contra o Figma
- [`ANIMATIONS.md`](ANIMATIONS.md) — qual animação pertence a qual seção e a
  lista de armadilhas já encontradas (leia antes de mexer no GSAP)

## Pendências de conteúdo

- Os depoimentos ainda são o texto genérico do Figma.
- As respostas 2 a 5 do FAQ foram escritas a partir do conteúdo da página; só a
  primeira vem do Figma.
- Todos os CTAs de WhatsApp apontam para `(27) 99962-3772` (unidade Aracruz).

## Fontes

A **Helvetica Now Display** é licenciada e foi fornecida pelo cliente. Os
arquivos em `Fonts/` e `assets/fonts/` não podem ser redistribuídos — por isso
este repositório é privado.
