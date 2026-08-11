/* ==========================================================================
   08 — BANCOS PARCEIROS
   Esteira infinita. A velocidade é constante em pixels por segundo, e não uma
   duração fixa: assim o ritmo é o mesmo em qualquer largura de tela.
   Ao passar o mouse na esteira ela desacelera, para dar tempo de olhar o logo
   sob o cursor (que recebe o scale pelo CSS).
   ========================================================================== */

SM.section("bancos", (mm, anim) => {
  const section = document.querySelector(".bancos");
  if (!section) return;

  const esteira = section.querySelector(".bancos__esteira");
  const track = section.querySelector(".bancos__track");
  if (!track) return;

  /* ---- Cabeçalho ---------------------------------------------------------- */
  if (!SM.reduceMotion) {
    anim.revealLines(section.querySelector(".bancos__title"), {
      trigger: section,
      start: "top 82%",
    });

    gsap.to(section.querySelector(".bancos__lead"), {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.22,
      scrollTrigger: { trigger: section, start: "top 82%", toggleActions: SM.anim.ACOES },
    });
  }

  /* ---- Esteira ------------------------------------------------------------ */
  // Com movimento reduzido a lista fica parada e rolável na horizontal.
  if (SM.reduceMotion) {
    esteira.style.overflowX = "auto";
    return;
  }

  const VELOCIDADE = 58; // px por segundo

  let loop = null;

  function montar() {
    loop && loop.kill();
    gsap.set(track, { xPercent: 0 });

    // metade da pista = uma cópia da lista; é o quanto precisa andar
    const metade = track.scrollWidth / 2;
    if (!metade) return;

    loop = gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration: metade / VELOCIDADE,
      repeat: -1,
    });
  }

  montar();

  // as larguras mudam com o breakpoint e com a fonte carregada
  const remontar = () => montar();
  window.addEventListener("resize", remontar);
  if (document.fonts) document.fonts.ready.then(remontar);

  /* ---- Desacelera com o mouse em cima ------------------------------------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const velocidade = (valor) =>
      loop && gsap.to(loop, { timeScale: valor, duration: 0.5, ease: "power2.out" });

    esteira.addEventListener("pointerenter", () => velocidade(0.18));
    esteira.addEventListener("pointerleave", () => velocidade(1));
  }

  /* ---- Pausa quando sai da tela ------------------------------------------- */
  // não faz sentido gastar frames animando algo que ninguém está vendo
  ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => loop && (self.isActive ? loop.play() : loop.pause()),
  });
});
