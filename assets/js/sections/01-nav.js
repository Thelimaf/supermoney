/* ==========================================================================
   01 — NAVEGAÇÃO
   - fica sólida depois de 100px de scroll
   - menu full-screen no mobile
   ========================================================================== */

SM.section("nav", (mm) => {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  /* ---- Estado "colado" ---------------------------------------------------- */
  ScrollTrigger.create({
    start: "top -100",
    end: 99999,
    toggleClass: { targets: nav, className: "is-stuck" },
  });

  /* ---- Menu mobile -------------------------------------------------------- */
  mm.add("(max-width: 1023px)", () => {
    const toggle = nav.querySelector(".nav__toggle");
    const panel = nav.querySelector(".nav__panel");
    const items = nav.querySelectorAll(".nav__link, .nav__cta");
    if (!toggle || !panel) return;

    /* O painel só volta a ficar `hidden` quando a animação de saída TERMINA —
       senão ele desaparece no primeiro frame e o fechamento não é visto. */
    const tl = gsap
      .timeline({
        paused: true,
        onReverseComplete: () => gsap.set(panel, { visibility: "hidden" }),
      })
      .to(panel, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.6,
        ease: "expo.out",
      })
      .from(
        items,
        { y: 28, opacity: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" },
        "-=0.35"
      );

    let open = false;

    const setOpen = (next) => {
      open = next;
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("has-menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");

      if (SM.lenis) open ? SM.lenis.stop() : SM.lenis.start();

      if (open) {
        gsap.set(panel, { visibility: "visible" });
        tl.play();
      } else {
        tl.reverse();
      }
    };

    const onToggle = () => setOpen(!open);
    const onLinkClick = () => open && setOpen(false);
    const onKey = (e) => e.key === "Escape" && open && setOpen(false);

    toggle.addEventListener("click", onToggle);
    panel.addEventListener("click", (e) => {
      if (e.target.closest("a")) onLinkClick();
    });
    document.addEventListener("keydown", onKey);

    // matchMedia cleanup: ao sair do breakpoint, desfaz tudo
    return () => {
      toggle.removeEventListener("click", onToggle);
      document.removeEventListener("keydown", onKey);
      nav.classList.remove("is-open");
      document.body.classList.remove("has-menu-open");
      if (SM.lenis) SM.lenis.start();
      tl.kill();
      gsap.set(panel, { clearProps: "clipPath,visibility" });
      gsap.set(items, { clearProps: "all" });
    };
  });
});
