# Animações — Super Money

Mapa de qual animação pertence a qual seção. Atualizado a cada sessão aprovada,
para sabermos onde mexer sem caçar código.

**Stack:** GSAP 3.15 + ScrollTrigger + SplitText + Draggable + Lenis
(smooth scroll). Tudo local em `vendor/`, nada de CDN em runtime.

`DrawSVGPlugin` e `InertiaPlugin` estão em `vendor/` mas **fora da página**:
nenhuma seção os usa (o carrossel arrasta com `inertia: false`). Para religar,
basta devolver as duas tags no `index.html`.

---

## Arquitetura

```
vendor/gsap → ScrollTrigger → SplitText → DrawSVGPlugin → lenis
  ↓
assets/js/lib/presets.js   window.SM.anim.*  (presets reutilizáveis)
  ↓
assets/js/main.js          registra plugins, Lenis, âncoras, SM.section()
  ↓
assets/js/sections/*.js    cada seção chama SM.section('nome', fn)
```

Cada seção se registra com:

```js
SM.section("hero", (mm, anim) => {
  mm.add("(min-width: 768px)", () => { /* desktop e tablet */ });
  mm.add("(max-width: 767px)", () => { /* mobile */ });
});
```

`SM.init()` roda as seções **na ordem de registro**, que é a ordem da página —
assim os ScrollTriggers nascem de cima para baixo, como o GSAP recomenda.

## Regras que valem para todas as seções

- `gsap.registerPlugin()` uma única vez, em `main.js`.
- ScrollTrigger só em **timeline ou tween de nível superior** — nunca num tween
  filho de timeline.
- **`scrub` OU `toggleActions`**, nunca os dois no mesmo trigger.
- Animar só **`transform` e `opacity`**.
- Estado inicial vem do **CSS** (`[data-anim="fade-up"]` em `base.css`), sob a
  classe `.js` — se o JS falhar, nada fica invisível.
- `ScrollTrigger.refresh()` depois de `document.fonts.ready` e de `window.load`.
- `markers: true` só durante o desenvolvimento; removido antes de entregar.
- **Toda animação de entrada é reversível.** Usamos
  `toggleActions: "play none none reverse"` (exposto em `SM.anim.ACOES`), nunca
  `once: true`. Nos `ScrollTrigger.batch` — que não aceitam `toggleActions` — a
  volta é feita no `onLeaveBack`.
- `prefers-reduced-motion: reduce` → Lenis desligado e todo `[data-anim]`
  forçado ao estado final pelo CSS.

## Por que não usamos `once: true`

Dois motivos, e o segundo era um bug de verdade:

1. **A animação precisa voltar** quando o usuário sobe o scroll, e reanimar na
   descida.
2. **`once: true` mata o trigger depois de rodar.** Num F5 no meio da página o
   navegador restaura o scroll, mas não sobrava ninguém para reavaliar o estado
   — os elementos ficavam invisíveis. Era isso que fazia o banner do brinde e o
   carrossel desaparecerem ao recarregar. Com o trigger vivo, o
   `ScrollTrigger.refresh()` acerta o estado sozinho em qualquer posição.

## Armadilha já encontrada (não repetir)

**Animação de entrada não pode viver dentro de `gsap.matchMedia()`.**
`ScrollTrigger.refresh()` — que `main.js` dispara em `window.load` e em
`document.fonts.ready` — reverte os contextos de matchMedia para remedir o
layout. Isso matava a timeline de entrada do hero no meio do caminho e deixava
um `transform: translateY(-16.6px)` inline preso no logo e nos links do nav.

Regra: **entrada** = timeline solta, guardada por `if (!SM.reduceMotion)`, com
`clearProps` no `onComplete`. **Scroll** = dentro do `matchMedia`.

**Não misturar `.to` e `.from` na mesma propriedade do mesmo alvo.** Em "Como
funciona" um `.to(card, {x: 0})` junto de um `.from(card, {x: -44})` na posição
0 brigavam pelo mesmo `x`. O deslocamento inicial passou a ser aplicado de uma
vez com `gsap.set()` antes do timeline.

**Cuidado com `transform` no CSS de elemento que o GSAP também anima.** O
numeral tinha `translateX(-50%)` no CSS; o GSAP decompõe isso em pixels e o
valor congela num resize. Trocado por alinhamento à direita, sem transform.

**Nem `transition` de CSS na propriedade que o GSAP anima.** As setas do
carrossel tinham `transition: opacity` (para o hover) e o `.from({opacity})` da
entrada disputava com ela — as setas ficaram invisíveis. A transition agora só
cobre `transform`.

**`.from()` lê o valor atual para saber onde TERMINAR — cuidado com o que ele
lê.** No carrossel, o card que estava fora de cena tinha `opacity: 0 !important`
pela classe `.is-fora` no instante em que a timeline foi criada. O `.from()`
gravou "de 0 até 0" e aquele card ficou com `opacity` inline 0 para sempre —
aparecia como um **buraco no meio do carrossel** ao chegar no centro. Onde o
valor final importa, usar `fromTo()` com o destino explícito.

**Elemento com `[data-anim]` que ninguém anima fica preso invisível.** O CTA
das seções de produto tinha o atributo mas não estava em nenhum tween — ficaria
com `opacity: 0` e 40px fora do lugar. Ao marcar um elemento com `data-anim`,
garanta que existe um tween para ele.

**Gatilho no fim de uma seção que termina a página nunca dispara.** O CTA do
INSS estava com `trigger` nele mesmo e `start: "top 92%"`: no scroll máximo ele
parava 10px abaixo da linha de disparo, porque não havia mais página para
rolar. O gatilho passou a ser o fim da grade de cards.

**Controle pequeno que escala no hover foge do clique.** As setas tinham 25px e
o `:hover` aplicava `scale` no próprio botão: a caixa crescia debaixo do cursor
e o primeiro clique escapava. O scale foi para o ícone (a caixa não se move) e a
área de clique subiu para 49px com um `::before` de `inset: -12px`, sem alterar
o layout. Mesmo tratamento nos pontos, que tinham 10px.

**Especificidade empatada perde por ordem no arquivo — duas vezes.** A coluna de texto
estreita do Servidor era um modificador de classe simples
(`.prod__destaque-texto--estreito`) declarado ANTES da classe base — empatava em
especificidade e perdia, deixando 399px em vez de 371 e empurrando a órbita
inteira 28px para a direita. Escopado em `#servidor`.

**Duas coisas não podem escrever na mesma propriedade.** No carrossel o
`desenhar()` controlava `opacity` para esconder o card fora de cena e a
animação de entrada também animava `opacity` — uma anulava a outra. Esconder
passou a ser feito por classe (`.is-fora`), deixando a `opacity` livre para o
GSAP.

**`filter: blur()` grande é o que trava o celular.** Os dois glows do hero eram
discos sólidos com `filter: blur(σ)`. No mobile o σ vira 119px, e a gaussiana
exige uma superfície de ~1089² por glow — quase 2 Mpx em DPR 1 e ~18 Mpx num
celular DPR 3, paga antes do primeiro paint. Era isso que fazia o hero demorar
e engasgar. Hoje são **radial-gradients calibrados**: o perfil radial do disco
borrado foi integrado numericamente e amostrado em 11 raios. Diferença contra o
`filter` original: **0,27 de 255 em média, pior pixel 3** — mesma imagem, custo
zero. A técnica já era usada em "Como funciona"; faltava trazê-la para o hero.

**Plugin que serve a uma seção só não precisa estar no boot.** O `Draggable`
são 35 KB e só existe para o carrossel de depoimentos, a 4.700px do topo. Agora
ele é buscado por `SM.carregarScript()` num `ScrollTrigger` com
`start: "top bottom+=800"`. Setas, pontos e teclado já funcionam antes disso, e
o `if (window.Draggable)` virou uma função chamada depois da carga.

**`ScrollTrigger.config({ ignoreMobileResize: true })`.** No celular, recolher a
barra de endereço muda a altura da viewport e dispara um refresh dos 70
gatilhos (31ms cada num aparelho lento). Sem isso, os primeiros scrolls
engasgam.

**`backdrop-filter` vira bloco contêiner de `position: fixed`.** O `.nav` ganhava
`backdrop-filter: blur(14px)` ao colar no topo. A partir daí o painel do menu
mobile (`fixed; inset: 0`) parava de medir a viewport e passava a medir a caixa
da barra: encolhia de 405×850 para 405×251, não cobria a tela e os cliques nos
links caíam na hero, que ficava por cima. O blur foi para um `.nav::before`
com `opacity` — o `.nav` voltou a ser um elemento comum.

**Esconder por classe mata a animação de saída.** `.nav.is-open .nav__panel {
visibility: visible }` aplicava `hidden` no primeiro frame do fechamento, então
o `tl.reverse()` de 0,6s rodava invisível — o menu simplesmente sumia. A
`visibility` passou para o GSAP: `visible` antes do `play()`, `hidden` no
`onReverseComplete`.

**Recorte de pessoa não pode ser levantado por transform.** A foto do hero é um
PNG que termina nos punhos e sangra só 32px abaixo da seção. O parallax de saída
subia 110px — a borda do recorte entrava na tela e virava uma linha reta no meio
do braço, com um vão verde entre ela e o rodapé do hero. A foto passou a
**crescer** (`scale 1 → 1.07`) com `transform-origin: bottom center`: a base fica
presa no rodapé em qualquer posição do scroll. Regra geral: em recorte com borda
dura, ancorar a origem no lado cortado e nunca traduzir para longe dele.

**`scrub` alto + Lenis longo somam atraso.** `scrub: 0.6` com `duration: 1.1` no
Lenis fazia o hero continuar escorregando mais de meio segundo depois de parar a
roda — lia como travamento, não como suavidade. Hoje são `scrub: 0.25` e
`duration: 0.85`.

**Ilustração que é cortada pela moldura precisa ser MAIOR que ela.** O aparelho
do Limpa Nome tinha exatamente a altura do quadro, e o resultado era a base
arredondada aparecendo — no Figma o celular continua para baixo e é cortado.
Altura passou a 100cqw, acima dos 95,7cqw do quadro.

**Interação não mora dentro do `matchMedia`.** O accordion do FAQ é clique, não
scroll: se o listener e o estado vivessem num contexto de matchMedia, um
`ScrollTrigger.refresh()` reverteria o contexto e o item aberto fecharia sozinho.
Só a animação de ENTRADA da seção está no matchMedia.

**Accordion muda a altura da página — precisa avisar o ScrollTrigger.** Sem o
`ScrollTrigger.refresh()` no `onComplete`, todos os gatilhos abaixo do FAQ ficam
com a posição antiga depois de abrir ou fechar uma pergunta.

**O proxy do Draggable acumula posição entre gestos.** Usar `this.x` como valor
absoluto fazia o segundo arraste ser anulado (o Draggable captura o x anterior
como referência antes do `onPress` rodar, então zerar o proxy ali não resolve).
Guardar `xAoPegar = this.x` no `onPress` e trabalhar com o **delta**.

## Presets disponíveis (`SM.anim`)

| Preset | O que faz |
| --- | --- |
| `fadeUp(sel, o)` | y 40 → 0 + opacity, `power3.out`, trigger `top 85%`, `once` |
| `revealLines(el, o)` | SplitText por linha com máscara, sobe `yPercent 115 → 0` |
| `batchReveal(sel, o)` | `ScrollTrigger.batch` com stagger — para grades de cards |
| `parallax(sel, o)` | y em `scrub` entre `top bottom` e `bottom top` |
| `counter(el, o)` | contagem numérica com `snap`, formato pt-BR |
| `marquee(track, o)` | esteira infinita `xPercent -50`, `repeat: -1`, `ease: none` |

> **Botões não seguem o cursor.** O preset `magneticHover` foi removido a
> pedido: botão que se desloca sob o ponteiro atrapalha o clique. Hover de
> botão = só o `translateY(-2px)` e o brilho que varre, ambos em CSS.

Distâncias caem para **60%** no mobile automaticamente (`SM.anim.dist`).

---

## Mapa por seção

| # | Seção | Animação | Estado |
| --- | --- | --- | --- |
| 01 | Nav | fixo; transparente → sólido com blur após 100px (`toggleClass`); underline crescendo do centro; menu full-screen com `clipPath` + stagger no mobile; trava o scroll do Lenis com o menu aberto | ✅ |
| 01 | Hero | **entrada:** decorativos `scale 0.88→1` → nav fade-down → foto `scale 1.05→1` + `yPercent 7→0` → H1 `revealLines` → lead → botões → badges. **saída no scroll (scrub 0.6):** texto `y -70` + opacidade 0.25, foto `y -110`, blob `y -55`, contornos `y +90/+50`, glows `y +130/-60` | ✅ |
| 02 | Diferenciais | `ScrollTrigger.batch` — cards y 40→0 com stagger 0.1, `once`; ícone com `back.out(2.2)` atrasado em 0.18s; parallax de 26px na grade (só desktop); hover lift -6px | ✅ |
| 03 | Sobre | card sobe (`y 56→0`); foto revela com `clip-path inset(0 0 100%→0)` em `expo.out` enquanto a imagem interna relaxa de `scale 1.18→1`; título `revealLines`; lead e botão em sequência. Scroll: foto `y -46` (scrub 0.8) e contorno `y +70` (scrub 1) | ✅ |
| 04 | Soluções | título `revealLines` + lead; `ScrollTrigger.batch` **por fileira** (a de 4 não puxa a de 3 para o mesmo stagger); ícone com `back.out(2)` e rotate −12° | ✅ |
| 05 | Como funciona | título `revealLines`; cards em zigue-zague (`x ∓44`, ímpares da esquerda, pares da direita); badge e ícone com `back.out`; numeral entra de `scale 1.25` em `expo.out`; parallax dos 4 numerais em velocidades escalonadas (24 + i×9 px) e dos contornos | ✅ |
| 06 | Brinde | título `revealLines` + lead e botão em stagger; fundo com Ken Burns **simétrico** por scroll: `scale 1.14 → 1 → 1.14`, chegando em 1 (o enquadramento exato do Figma) quando a seção está centralizada na viewport | ✅ |
| 07 | Depoimentos | carrossel de índice **fracionário**: arraste contínuo (Draggable), setas, pontos, clique no card lateral e setas do teclado; giro infinito nos dois sentidos; solta encaixando no inteiro mais próximo. **Entrada: o card do meio aparece primeiro e os laterais entram 0,22s depois** (a ordem vem da distância ao centro, não do DOM) | ✅ |
| 08 | Bancos | esteira infinita a **58 px/s constantes** (duração calculada da largura medida, não fixa — mesmo ritmo em qualquer tela); desacelera para `timeScale 0.18` com o mouse na faixa; cada logo com `scale(1.12)` suave no hover; pausa quando sai da viewport | ✅ |
| 09 | INSS | título `revealLines` + lead; fileiras de cards com stagger e ícone em `back.out`; card de destaque sobe. Nos chips a ordem é **informação → barras com o texto → seta para baixo → seta para cima** (o ícone é animado separado da barra que o contém), com os percentuais contando de 0 até −4.29% e +7.13% | ✅ |
| 10 | CLT | mesmo template do INSS, mais o tablet: **a tela surge primeiro** (`scale 0.94→1` + `y 26→0`) e só depois as três informações **sobem uma a uma** dentro dela (stagger 0.16) | ✅ |
| 11 | Servidor | mesmo template; o `$M` surge e então **cada banco sai girando do centro** até sua posição — o braço varre ~165° de arco enquanto o logo cresce de `scale 0.15` em `back.out`, com 0,14s entre um e outro. No hover cada logo sobe 7px e cresce 10% | ✅ |
| 12 | Limpa Nome | mesmo template; a conversa é **remontada em HTML** e simula o atendimento acontecendo: o aparelho surge (0,15s), o **nome do contato** aparece (0,55s), as mensagens **estouram uma a uma** como pop-up de chat (`back.out(1.8)`, 0,42s entre a pergunta e a resposta) e os dois selos caem girando por último (1,75s) | ✅ |
| 13 | Unidades | título `revealLines`; os 3 cards sobem em stagger (0,12s); o **pino cai de cima e quica** (`y -26 → 0` + `scale 0.7 → 1` em `back.out(3)`, sem tween extra para o repique); dentro de cada card os telefones sobem um a um; CTA ancorado no fim da grade | ✅ |
| 14 | FAQ | itens entram em stagger (0,1s) após o título por linhas; accordion com `height: "auto"` do GSAP (0,45s, `power2.inOut`), **um aberto por vez**; a seta gira 180° e vira verde por CSS | ✅ |
| 15 | Rodapé | a marca sobe primeiro, os links das duas colunas entram em stagger de 0,06s e o filete do copyright aparece por último | ✅ |

Legenda: ⏳ pendente · 🔨 em andamento · ✅ aprovado
