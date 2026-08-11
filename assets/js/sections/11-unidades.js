/* ==========================================================================
   13 — UNIDADES
   Título por linhas, os três cards entram em stagger, o pino cai com quique
   e os telefones aparecem um a um dentro de cada card.
   ========================================================================== */

SM.section("unidades", (mm, anim) => {
  const section = document.querySelector(".unidades");
  if (!section) return;

  mm.add(
    {
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)",
      reduced: "(prefers-reduced-motion: reduce)",
    },
    (ctx) => {
      const { isMobile, reduced } = ctx.conditions;
      const q = gsap.utils.selector(section);
      const cards = q(".unidade");

      if (reduced) {
        gsap.set(q("[data-anim]"), { opacity: 1, y: 0 });
        return;
      }

      anim.revealLines(q(".unidades__title")[0], {
        trigger: section,
        start: "top 78%",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: q(".unidades__grade")[0],
          start: "top 85%",
          toggleActions: SM.anim.ACOES,
        },
      });

      tl.fromTo(
        cards,
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: isMobile ? 0.08 : 0.12,
        }
      );

      /* O pino cai de cima e quica ao pousar — `back.out` alto dá o repique
         sem precisar de uma segunda tween. */
      tl.fromTo(
        q(".unidade__pino"),
        { opacity: 0, y: -26, scale: 0.7 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "back.out(3)",
          stagger: isMobile ? 0.08 : 0.12,
        },
        0.2
      );

      /* dentro de cada card os telefones sobem um a um, na ordem do DOM */
      cards.forEach((card, i) => {
        tl.fromTo(
          card.querySelectorAll(".unidade__fone"),
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.12 },
          0.55 + i * (isMobile ? 0.08 : 0.12)
        );
      });

      gsap.to(q(".unidades__corpo > .btn"), {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: q(".unidades__grade")[0],
          start: "bottom 92%",
          toggleActions: SM.anim.ACOES,
        },
      });
    }
  );
});
