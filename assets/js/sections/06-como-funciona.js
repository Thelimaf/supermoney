/* ==========================================================================
   05 — COMO FUNCIONA
   Cards entram alternando esquerda/direita (é uma sequência de passos, não
   uma grade solta). Os numerais gigantes ganham parallax em velocidades
   diferentes, o que dá profundidade sem competir com o texto.
   ========================================================================== */

SM.section("como-funciona", (mm, anim) => {
  const section = document.querySelector(".como");
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
      const cards = q(".passo");

      if (reduced) {
        gsap.set(q("[data-anim]"), { opacity: 1, y: 0 });
        return;
      }

      /* ---- título --------------------------------------------------------- */
      anim.revealLines(q(".como__title")[0], {
        trigger: section,
        start: "top 78%",
      });

      /* ---- cards, em zigue-zague ------------------------------------------ */
      // o deslocamento horizontal inicial é aplicado de uma vez, antes do
      // timeline: um .to e um .from sobre o mesmo `x` brigariam entre si
      if (!isMobile) {
        cards.forEach((card, i) => gsap.set(card, { x: i % 2 === 0 ? -44 : 44 }));
      }

      cards.forEach((card) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 88%", toggleActions: SM.anim.ACOES },
        });

        tl.to(card, {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.85,
          ease: "power3.out",
        })
          .from(
            card.querySelector(".passo__badge"),
            { scale: 0.6, opacity: 0, duration: 0.5, ease: "back.out(2.4)" },
            0.18
          )
          .from(
            card.querySelector(".passo__icon"),
            { scale: 0.5, opacity: 0, duration: 0.55, ease: "back.out(2)" },
            0.28
          )
          .from(
            card.querySelector(".passo__num"),
            { opacity: 0, scale: 1.25, duration: 1.1, ease: "expo.out" },
            0.1
          );
      });

      /* ---- parallax dos numerais ------------------------------------------ */
      // cada numeral anda um pouco diferente: o olho lê como camadas
      const k = isMobile ? 0.45 : 1;
      q(".passo__num").forEach((num, i) => {
        gsap.to(num, {
          y: (24 + i * 9) * k,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
        });
      });

      /* ---- parallax dos contornos ----------------------------------------- */
      gsap.to(q(".como__frame--dir"), {
        y: -70 * k,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(q(".como__frame--esq"), {
        y: 60 * k,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });
    }
  );
});
