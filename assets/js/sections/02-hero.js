/* ==========================================================================
   01 — HERO
   a) entrada: roda uma vez, assim que a página abre (está acima da dobra)
   b) saída: parallax em scrub — foto, blobs e texto em velocidades diferentes

   IMPORTANTE: a entrada NÃO fica dentro de gsap.matchMedia().
   ScrollTrigger.refresh() (disparado por window.load e por fonts.ready) reverte
   os contextos de matchMedia para remedir o layout — isso matava a timeline de
   entrada no meio e deixava transform inline preso no elemento. Só o que é
   ligado ao scroll vive dentro do matchMedia.
   ========================================================================== */

SM.section("hero", (mm, anim) => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const q = gsap.utils.selector(hero);

  /* ======================================================================
     a) Entrada — fora do matchMedia, roda uma vez
     ====================================================================== */
  if (!SM.reduceMotion) {
    const navBits = document.querySelectorAll(".nav__logo, .nav__link, .nav__cta");

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      delay: 0.15,
      // limpa o transform inline do nav no fim (os decorativos não: o
      // parallax escreve transform neles o tempo todo)
      onComplete() {
        gsap.set(navBits, { clearProps: "transform" });
      },
    });

    tl
      // decorativos primeiro: o palco se monta antes do texto
      .from(
        q(".hero__blob, .hero__frame"),
        { scale: 0.88, opacity: 0, duration: 1.4, stagger: 0.1, ease: "expo.out" },
        0
      )
      .from(q(".hero__glow"), { opacity: 0, duration: 1.6 }, 0)

      // nav
      .from(navBits, { y: -18, opacity: 0, duration: 0.7, stagger: 0.05 }, 0.1)

      // foto sobe e revela
      .from(
        q(".hero__photo"),
        { yPercent: 7, scale: 1.05, opacity: 0, duration: 1.5, ease: "expo.out" },
        0.35
      )

      // copy (estado inicial vem do CSS via [data-anim])
      .to(q(".hero__lead"), { opacity: 1, y: 0, duration: 0.9 }, 0.75)
      .to(q(".hero__actions .btn"), { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.9)
      .to(q(".hero__badge"), { opacity: 1, y: 0, duration: 0.6, stagger: 0.07 }, 1.05);

    // título linha a linha — SplitText redivide sozinho quando a fonte carrega
    anim.revealLines(q(".hero__title")[0], {
      scroll: false,
      delay: 0.45,
      stagger: 0.1,
      duration: 1.1,
    });
  }

  /* ======================================================================
     b) Saída no scroll — parallax
     Um único timeline com scrub para tudo, em vez de vários triggers.
     ====================================================================== */
  mm.add(
    {
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)",
      reduced: "(prefers-reduced-motion: reduce)",
    },
    (ctx) => {
      const { isMobile, reduced } = ctx.conditions;
      if (reduced) return;

      const k = isMobile ? 0.5 : 1; // no mobile, metade da amplitude

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          // 0.6 deixava tudo escorregando por mais de meio segundo depois de
          // parar a roda — somado à suavização do Lenis, a saída do hero
          // parecia lenta. 0.25 acompanha o dedo sem perder a maciez.
          scrub: 0.25,
          invalidateOnRefresh: true,
        },
      });

      tl.to(q(".hero__inner"), { y: -70 * k, opacity: 0.25, ease: "none" }, 0)
        /* A foto CRESCE em vez de subir: com `transform-origin: bottom` a
           borda de baixo fica colada no rodapé do hero, então o recorte
           nunca aparece como uma linha reta no meio do braço. */
        .to(q(".hero__photo"), { scale: 1 + 0.07 * k, ease: "none" }, 0)
        .to(q(".hero__blob"), { y: -55 * k, ease: "none" }, 0)
        .to(q(".hero__frame--right"), { y: 90 * k, ease: "none" }, 0)
        .to(q(".hero__frame--left"), { y: 50 * k, ease: "none" }, 0)
        .to(q(".hero__glow--big"), { y: 130 * k, ease: "none" }, 0)
        .to(q(".hero__glow--small"), { y: -60 * k, ease: "none" }, 0);
    }
  );
});
