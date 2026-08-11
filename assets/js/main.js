/* ==========================================================================
   MAIN — inicialização global
   Ordem de carga no HTML:
     vendor/gsap → ScrollTrigger → SplitText → DrawSVGPlugin → lenis
     → lib/presets.js → main.js → sections/*.js
   ========================================================================== */

(function () {
  "use strict";

  const SM = (window.SM = window.SM || {});

  /* ---- 1. Plugins (uma vez só, antes de tudo) ---------------------------- */
  const plugins = [ScrollTrigger, SplitText];
  // Draggable só é usado pelo carrossel de depoimentos.
  // DrawSVGPlugin e InertiaPlugin ficaram fora da página: nenhuma seção os usa
  // (o carrossel arrasta com `inertia: false`). Os arquivos continuam em
  // vendor/ — para religar, basta devolver as duas tags no index.html.
  if (window.Draggable) plugins.push(Draggable);
  gsap.registerPlugin(...plugins);

  gsap.defaults({ ease: "power3.out", duration: 0.9 });

  /* ---- 2. Preferência de movimento reduzido ------------------------------ */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  SM.reduceMotion = reduceMotion;

  /* ---- 3. Smooth scroll (Lenis) ------------------------------------------ */
  /* Lenis 1.x usa scroll nativo com interceptação de wheel, então position:
     fixed (nav) continua funcionando sem wrapper nem scrollerProxy.          */
  if (!reduceMotion) {
    const lenis = new Lenis({
      // 1.1 deixava um rastro longo demais: a página continuava andando bem
      // depois de parar a roda, e isso lia como "lentidão" na saída do hero.
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false, // no touch, o scroll nativo do SO é melhor
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    SM.lenis = lenis;
  }

  /* ---- 4. Âncoras internas ----------------------------------------------- */
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute("href");
    if (!id || id === "#") return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();

    if (SM.lenis) {
      SM.lenis.scrollTo(target, { offset: -80, duration: 1.2 });
    } else {
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }
  });

  /* ---- 5. Registro de seções --------------------------------------------- */
  /* Cada arquivo em js/sections/ chama SM.section('nome', fn). As funções são
     executadas na ordem de registro — que é a ordem da página — para que os
     ScrollTriggers nasçam de cima para baixo, como o GSAP recomenda.         */
  SM._sections = [];
  SM.section = function (name, fn) {
    SM._sections.push({ name, fn });
  };

  SM.init = function () {
    SM.mm = gsap.matchMedia();

    SM._sections.forEach(({ name, fn }) => {
      try {
        fn(SM.mm, SM.anim);
      } catch (err) {
        console.error(`[SM] falha ao iniciar a seção "${name}"`, err);
      }
    });
  };

  /* ---- 6. Boot ------------------------------------------------------------ */
  /* Fontes e imagens mudam a altura da página, então o refresh vem depois.    */
  window.addEventListener("DOMContentLoaded", () => {
    SM.init();
  });

  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });

  if (document.fonts) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
})();
