/* ==========================================================================
   14 — FAQ
   Accordion com altura animada pelo GSAP (`height: auto` resolvido em runtime)
   mais a entrada em stagger dos itens.
   ========================================================================== */

SM.section("faq", (mm, anim) => {
  const section = document.querySelector(".faq");
  if (!section) return;

  const itens = gsap.utils.toArray(".faq__item", section);

  /* ---- Accordion ---------------------------------------------------------
     Fora do matchMedia de propósito: é interação, não animação de scroll —
     um refresh de matchMedia não pode derrubar o estado aberto/fechado.     */
  itens.forEach((item) => {
    const botao = item.querySelector(".faq__botao");
    const painel = item.querySelector(".faq__painel");
    if (!botao || !painel) return;

    // o estado inicial vem do HTML: o primeiro já nasce aberto
    gsap.set(painel, {
      height: botao.getAttribute("aria-expanded") === "true" ? "auto" : 0,
    });

    botao.addEventListener("click", () => {
      const aberto = botao.getAttribute("aria-expanded") === "true";

      // só um aberto por vez, como no Figma
      if (!aberto) {
        itens.forEach((outro) => {
          if (outro === item) return;
          const b = outro.querySelector(".faq__botao");
          if (b && b.getAttribute("aria-expanded") === "true") {
            b.setAttribute("aria-expanded", "false");
            gsap.to(outro.querySelector(".faq__painel"), {
              height: 0,
              duration: SM.reduceMotion ? 0 : 0.4,
              ease: "power2.inOut",
              overwrite: true,
            });
          }
        });
      }

      botao.setAttribute("aria-expanded", String(!aberto));
      gsap.to(painel, {
        // "auto" faz o GSAP medir a altura real e animar até ela
        height: aberto ? 0 : "auto",
        duration: SM.reduceMotion ? 0 : 0.45,
        ease: "power2.inOut",
        overwrite: true,
        onComplete: () => ScrollTrigger.refresh(),
      });
    });
  });

  /* ---- Entrada ------------------------------------------------------------ */
  mm.add(
    {
      isDesktop: "(min-width: 768px)",
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

      anim.revealLines(q(".faq__title")[0], {
        trigger: section,
        start: "top 78%",
      });

      gsap.fromTo(
        itens,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: isMobile ? 0.07 : 0.1,
          scrollTrigger: {
            trigger: q(".faq__lista")[0],
            start: "top 88%",
            toggleActions: SM.anim.ACOES,
          },
        }
      );
    }
  );
});
