/* ==========================================================================
   06 — BRINDE
   Fundo com Ken Burns por scroll (escala reduz enquanto a seção atravessa a
   viewport) e conteúdo entrando por cima.
   ========================================================================== */

SM.section("brinde", (mm, anim) => {
  const section = document.querySelector(".brinde");
  if (!section) return;

  const q = gsap.utils.selector(section);

  mm.add(
    {
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)",
      reduced: "(prefers-reduced-motion: reduce)",
    },
    (ctx) => {
      const { isMobile, reduced } = ctx.conditions;

      if (reduced) {
        gsap.set(q("[data-anim]"), { opacity: 1, y: 0 });
        return;
      }

      /* ---- conteúdo -------------------------------------------------------- */
      anim.revealLines(q(".brinde__title")[0], {
        trigger: section,
        start: "top 76%",
      });

      gsap.to(q(".brinde__lead, .brinde__inner .btn"), {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.28,
        scrollTrigger: { trigger: section, start: "top 76%", toggleActions: SM.anim.ACOES },
      });

      /* ---- fundo: a imagem "assenta" no enquadramento do design ------------ */
      // Escala 1 = exatamente o object-fit: cover do Figma. Por isso a curva é
      // simétrica: parte ampliada, chega em 1 quando a seção está centralizada
      // na viewport (progresso 0.5) e volta a ampliar na saída. Um Ken Burns
      // monotônico (1.18 -> 1) deixaria a foto sempre mais fechada que o
      // design, menos no último pixel de scroll. Nunca desce abaixo de 1, então
      // não expõe as bordas.
      const zoom = isMobile ? 1.09 : 1.14;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          q(".brinde__bg img"),
          { scale: zoom },
          { scale: 1, ease: "none", duration: 1 }
        )
        .to(q(".brinde__bg img"), { scale: zoom, ease: "none", duration: 1 });
    }
  );
});
