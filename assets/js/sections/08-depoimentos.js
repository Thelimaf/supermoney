/* ==========================================================================
   07 — DEPOIMENTOS — carrossel
   O card do meio fica em destaque; os vizinhos encolhem para as laterais.
   Interações: arrastar, setas, pontos, clicar num card lateral, teclado.

   O estado é um índice **fracionário** (`estado.pos`). Isso é o que faz o
   arraste parecer contínuo: em vez de trocar de slide em degraus, a posição e
   a escala de cada card são interpoladas a partir da distância até o centro.
   Soltar o dedo só anima até o inteiro mais próximo.
   ========================================================================== */

SM.section("depoimentos", (mm, anim) => {
  const section = document.querySelector(".depo");
  if (!section) return;

  const viewport = section.querySelector(".depo__viewport");
  const cards = gsap.utils.toArray(".depo__card", section);
  const pontos = section.querySelector(".depo__pontos");
  const setaPrev = section.querySelector(".depo__seta--prev");
  const setaNext = section.querySelector(".depo__seta--next");
  const n = cards.length;
  if (!viewport || n === 0) return;

  /* ---- Pontos, gerados a partir da quantidade real de cards -------------- */
  pontos.innerHTML = "";
  const bolinhas = cards.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "depo__ponto";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", `Depoimento ${i + 1} de ${n}`);
    b.addEventListener("click", () => irPara(i));
    pontos.appendChild(b);
    return b;
  });

  /* ---- Medidas, lidas do CSS para não duplicar valores -------------------- */
  let larguraCard = 0;
  let escalaLado = 0.753;
  let passo = 0;

  function medir() {
    const cs = getComputedStyle(viewport);
    larguraCard = parseFloat(cs.getPropertyValue("--depo-card-w")) || cards[0].offsetWidth;
    if (!larguraCard || Number.isNaN(larguraCard)) larguraCard = cards[0].offsetWidth;
    larguraCard = cards[0].offsetWidth || larguraCard;
    escalaLado = parseFloat(cs.getPropertyValue("--depo-escala-lado")) || 0.753;
    const gap = parseFloat(cs.getPropertyValue("--depo-gap")) || 22.5;

    // distância entre o centro do card ativo e o centro do vizinho:
    // metade do vizinho (já reduzido) + gap + metade do ativo
    passo = (larguraCard * escalaLado) / 2 + gap + larguraCard / 2;

    // Abaixo do desktop a altura do card é `auto` (segue o texto). Como os
    // cards são absolutos, eles não dão altura à pista — então medimos o mais
    // alto e aplicamos. No desktop a altura vem do CSS (423px, do Figma).
    if (getComputedStyle(viewport).getPropertyValue("--depo-card-h").trim() === "auto") {
      viewport.style.height = Math.max(...cards.map((c) => c.offsetHeight)) + "px";
    } else {
      viewport.style.removeProperty("height");
    }
  }

  /* ---- Estado ------------------------------------------------------------- */
  const estado = { pos: 0 };

  /** distância assinada até o centro, pelo caminho mais curto (carrossel dá volta) */
  function distancia(i, pos) {
    let d = (((i - pos) % n) + n) % n; // 0 .. n
    if (d > n / 2) d -= n; // −n/2 .. n/2
    return d;
  }

  function desenhar() {
    cards.forEach((card, i) => {
      const d = distancia(i, estado.pos);
      const ad = Math.abs(d);

      // escala interpola linearmente: em ad = 1 chega exatamente em escalaLado
      const escala = Math.max(escalaLado - (ad - 1) * 0.14, 0.45);

      gsap.set(card, {
        x: d * passo,
        scale: ad <= 1 ? 1 - ad * (1 - escalaLado) : escala,
        zIndex: 100 - Math.round(ad * 10),
      });

      // esconder o card que saiu de cena é feito por CLASSE, não por opacity:
      // a opacity fica reservada para a animação de entrada da seção. Se as
      // duas coisas escrevessem na mesma propriedade, uma anulava a outra.
      card.classList.toggle("is-fora", ad > 1.55);
    });

    const ativo = ((Math.round(estado.pos) % n) + n) % n;
    cards.forEach((c, i) => c.classList.toggle("is-ativo", i === ativo));
    bolinhas.forEach((b, i) =>
      b.setAttribute("aria-current", String(i === ativo))
    );
    // só o depoimento em destaque fica na leitura sequencial
    cards.forEach((c, i) => c.toggleAttribute("aria-hidden", i !== ativo));
  }

  let tween = null;

  /** anima `estado.pos` até um destino já resolvido (pode ser fora de 0..n−1:
   *  `distancia()` normaliza na hora de desenhar, o que dá o giro infinito) */
  function animarPara(destino, duracao = 0.7) {
    tween && tween.kill();
    tween = gsap.to(estado, {
      pos: destino,
      duration: SM.reduceMotion ? 0 : duracao,
      ease: "power3.out",
      onUpdate: desenhar,
      onComplete: desenhar,
    });
  }

  /** centraliza o card `indice`, indo pelo caminho mais curto */
  function irPara(indice) {
    animarPara(estado.pos + distancia(indice, estado.pos));
  }

  /** avança/volta N posições a partir do slide atual */
  function andar(passos) {
    animarPara(Math.round(estado.pos) + passos);
  }

  /* ---- Controles ---------------------------------------------------------- */
  setaPrev.addEventListener("click", () => andar(-1));
  setaNext.addEventListener("click", () => andar(1));

  // clicar num card lateral traz ele para o centro
  cards.forEach((card, i) => {
    card.addEventListener("click", () => {
      if (!card.classList.contains("is-ativo")) irPara(i);
    });
  });

  // teclado: setas navegam quando o carrossel tem foco
  viewport.tabIndex = 0;
  viewport.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); andar(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); andar(1); }
  });

  /* ---- Arraste ------------------------------------------------------------ */
  let posAoPegar = 0;
  let xAoPegar = 0;
  let arrastou = false;

  /* O Draggable são 35 KB só para este carrossel, que fica a ~4.700px do topo.
     Carregar no boot atrasava o primeiro scroll no celular à toa — agora ele
     chega sob demanda, quando a seção se aproxima. Setas, pontos e teclado
     funcionam desde o início, então nada fica quebrado no meio do caminho. */
  function ligarArraste() {
    if (!window.Draggable) return;
    gsap.registerPlugin(Draggable);

    // o Draggable atua num proxy invisível: quem se move de fato são os cards,
    // cada um com sua própria escala — não há uma pista única para deslocar
    const proxy = document.createElement("div");

    Draggable.create(proxy, {
      type: "x",
      trigger: viewport,
      inertia: false,
      allowNativeTouchScrolling: true, // scroll vertical da página continua
      onPress() {
        posAoPegar = estado.pos;
        // guarda o x do proxy no início do gesto e trabalha com o DELTA.
        // Zerar o proxy aqui não funciona: o Draggable já capturou o x
        // anterior como referência antes do onPress rodar, e o gesto seguinte
        // acabava anulado (arrastar 264px para a direita dava delta 0).
        xAoPegar = this.x;
        arrastou = false;
        tween && tween.kill();
        viewport.classList.add("is-dragging");
        if (SM.lenis) SM.lenis.stop();
      },
      onDrag() {
        const delta = this.x - xAoPegar;
        if (Math.abs(delta) > 4) arrastou = true;
        estado.pos = posAoPegar - delta / passo;
        desenhar();
      },
      onRelease() {
        viewport.classList.remove("is-dragging");
        if (SM.lenis) SM.lenis.start();
        if (!arrastou) return;

        // encaixa no inteiro mais próximo: como `pos` é fracionário, arrastar
        // mais de meio passo já troca de slide — comportamento previsível,
        // sem depender de velocidade
        animarPara(Math.round(estado.pos), 0.55);
      },
    });

    // um clique que veio de arraste não deve centralizar o card
    viewport.addEventListener(
      "click",
      (e) => {
        if (arrastou) {
          e.stopPropagation();
          e.preventDefault();
        }
      },
      true
    );
  }

  ScrollTrigger.create({
    trigger: viewport,
    start: "top bottom+=800", // bem antes de aparecer, para chegar pronto
    once: true,
    onEnter: () => SM.carregarScript("vendor/Draggable.min.js").then(ligarArraste),
  });

  /* ---- Medidas e primeira pintura ---------------------------------------- */
  // fora do matchMedia: o carrossel não é dirigido por scroll, e o
  // ScrollTrigger.refresh() reverteria o contexto junto com o listener
  medir();
  desenhar();

  const aoRedimensionar = gsap.utils.pipe(() => {
    medir();
    desenhar();
  });
  window.addEventListener("resize", aoRedimensionar);
  if (document.fonts) document.fonts.ready.then(aoRedimensionar);

  /* ---- Entrada da seção ---------------------------------------------------
     Fora do matchMedia, como o hero: ScrollTrigger.refresh() reverte os
     contextos de matchMedia e um `.from()` de opacity em elemento sem estado
     inicial no CSS fica preso invisível (foi o que aconteceu com as setas).
     ------------------------------------------------------------------------ */
  if (!SM.reduceMotion) {
    anim.revealLines(section.querySelector(".depo__title"), {
      trigger: section,
      start: "top 78%",
    });

    const controles = section.querySelectorAll(".depo__controles > *");

    // O card do meio aparece primeiro e os vizinhos entram logo atrás.
    // A ordem vem da distância até o centro, não da ordem no DOM — o card
    // ativo pode ser qualquer um dos quatro.
    const porDistancia = [...cards].sort(
      (a, b) =>
        Math.abs(distancia(cards.indexOf(a), estado.pos)) -
        Math.abs(distancia(cards.indexOf(b), estado.pos))
    );
    const centro = porDistancia[0];
    const laterais = porDistancia.slice(1);

    gsap
      .timeline({
        scrollTrigger: { trigger: viewport, start: "top 85%", toggleActions: SM.anim.ACOES },
      })
      // só `y` na pista: a opacity dos cards é animada individualmente abaixo
      .from(viewport, { y: 40, duration: 0.9, ease: "power3.out" }, 0)

      // `fromTo` com o destino explícito, e não `from`.
      // O `.from()` lê o valor atual do elemento para descobrir onde TERMINAR.
      // Na hora em que a timeline é criada, o card que está fora de cena tem
      // `opacity: 0 !important` pela classe `.is-fora` — então o GSAP gravava
      // "de 0 até 0" e aquele card ficava com opacity inline 0 para sempre.
      // Ele reaparecia sem conteúdo ao chegar no centro: o buraco no carrossel.
      .fromTo(centro, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "power2.out" }, 0)
      .fromTo(
        laterais,
        { opacity: 0 },
        { opacity: 1, duration: 0.7, stagger: 0.09, ease: "power2.out" },
        0.22
      )
      .from(
        controles,
        { opacity: 0, y: 14, duration: 0.5, stagger: 0.08, ease: "power2.out" },
        0.4
      );
  }
});
