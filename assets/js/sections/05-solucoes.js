/* ==========================================================================
   04 — SOLUÇÕES DE CRÉDITO
   Cabeçalho linha a linha; as duas fileiras entram em lotes separados, para
   a de 4 não disparar junto com a de 3.
   ========================================================================== */

SM.section("solucoes", (mm, anim) => {
  const section = document.querySelector(".sols");
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

      /* ---- cabeçalho ------------------------------------------------------ */
      anim.revealLines(q(".sols__title")[0], {
        trigger: section,
        start: "top 80%",
        stagger: 0.09,
      });

      gsap.to(q(".sols__lead"), {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.25,
        scrollTrigger: { trigger: section, start: "top 80%", toggleActions: SM.anim.ACOES },
      });

      /* ---- cards ---------------------------------------------------------- */
      // batch por fileira: assim a fileira de 4 não puxa a de 3 para o mesmo
      // stagger, e cada uma anima quando de fato aparece
      [".sols__item--quarto", ".sols__item--terco"].forEach((sel) => {
        const cards = q(sel);
        if (!cards.length) return;

        // batch não aceita `toggleActions`: a volta se faz com onLeaveBack
        ScrollTrigger.batch(cards, {
          start: "top 88%",
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: isMobile ? 0.07 : 0.09,
              overwrite: true,
            });

            gsap.from(
              batch.map((c) => c.querySelector(".card-info__icon")),
              {
                scale: 0.5,
                rotate: -12,
                opacity: 0,
                duration: 0.7,
                ease: "back.out(2)",
                stagger: isMobile ? 0.07 : 0.09,
                delay: 0.16,
              }
            );
          },
          onLeaveBack: (batch) => {
            gsap.to(batch, {
              opacity: 0,
              y: 40,
              duration: 0.4,
              ease: "power2.in",
              stagger: { each: 0.05, from: "end" },
              overwrite: true,
            });
            gsap.set(
              batch.map((c) => c.querySelector(".card-info__icon")),
              { clearProps: "all" }
            );
          },
        });
      });
    }
  );
});
