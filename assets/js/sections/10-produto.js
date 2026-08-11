/* ==========================================================================
   SEÇÕES DE PRODUTO — animação compartilhada
   Vale para INSS, CLT, Servidor Público e Limpa Nome: o seletor é `.prod`, e
   cada seção anima independentemente com o seu próprio trigger.
   ========================================================================== */

SM.section("produtos", (mm, anim) => {
  const secoes = gsap.utils.toArray(".prod");
  if (!secoes.length) return;

  mm.add(
    {
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)",
      reduced: "(prefers-reduced-motion: reduce)",
    },
    (ctx) => {
      const { isMobile, reduced } = ctx.conditions;

      secoes.forEach((section) => {
        const q = gsap.utils.selector(section);

        if (reduced) {
          gsap.set(q("[data-anim]"), { opacity: 1, y: 0 });
          return;
        }

        /* ---- cabeçalho -------------------------------------------------- */
        anim.revealLines(q(".prod__title")[0], {
          trigger: section,
          start: "top 78%",
        });

        gsap.to(q(".prod__lead"), {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.22,
          scrollTrigger: { trigger: section, start: "top 78%", toggleActions: SM.anim.ACOES },
        });

        /* ---- cards, em lote por fileira --------------------------------- */
        q(".prod__dupla").forEach((fileira) => {
          const cards = fileira.querySelectorAll(".prod__card");

          gsap
            .timeline({
              scrollTrigger: { trigger: fileira, start: "top 88%", toggleActions: SM.anim.ACOES },
            })
            .fromTo(
              cards,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: isMobile ? 0.07 : 0.1,
              }
            )
            .fromTo(
              fileira.querySelectorAll(".prod__card-icone"),
              { opacity: 0, scale: 0.5 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: "back.out(2)",
                stagger: isMobile ? 0.07 : 0.1,
              },
              0.16
            );
        });

        /* ---- CTA ---------------------------------------------------------- */
        // sem isso o botão ficaria preso no estado inicial do [data-anim]:
        // invisível e 40px abaixo do lugar
        // O gatilho é o FIM da grade, não o próprio botão: numa seção que
        // termina a página, o botão pode nunca alcançar a linha de disparo
        // (o scroll acaba antes). Ancorar no conteúdo também faz o CTA
        // aparecer junto com o encerramento da leitura.
        gsap.to(q(".prod__corpo > .btn"), {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: q(".prod__grade")[0],
            start: "bottom 92%",
            toggleActions: SM.anim.ACOES,
          },
        });

        /* ---- card de destaque ------------------------------------------- */
        const destaque = q(".prod__destaque")[0];
        if (!destaque) return;

        const tl = gsap.timeline({
          scrollTrigger: { trigger: destaque, start: "top 85%", toggleActions: SM.anim.ACOES },
        });

        tl.to(destaque, { opacity: 1, y: 0, duration: 0.85, ease: "power3.out" });

        /* A ordem pedida: primeiro a informação, depois as barras com o texto,
           e só então as setas — a de baixo antes da de cima. Por isso o ícone
           é animado separadamente da barra que o contém.                     */
        const chips = q(".prod__chip");
        if (chips.length) {
          const barras = chips;
          // ordem do DOM = seta para baixo (chip 1) e depois para cima (chip 2)
          const setas = chips.map((c) => c.querySelector("img")).filter(Boolean);

          tl.fromTo(
            barras,
            { opacity: 0, x: isMobile ? 0 : 60 },
            { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", stagger: 0.14 },
            0.25
          ).fromTo(
            setas,
            { opacity: 0, scale: 0.45, rotate: -35 },
            {
              opacity: 1,
              scale: 1,
              rotate: 0,
              duration: 0.55,
              ease: "back.out(2.2)",
              stagger: 0.2, // a seta de baixo entra, depois a de cima
            },
            0.75
          );

          // (segue para os contadores)
        }

        /* ---- Tablet (CLT) --------------------------------------------------
           A tela surge primeiro; só depois as informações sobem uma a uma
           dentro dela.                                                        */
        const tablet = q(".prod__arte--tablet .tablet")[0];
        if (tablet) {
          const pills = q(".tablet__pill");

          tl.fromTo(
            tablet,
            { opacity: 0, y: 26, scale: 0.94 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
            0.2
          ).fromTo(
            pills,
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.16, // uma de cada vez, de cima para baixo
            },
            0.75 // depois da tela já ter surgido
          );
        }

        /* ---- Órbita (Servidor) ---------------------------------------------
           Os logos saem girando do centro do $M para as suas posições. Quem
           gira é o BRAÇO — um ponto no centro do núcleo — então o satélite
           percorre um arco de verdade, e não uma reta.                       */
        const orbita = q(".prod__arte--orbita")[0];
        if (orbita) {
          const nucleo = orbita.querySelector(".orbita__nucleo");
          const bracos = gsap.utils.toArray(".orbita__braco", orbita);

          tl.fromTo(
            nucleo,
            { opacity: 0, scale: 0.82 },
            { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" },
            0.15
          );

          bracos.forEach((braco, i) => {
            const sat = braco.querySelector(".orbita__sat");
            // o ângulo final é o do CSS; lido ANTES de qualquer tween mexer
            const anguloFinal = parseFloat(
              getComputedStyle(braco).getPropertyValue("--ang")
            );
            const quando = 0.45 + i * 0.14;

            // o braço chega girando: o satélite percorre um arco até a posição
            tl.fromTo(
              braco,
              { rotation: anguloFinal - 165 },
              { rotation: anguloFinal, duration: 1.15, ease: "power2.out" },
              quando
            )
              // e o logo cresce de dentro do núcleo enquanto viaja
              .fromTo(
                sat,
                { opacity: 0, scale: 0.15 },
                { opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.6)" },
                quando + 0.1
              );
          });
        }

        /* ---- Conversa (Limpa Nome) -----------------------------------------
           Simula a conversa acontecendo: o aparelho surge, o nome do contato
           aparece, as mensagens chegam uma a uma como pop-up e os selos caem
           por último.                                                        */
        const zap = q(".zap")[0];
        if (zap) {
          const arte = q(".prod__arte--conversa")[0];

          tl.fromTo(
            zap,
            { opacity: 0, y: 22, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
            0.15
          )
            .fromTo(
              arte.querySelector(".zap__contato"),
              { opacity: 0, y: 8 },
              { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
              0.55
            )
            // cada mensagem "estoura" como balão de chat
            .fromTo(
              arte.querySelectorAll(".zap__msg"),
              { opacity: 0, y: 14, scale: 0.9 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: "back.out(1.8)",
                stagger: 0.42, // pausa entre uma mensagem e a resposta
                transformOrigin: "left bottom",
              },
              0.8
            )
            // e os selos caem girando por cima
            .fromTo(
              arte.querySelectorAll(".zap__selo"),
              { opacity: 0, scale: 0.5, rotate: -18 },
              {
                opacity: 1,
                scale: 1,
                rotate: 0,
                duration: 0.55,
                ease: "back.out(2)",
                stagger: 0.14,
              },
              1.75
            );
        }

        if (chips.length) {
          // o percentual conta junto com a barra a que pertence
          q(".prod__chip-taxa").forEach((el, i) => {
            const alvo = parseFloat(el.dataset.taxa);
            if (Number.isNaN(alvo)) return;
            const sinal = alvo > 0 ? "+" : "";

            anim.counter(el, {
              from: 0,
              to: alvo,
              decimals: 2,
              separador: ".", // o Figma escreve "-4.29%", com ponto
              prefix: sinal,
              suffix: "%",
              duration: 1,
              delay: 0.35 + i * 0.14,
              trigger: destaque,
              start: "top 85%",
            });
          });
        }
      });
    }
  );
});
