/* ==========================================================================
   03 — SOBRE
   Card verde sobe, título linha a linha, foto revela de baixo para cima com
   a imagem interna reduzindo a escala. No scroll, a foto e o contorno seguem
   em velocidades diferentes.
   ========================================================================== */

SM.section("sobre", (mm, anim) => {
  const section = document.querySelector(".sobre");
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
        gsap.set(q(".sobre__photo"), { clipPath: "none" });
        return;
      }

      /* ---- entrada ------------------------------------------------------- */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          toggleActions: SM.anim.ACOES,
        },
      });

      tl.from(q(".sobre__card"), {
        y: 56,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
        // a máscara abre de baixo para cima enquanto a imagem interna
        // relaxa a escala — dá sensação de profundidade
        .to(
          q(".sobre__photo"),
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.25,
            ease: "expo.out",
          },
          0.15
        )
        .from(
          q(".sobre__photo img"),
          { scale: 1.18, duration: 1.6, ease: "expo.out" },
          0.15
        )
        .to(q(".sobre__lead"), { opacity: 1, y: 0, duration: 0.9 }, 0.5)
        .to(q(".sobre__text .btn"), { opacity: 1, y: 0, duration: 0.7 }, 0.65);

      anim.revealLines(q(".sobre__title")[0], {
        trigger: section,
        start: "top 72%",
        stagger: 0.09,
      });

      /* ---- parallax de scroll -------------------------------------------- */
      const k = isMobile ? 0.5 : 1;

      gsap.to(q(".sobre__photo img"), {
        y: -46 * k,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(q(".sobre__frame"), {
        y: 70 * k,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }
  );
});
