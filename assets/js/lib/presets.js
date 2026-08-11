/* ==========================================================================
   PRESETS DE ANIMAÇÃO — reutilizados por todas as seções
   Expostos em window.SM.anim
   Regras seguidas (guia oficial GSAP):
     - ScrollTrigger só em tween/timeline de nível superior
     - scrub OU toggleActions, nunca os dois
     - só transform e opacity
   ========================================================================== */

(function () {
  "use strict";

  const SM = (window.SM = window.SM || {});

  /** Converte seletor|Element|NodeList em array de elementos. */
  const toArr = (t) => gsap.utils.toArray(t);

  /** Escala as distâncias no mobile — o mesmo deslocamento do desktop
   *  fica exagerado numa tela de 390px. */
  const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
  const dist = (v) => (isMobile() ? v * 0.6 : v);

  /**
   * Ações padrão de todo trigger de entrada.
   *
   * `toggleActions` em vez de `once: true` por dois motivos:
   *  1. o usuário quer que a animação volte ao subir o scroll;
   *  2. `once: true` mata o trigger depois de rodar, e um F5 no meio da página
   *     ficava sem ninguém para reavaliar o estado — os elementos apareciam
   *     invisíveis. Mantendo o trigger vivo, o ScrollTrigger acerta o estado
   *     sozinho no refresh, em qualquer posição de scroll.
   *
   * Ordem: onEnter, onLeave, onEnterBack, onLeaveBack.
   */
  const ACOES = "play none none reverse";

  const anim = {
    ACOES,

    /* ---- fade + deslocamento ------------------------------------------- */
    /**
     * @param {string|Element|Element[]} targets
     * @param {object} [o]  { y, x, delay, stagger, start, duration, once }
     */
    fadeUp(targets, o = {}) {
      const els = toArr(targets);
      if (!els.length) return null;

      return gsap.to(els, {
        opacity: 1,
        y: 0,
        x: 0,
        duration: o.duration ?? 0.9,
        ease: o.ease ?? "power3.out",
        delay: o.delay ?? 0,
        stagger: o.stagger ?? 0.09,
        clearProps: "willChange",
        scrollTrigger: {
          trigger: o.trigger ?? els[0],
          start: o.start ?? "top 85%",
          toggleActions: o.toggleActions ?? ACOES,
        },
      });
    },

    /* ---- revelação de título linha a linha ------------------------------ */
    /**
     * Divide o texto em linhas com SplitText e sobe cada uma de baixo de uma
     * máscara.
     *
     * Usa o padrão `autoSplit` + `onSplit` do GSAP 3.13+: se a fonte terminar
     * de carregar ou a largura mudar, o texto é redividido e a animação
     * recriada sozinha — sem quebra de linha errada nem tween órfão.
     */
    revealLines(target, o = {}) {
      const el = typeof target === "string" ? document.querySelector(target) : target;
      if (!el) return null;

      return SplitText.create(el, {
        type: "lines",
        linesClass: "sm-line",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { opacity: 1 });

          // devolver a animação faz o GSAP revertê-la antes de redividir
          return gsap.from(self.lines, {
            yPercent: 115,
            opacity: 0,
            duration: o.duration ?? 1,
            ease: o.ease ?? "expo.out",
            stagger: o.stagger ?? 0.09,
            delay: o.delay ?? 0,
            scrollTrigger:
              o.scroll === false
                ? undefined
                : {
                    trigger: o.trigger ?? el,
                    start: o.start ?? "top 85%",
                    toggleActions: o.toggleActions ?? ACOES,
                  },
          });
        },
      });
    },

    /* ---- grade de cards ------------------------------------------------- */
    /**
     * ScrollTrigger.batch: agrupa os cards que entram na viewport ao mesmo
     * tempo e anima o lote com stagger — melhor que um trigger por card.
     */
    batchReveal(targets, o = {}) {
      const els = toArr(targets);
      if (!els.length) return null;

      return ScrollTrigger.batch(els, {
        start: o.start ?? "top 88%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: o.duration ?? 0.85,
            ease: o.ease ?? "power3.out",
            stagger: o.stagger ?? 0.09,
            overwrite: true,
          }),
        // volta ao estado inicial ao subir o scroll, para reanimar na descida
        onLeaveBack: (batch) =>
          gsap.to(batch, {
            opacity: 0,
            y: 40,
            duration: 0.4,
            ease: "power2.in",
            stagger: { each: 0.05, from: "end" },
            overwrite: true,
          }),
      });
    },

    /* ---- parallax de scroll --------------------------------------------- */
    /**
     * Move o elemento no eixo Y conforme a seção atravessa a viewport.
     * amount > 0 = sobe mais devagar que a página (fica "para trás").
     */
    parallax(targets, o = {}) {
      const els = toArr(targets);
      if (!els.length) return null;

      const amount = dist(o.amount ?? 80);

      return gsap.to(els, {
        y: -amount,
        ease: "none",
        scrollTrigger: {
          trigger: o.trigger ?? els[0].closest(".section") ?? els[0],
          start: o.start ?? "top bottom",
          end: o.end ?? "bottom top",
          scrub: o.scrub ?? true,
          invalidateOnRefresh: true,
        },
      });
    },

    /* ---- contador numérico ---------------------------------------------- */
    /**
     * @param {Element} el   elemento cujo textContent vira o número
     * @param {object} o     { from, to, decimals, prefix, suffix }
     */
    counter(el, o = {}) {
      if (!el) return null;
      const obj = { v: o.from ?? 0 };
      const dec = o.decimals ?? 0;

      return gsap.to(obj, {
        v: o.to ?? 0,
        duration: o.duration ?? 1.4,
        ease: o.ease ?? "power2.out",
        snap: dec ? { v: 1 / Math.pow(10, dec) } : { v: 1 },
        onUpdate() {
          // separador decimal configurável: pt-BR usa vírgula, mas os chips de
          // taxa do Figma vêm com ponto ("-4.29%")
          el.textContent =
            (o.prefix ?? "") +
            obj.v.toFixed(dec).replace(".", o.separador ?? ",") +
            (o.suffix ?? "");
        },
        scrollTrigger: {
          trigger: o.trigger ?? el,
          start: o.start ?? "top 85%",
          toggleActions: o.toggleActions ?? ACOES,
        },
      });
    },

    /* ---- esteira infinita (marquee) -------------------------------------- */
    /**
     * O conteúdo precisa estar duplicado no HTML (2x a mesma lista).
     * Devolve o tween para modular o timeScale com a velocidade do scroll.
     */
    marquee(track, o = {}) {
      const el = typeof track === "string" ? document.querySelector(track) : track;
      if (!el) return null;

      return gsap.to(el, {
        xPercent: -50,
        ease: "none",
        duration: o.duration ?? 28,
        repeat: -1,
      });
    },

    /* ---- helpers --------------------------------------------------------- */
    toArr,
    dist,
    isMobile,
  };

  SM.anim = anim;
})();
