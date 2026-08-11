# Design — Super Money

Documentação do design extraída do Figma. **Fonte da verdade** para qualquer
decisão visual. Atualizado a cada sessão aprovada.

- **Arquivo Figma:** `PER-F` — `CcC0imREfR59yxVvNErIKX`
- **Página:** `2567:61` (Super money)
- **Frame da landing:** `3270:438` — **1920 × 13793 px**
- **Mobile:** não existe no Figma. Derivado por nós (breakpoints abaixo).

---

## Fonte

Duas famílias, ambas auto-hospedadas em `assets/fonts/`.

**Helvetica Now Display** — Bold (700) e Regular (400). Toda a página, exceto
os cards de depoimento.

**Lato** — Bold (700) e Regular (400). Só nos cards de depoimento; é a fonte
que o Figma usa nessa seção. Subset latino do Google Fonts, 23 KB por peso.

**Inter** — SemiBold (600) e Regular (400). Só nos chips de taxa das seções de
produto, também por indicação do Figma. Subset latino, 47 KB por peso.

Sobre a Helvetica Now Display: Arquivos licenciados
fornecidos pelo cliente em `Fonts/`, convertidos para `.woff2` em
`assets/fonts/` (149KB → 45KB, 147KB → 41KB). O `.ttf` fica como fallback no
`@font-face`.

Nenhum outro peso aparece no design.

## Cores

| Token | Hex | Onde aparece |
| --- | --- | --- |
| `--c-verde-escuro` | `#003511` | fundo do hero, "Como funciona", FAQ, footer |
| `--c-verde-profundo` | `#003913` | fundo da seção "Sobre", caixa dos ícones |
| `--c-verde-medio` | `#005C00` | blob do hero, fim do gradiente do card "Sobre" |
| `--c-verde-vivo` | `#09A112` | início do gradiente do card "Sobre" |
| `--c-verde-vivo-2` | `#057F09` | meio do gradiente do card "Sobre" |
| `--c-verde-lima` | `#7BEE09` | CTA primário |
| `--c-lima-texto` | `#0A410A` | texto sobre o lima |
| `--c-branco` | `#FFFFFF` | fundo das seções claras, botão secundário |
| `--c-preto` | `#0A0A0A` | única *variável* declarada no Figma (`preto`) |
| `--c-preto-btn` | `#040404` | texto do botão branco |
| `--c-verde-titulo` | `#0A410A` | títulos de card sobre fundo claro |
| `--c-card-claro` | `#F5F9F8` | fundo dos cards nas seções brancas |
| `--c-texto-corpo` | `#0C0C0C` | corpo de texto sobre fundo claro |
| `--c-divisor` | `#AAFFAA` | divisórias entre os badges do hero |
| `--c-contorno` | `#D7FFCF` | stroke dos quadrados arredondados decorativos (0.6 alpha, 3.65px) |
| `--c-glow-a` | `#00FF48` | glow grande borrado do hero |
| `--c-glow-b` | `#0CFF00` | glow menor, `mix-blend-mode: screen` |
| `--c-glow-c` | `#23CC53` | glow largo de "Como funciona" |
| `--c-titulo-secao` | `#191919` | H2 das seções claras |
| `--c-passo-card` | `#E5FEE5` | card de passo em "Como funciona" |
| `--c-passo-badge` | `#D5FA61` | pílula "Passo N" |

> As cores das seções claras (cards `#F4FAF6` / `#EDFBEE`, verde médio dos cards
> de destaque dos produtos) entram aqui conforme cada sessão as extrai.

## Tipografia

| Uso | Tamanho @1920 | Line-height | Peso | Token |
| --- | --- | --- | --- | --- |
| H1 hero | 74px | 1.08 | Bold | `--fs-h1` |
| H2 de seção | ~45px | 1.24 | Bold | `--fs-h2` |
| H2 grande ("Sobre") | 52px | 1.08 | Bold | `--fs-h2-lg` |
| Título de card | 28px | 1.24 | Bold | `--fs-h3` |
| Título de card (diferenciais) | 26px | 1.08 | Bold | `--fs-card-title` |
| Texto de card | 18px | 1.26 | Regular | `--fs-card-text` |
| Lead / subtítulo | 20px | 1.3 | Regular | `--fs-lead` |
| Corpo | 16px | 1.45 | Regular | `--fs-body` |
| Small / badge | 15px | 1.3 | Regular | `--fs-sm` |
| Numeral (Passo 1–4) | ~130px | 1 | Bold | `--fs-numeral` |

Toda a escala é fluida via `clamp()`, ancorada em 1920px. O mobile deriva
sozinho, sem media query de tipografia.

**Sem `letter-spacing` customizado e sem `text-wrap: balance`.** Ambos foram
testados contra o Figma e desalinham os títulos: o tracking negativo encurtava
as linhas do H1 em 18px, e o `balance` reagrupava "16 anos de / mercado" em
"16 anos / de mercado". A Helvetica Now Display já traz o tracking do design e
o Figma quebra linha de forma gulosa.

## Layout

| Contexto | Largura de conteúdo @1920 | Token |
| --- | --- | --- |
| Padrão | 1060px (margens de 430px) | `--container` |
| Card "Sobre" | 1220px | `--container-wide` |
| Seções de produto | 879px | `--container-narrow` |
| FAQ | 707px | `--container-tight` |

Raio de botão **3px**; raio de card **12px**.

## Breakpoints (derivados)

| Nome | Largura | Comportamento |
| --- | --- | --- |
| Desktop grande | ≥ 1440px | layout do Figma |
| Desktop | 1024–1439px | container fixo, margens menores |
| Tablet | 768–1023px | grades de 4 → 2 colunas |
| Mobile | ≤ 767px | coluna única, nav vira menu, carrossel vira swipe |

---

## Mapa de seções

Ordem real da página, por Y no Figma.

| # | Seção | Node | Y / altura | Estado |
| --- | --- | --- | --- | --- |
| 01 | Nav + Hero | `3270:485` | 0 / 825 | ✅ |
| 02 | Diferenciais (4 cards) | `3270:439` | 825 / 508 | ✅ |
| 03 | Sobre | `3270:535` | 1333 / 877 | ✅ |
| 04 | Soluções de crédito (7 cards) | `3270:545` | 2209 / 977 | ✅ |
| 05 | Como funciona (4 passos) | `3270:607` | 3186 / 929 | ✅ |
| 06 | Brinde (CTA banner) | `3270:1360` | 4117 / 577 | ✅ |
| 07 | Depoimentos (carrossel) | `3270:680` | 4694 / 875 | ✅ |
| 08 | Bancos parceiros | `3270:758` | ~5569 / 282 | ✅ |
| 09 | Produto: Consignado INSS | `3270:798` | 6011 / 1351 | ✅ |
| 10 | Produto: Crédito do Trabalhador (CLT) | `3270:960` | 7362 / 1442 | ✅ |
| 11 | Produto: Servidor Público | `3270:869` | 8804 / 1351 | ✅ |
| 12 | Produto: Limpa Nome | `3270:1042` | 10155 / 1442 | ✅ |
| 13 | Unidades | `3270:1253` | 11597 / 854 | ✅ |
| 14 | FAQ | `3270:1318` | 12451 / 841 | ✅ |
| 15 | Rodapé | `3270:1367` | 13292 / 501 | ✅ |

Legenda: ⏳ pendente · 🔨 em andamento · ✅ aprovado

---

## Inventário de assets

### Baixados (sessão 00)

| Arquivo | Origem | Nota |
| --- | --- | --- |
| `img/logo/logo-supermoney.svg` | `3270:521` | logo completo, monocromático `#FEFEFE`, 178×100.687 |
| `img/logo/logo-mark.svg` | recorte do logo | só a marca `$M` (bbox 62.8, 0, 52.4×44.8) |
| `img/logo/favicon.svg` | recorte do logo | marca `$M` sobre `#003511`, viewBox quadrado |
| `img/hero/hero-mulher.png` | `3270:534` | 611×728, PNG com transparência |
| `img/hero/shape-rect-4.svg` | `3270:486` | blob sólido `#005C00` |
| `img/hero/shape-rect-6.svg` | `3270:533` | quadrado arredondado com stroke |
| `img/hero/shape-rect-7.svg` | `3270:519` | idem (mesmo path) |
| `img/hero/shape-ellipse.svg` | `3270:518` | glow — **substituído por CSS** |
| `img/hero/shape-glow.svg` | `3270:516` | glow screen — **substituído por CSS** |
| `icons/seal-check.svg` | `3270:499` | Phosphor SealCheck |

### Baixados (sessão 02)

| Arquivo | Origem | Nota |
| --- | --- | --- |
| `icons/calendar-check.svg` | `3270:442` | quadrado `#003913` + glifo branco |
| `icons/magnifying-glass-minus.svg` | `3270:454` | idem |
| `icons/user-check.svg` | `3270:464` | idem |
| `icons/gift.svg` | `3270:474` | idem |

### Baixados (sessão 03)

| Arquivo | Origem | Nota |
| --- | --- | --- |
| `img/sobre/fachada-loja.webp` | `3270:544` | 941×1672; placa da loja entre 58,6% e 74,4% da altura |
| `img/sobre/shape-frame.svg` | `3270:536` | contorno 888×887, stroke 5px (o do hero é 3,65px) |

### Otimização de imagens

As fotos vêm do Figma em PNG pesado. Convertidas para WebP e movidas para
`assets/img/_originais/` (não são servidas):

| Arquivo | PNG | WebP |
| --- | --- | --- |
| `fachada-loja` | 2193 KB | **175 KB** (−92%) |
| `hero-mulher` | 906 KB | **84 KB** (−91%) |

Total servido hoje (CSS + JS + fontes + imagens + vendor): **~956 KB**.

### Carregamento

Medido com CPU 6× mais lenta e 1,6 Mbps (celular mediano):

| Medida | Antes | Depois |
| --- | --- | --- |
| Requisições no load | 104 | **51** |
| Imagens baixadas no load | 124 | **13** |
| JS no boot | 239 KB | **204 KB** |
| Plugins GSAP na página | 6 | **3** |
| FCP | 1152 ms | **1088 ms** |
| DOM interativo | 2070 ms | **1863 ms** |
| Load | 3172 ms | **2640 ms** |
| Superfícies com `filter: blur()` | 2 (2 Mpx) | **0** |

- Só as imagens do hero e do nav são `eager`; as outras 116 têm
  `loading="lazy"`. Todas ganharam `decoding="async"`.
- A foto do hero é o LCP e tem `<link rel="preload" as="image">` +
  `fetchpriority="high"`.
- `DrawSVGPlugin` e `InertiaPlugin` saíram da página (nenhuma seção os usa).
- O `Draggable` (35 KB) serve só ao carrossel de depoimentos, a 4.700px do
  topo: agora é carregado sob demanda quando a seção se aproxima. Setas,
  pontos e teclado funcionam desde o primeiro frame.
- A foto do hero tem `srcset` de 560/700/854px — o celular baixa 37 KB em vez
  de 84 KB.
- Os glows do hero deixaram de usar `filter: blur()` (ver abaixo).
- `ScrollTrigger.config({ ignoreMobileResize: true })`: sem isso, recolher a
  barra de endereço do celular remedia os 70 gatilhos e engasga o scroll.
- CLS medido: **0**.

As fontes Lato e Inter (143 KB) baixam no load mesmo servindo só a depoimentos e
aos chips de produto: o Chrome busca a `@font-face` assim que existe um elemento
com aquela família no DOM, mesmo fora da tela. Não vale adiar sem trocar a
estratégia de fonte.

### Enquadramento da foto da fachada

No desktop o Figma usa um recorte manual: a imagem é escalada para 109,04% da
largura e deslocada −36,44% no topo, dentro de uma caixa de 531×741 com
`overflow: hidden`. Reproduzido literalmente.

Empilhado (≤1023px) esse retrato alto não funciona, então a caixa vira 4/3 com
`object-position: center 79%` — valor calculado para centralizar a placa da
loja, que é o assunto da foto.

### Baixados (sessões 04 e 05)

| Arquivo | Origem | Nota |
| --- | --- | --- |
| `icons/seal-check-solucoes.svg` | `3270:551` | 46px, versão `#0A410A` (a do hero é branca, 25px) |
| `icons/phone.svg` | `3270:622` | 40px, quadrado `#0A410A` + traço `#9AFF9A` |
| `icons/calculator.svg` | `3270:634` | idem |
| `icons/file-doc.svg` | `3270:654` | idem |
| `icons/currency-dollar.svg` | `3270:670` | idem |
| `img/como/shape-rect-5.svg` | `3270:608` | contorno 960×960, stroke 4px — usado 2× na seção |

### Baixados (sessões 06 e 07)

| Arquivo | Origem | Nota |
| --- | --- | --- |
| `img/brinde/brinde-fundo.webp` | `3270:1360` | 1942×809 → 1920×800; PNG 1601 KB → **56 KB** |
| `img/depoimentos/avatar-60.webp` | `3270:688` | avatar 2× (120px) |
| `img/depoimentos/avatar-72.webp` | `3270:714` | avatar 2× (144px) |
| `icons/star.svg` | `3270:693` | estrela `#FFA033` — o Figma exporta 3 cópias em tamanhos diferentes; uma só serve |
| `icons/chevron.svg` | `3270:749` | chevron `#5B5B5B`, rotacionado ±90° pelas setas |

### Baixados (sessão 09)

| Arquivo | Origem | Nota |
| --- | --- | --- |
| `icons/magnifying-glass.svg` | `3270:811` | 40px, mesma família dos ícones de passo |
| `icons/user.svg` | `3270:820` | idem |
| `icons/question.svg` | `3270:849` | idem |
| `icons/currency-dollar-o.svg` | `3270:859` | idem |
| `img/produtos/chip-baixa.svg` | `3270:834` | quadrado `#D5FA61` 58,95px + seta para baixo |
| `img/produtos/chip-alta.svg` | `3270:841` | idem, seta para cima |

---

## Template das seções de produto

`10-produto.css` serve às quatro seções (INSS, CLT, Servidor, Limpa Nome). A
estrutura é a mesma; o que muda vem de variáveis e de um slot:

- `--prod-bg` / `--prod-titulo` — INSS e Servidor são escuras, CLT e Limpa Nome
  usam `.prod--claro`.
- `.prod__arte` — slot da ilustração do card de destaque. No INSS são os dois
  chips de taxa; nas outras, mockups diferentes.

**Medidas do Figma reproduzidas no pixel:** seção 1351, conteúdo 879 em x=521,
cabeçalho 151, fileiras de cards 288 com gap 23, card de destaque 288, CTA em
y=1225,5.

**O card de destaque tem altura fixa e recorta o conteúdo.** É intencional no
Figma (`h-288` + clip content): a ilustração é maior que a área útil e sangra
nos dois eixos — 399 + 17 + 469 = 885 de largura contra 823 disponíveis, e os
dois chips somam 222,9 de altura contra 196. As fileiras de cards usam
`min-height: 288px` em vez de `height`, para o template aguentar os textos mais
longos dos outros três produtos.

**Uma divergência proposital:** o quarto card do Figma termina com uma segunda
linha escrita "Simular consignado INSS" — o texto do botão colado dentro do
card, aparentemente sobra de edição. Não foi reproduzido.

### O que varia entre os produtos

| | INSS | CLT |
| --- | --- | --- |
| Fundo | `#003511` | branco (`.prod--claro`) |
| Cards comuns | `#E5FEE5` | `#F5F9F8` |
| Card destaque | `#338E37`, texto claro | `#E5FEE5`, texto escuro |
| Respiro (`--prod-pad`) | 70px | 98px |
| Parágrafo do destaque | 355px | 399px (largura cheia) |
| Decorativos | contornos + glow | nenhum |
| Ilustração | chips de taxa | tablet | órbita de bancos |

*(Servidor: fundo escuro, respiro 110px, coluna de texto 371px, primeira
fileira com altura livre — 265px no Figma, não os 288 das outras.)*

### A órbita do Servidor

Cada logo fica na ponta de um **braço** — um ponto de tamanho zero no centro do
`$M` — deslocado pelo seu raio e contra-rotacionado para ficar em pé. Os raios,
calculados a partir das coordenadas do Figma, saem em 173,8 · 179,0 · 173,8 ·
165,6px: é uma órbita de verdade, não um arranjo solto. Assim, animar a rotação
do braço faz o satélite percorrer um arco real.

O posicionamento (`translate` + `rotate`) fica num elemento, a animação
(`scale`) em outro e o **hover** num terceiro — se dois deles escrevessem no
mesmo `transform`, um apagaria o outro.

### Quando a ilustração vira imagem e quando vira HTML

| Ilustração | Como | Por quê |
| --- | --- | --- |
| Chips de taxa (INSS) | HTML | as barras e as setas entram em ordem |
| Tablet (CLT) | HTML | a tela surge e as informações sobem uma a uma |
| Órbita (Servidor) | HTML | os bancos entram girando e têm hover |
| Conversa (Limpa Nome) | HTML + 2 selos em `.webp` | a conversa precisa acontecer em sequência; só os dois selos (WhatsApp e $M) continuam imagem |

**Os selos saem sem a moldura tracejada.** No Figma existe um retângulo pontilhado
em volta de cada selo (`3270:1224` e `3270:1230`) — o cliente pediu o ícone limpo,
então o export é do ícone em si (`3270:1228`) e o $M vem do grupo exportado à mão.

**Export do Figma pode vir com o fundo da página chapado atrás.** O selo do
WhatsApp veio com um quadrado opaco `#e5fde5` por trás, que aparecia por cima do
balão 1. O fundo foi removido tratando cada pixel proporcional a ele como sombra
(preto com alfa `1 − k`) e o resto como corpo do selo.

**A conversa foi desenhada girada 90° no Figma** — as coordenadas exportadas do
node `3270:1188` não servem para nada. Os valores reais (tamanhos dos balões,
cores, tipografia) saíram do `get_design_context`, e o enquadramento veio do
grupo `3270:1073`, que é exatamente **302 × 289**.

**O tablet do CLT é reconstruído em HTML**, não uma imagem: a tela precisa
surgir e as três informações subirem uma a uma dentro dela. São retângulos,
texto e quatro ícones — perfeitamente reproduzível.

As medidas do Figma viraram **`cqw`** (100cqw = 356,536px, a largura da
ilustração), com `container-type: inline-size` no contêiner. Assim o aparelho
inteiro escala junto com o card sem uma única media query. Conferido: no
desktop tudo bate com o Figma na casa decimal — aparelho 244,1 × 304,3, tela
190 × 145, chevron 8,8 × 5,4, ícone de info 11,1 × 11,1.

Dois detalhes que enganam:

- **A altura do contêiner não pode usar `cqw`.** Unidade de container não
  resolve contra o próprio container: caía no viewport e dava 1406px de altura.
  Resolvido com `aspect-ratio: 356.5 / 259`.
- **Cada ícone é desenhado *inset* dentro da sua caixa no Figma.** Usar o
  tamanho da caixa no `<img>` deixava os quatro ~20% maiores — o chevron ficava
  visivelmente grosso. Os valores corretos são os do `viewBox` de cada SVG.

A arte encosta na base do card com `align-self: flex-end` e margem negativa
para anular o padding. A proporção visível é 356,5 × 259 (não 288, que é a da
máscara) — o aparelho continua para baixo e é cortado pelo card.

**Uma substituição de fonte:** o cabeçalho do tablet usa Manrope no Figma. São
dois textos de 8 e 11px; usamos Inter (que já está no projeto) em vez de trazer
uma quarta família por 24 caracteres.

### Baixados (sessão 08) — logos dos bancos

Nove SVGs em `img/bancos/`, com as alturas do Figma aplicadas no CSS (a largura
vem da proporção do próprio SVG):

| Arquivo | Altura | Arquivo | Altura |
| --- | --- | --- | --- |
| `banco-do-brasil.svg` | 38,8px | `btg-pactual.svg` | 67,58px |
| `caixa.svg` | 36,9px | `bradesco.svg` | 37,41px |
| `itau.svg` | 69,6px | `nubank.svg` | 39,01px |
| `santander.svg` | 39,55px | `c6-bank.svg` | 33,38px |
| `inter.svg` | 41,34px | | |

**O logo da Caixa vem invertido.** O Figma exporta o SVG espelhado no eixo Y e
desvira no próprio nó com `rotate(180) scaleX(-1)`. Sem reproduzir isso ele
aparece de cabeça para baixo. Resolvido com uma variável `--flip: scaleY(-1)`,
que o hover compõe em vez de sobrescrever.

**Espaçamento da esteira:** o visual do Figma é 58px entre logos. Como cada
item tem 12px de padding de cada lado (para o mouse pegar o logo com folga), o
`gap` desconta esses 24px — 34px no desktop.

### Card lateral do carrossel

No Figma o card lateral é um desenho próprio: 305×306 com tipografia menor
(título 18px, texto 12px, avatar 60px) contra o central de 405×423 (24px/18px/
72px). As proporções não são uniformes — 0,753 na largura e 0,723 na altura.

Implementamos como **o card central reduzido por `scale(0.753)`**: a largura
visual bate exata (305px) e a transição do arraste fica contínua, que é o que
faz um carrossel desse tipo parecer certo. O custo é o texto lateral sair um
pouco maior que no Figma (13,6px em vez de 12px) e o card 12px mais alto.

---

## Card de informação: componente compartilhado

`.card-info` em `components.css`. As medidas do Figma são idênticas em
"Diferenciais" (`3270:441`) e "Soluções de crédito" (`3270:550`): padding
46/28, gap 19, gap interno 17, raio 10, título 26px, texto 18px. A única
variação é o ícone — 42px numa, 46px na outra — resolvida com `--icon-size`.

**Sem hover.** Nada de elevação ou sombra ao passar o mouse (decisão do
cliente).

## Grade de 12 colunas em "Soluções"

O Figma tem duas fileiras — 4 cards de 250px e 3 de 340px, ambas com 1060px e
gap 20. Num grid de 12 colunas isso fecha exato:

```
coluna = (1060 − 11×20) / 12 = 70px
span 3 = 3×70 + 2×20 = 250px   → fileira de 4
span 4 = 4×70 + 3×20 = 340px   → fileira de 3
```

Uma grade única em vez de duas fileiras separadas: colapsa melhor no
responsivo e mantém a medida do desktop no pixel.

## Peso Light que não temos

O numeral gigante de "Como funciona" usa **Helvetica Now Display Light** no
Figma. Só temos Regular e Bold licenciados. O CSS declara `font-weight: 300`:
o browser cai em Regular hoje e passa a usar Light automaticamente se o
arquivo for adicionado a `assets/fonts/`. A 18% de opacidade e 120px a
diferença é discreta.

### Decisão sobre os glows

O Figma exporta os dois glows como círculos com `feGaussianBlur` gigante
(2242px e 1214px de canvas). Reproduzimos com `radial-gradient` + `filter:
blur()` na classe `.deco--glow` — visualmente idêntico, muito mais leve e
animável em `transform` sem repintura.

Os quadrados arredondados com stroke e o blob sólido **continuam sendo os SVGs
exportados** — a geometria dos cantos é assimétrica e específica.

---

## Ícones

Todos os ícones do design são **Phosphor Icons** (linha e fill). Exportados do
Figma um a um, conforme cada sessão precisa, para `assets/icons/`. Não
redesenhamos ícone à mão.

Usados na página: `SealCheck`, `CalendarCheck`, `MagnifyingGlassMinus`,
`UserCheck`, `Gift`, `Phone`, `Calculator`, `FileDoc`, `CurrencyDollarSimple`,
`MagnifyingGlass`, `User`, `Question`, `CurrencyDollar`, `MapPin`,
`ArrowCircleDown`, `InstagramLogo`, `FacebookLogo`, `WhatsappLogo`, `star`,
`chevron-down`.
