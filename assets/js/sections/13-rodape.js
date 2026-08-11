/* ==========================================================================
   15 — RODAPÉ
   Entrada suave: a marca sobe primeiro, depois as colunas e o filete.
   ========================================================================== */

SM.section("rodape", (mm, anim) => {
  const section = document.querySelector(".rodape");
  if (!section) return;

  mm.add(
    {
      isMobile: "(max-width: 767px)",
      reduced: "(prefers-reduced-motion: reduce)",
    },
    (ctx) => {
      const { isMobile, reduced } = ctx.conditions;
      const q = gsap.utils.selector(section);

      if (reduced) {
        gsap.set(q("[data-anim]"), { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          // o rodapé encerra a página: o gatilho é alto para dar tempo de rodar
          start: "top 92%",
          toggleActions: SM.anim.ACOES,
        },
      });

      tl.fromTo(
        q(".rodape__marca"),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(
          q(".rodape__nav .rodape__link, .rodape__redes .rodape__link"),
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: isMobile ? 0.04 : 0.06,
          },
          0.2
        )
        .fromTo(
          q(".rodape__base"),
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: "power2.out" },
          0.6
        );
    }
  );
});
