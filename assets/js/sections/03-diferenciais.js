/* ==========================================================================
   02 — DIFERENCIAIS
   Os 4 cards entram em lote com stagger; o ícone dá um pop logo depois.
   ========================================================================== */

SM.section("diferenciais", (mm, anim) => {
  const section = document.querySelector(".difs");
  if (!section) return;

  mm.add(
    {
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)",
      reduced: "(prefers-reduced-motion: reduce)",
    },
    (ctx) => {
      const { isMobile, reduced } = ctx.conditions;
      const cards = gsap.utils.toArray(".card-info", section);

      if (reduced) {
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      // ScrollTrigger.batch: os cards que entram na viewport na mesma janela
      // de tempo são animados juntos, com stagger — em vez de um trigger solto
      // por card, que dispara em momentos diferentes e quebra o ritmo.
      // batch não aceita `toggleActions` (é opção de animação, não de trigger):
      // a volta se faz com onLeaveBack.
      ScrollTrigger.batch(cards, {
        start: "top 88%",
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            stagger: isMobile ? 0.07 : 0.1,
            overwrite: true,
          });

          gsap.from(
            batch.map((c) => c.querySelector(".card-info__icon")),
            {
              scale: 0.4,
              opacity: 0,
              duration: 0.7,
              ease: "back.out(2.2)",
              stagger: isMobile ? 0.07 : 0.1,
              delay: 0.18,
            }
          );
        },
        // ao subir o scroll volta ao estado inicial, para reanimar na descida
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
    }
  );

  /* leve parallax da seção inteira contra o hero, só no desktop */
  mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
    anim.parallax(".difs__grid", { amount: 26, trigger: section, scrub: 0.8 });
  });
});
