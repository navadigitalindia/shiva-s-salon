/* ==========================================================================
   SHIVA'S SALON — ANIMATIONS & 3D INTERACTION ENGINE
   Lenis smooth scroll + GSAP/ScrollTrigger reveals, counters,
   Signature Experience scroll storytelling, 3D card tilt with specular
   spotlight tracking, and magnetic buttons.
   Strictly respects prefers-reduced-motion throughout.
   ========================================================================== */

(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";

  document.addEventListener("DOMContentLoaded", () => {
    initSmoothScroll();
    if (hasGSAP) {
      gsap.registerPlugin(ScrollTrigger);
      pageLoadSequence();
      initScrollReveals();
      initCounters();
      initSignatureExperience();
      initCardTiltAndSheen();
      if (!isTouch && !reduced) {
        initMagneticButtons();
        initParallaxOrbs();
      }
    } else {
      // Fallback if GSAP is unavailable
      document.querySelectorAll("[data-reveal],[data-reveal-fade],[data-reveal-scale]").forEach(el => {
        el.style.opacity = 1;
        el.style.transform = "none";
      });
    }
  });

  /* ------------------------------------------------------------------ */
  /* Lenis smooth scroll, wired to ScrollTrigger                         */
  /* ------------------------------------------------------------------ */

  function initSmoothScroll() {
    if (reduced || typeof window.Lenis === "undefined") return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.15
    });
    window.__lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (hasGSAP && window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // Anchor links scroll via Lenis for consistent easing
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id && id.length > 1) {
          const target = document.querySelector(id);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -74 });
          }
        }
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* One orchestrated page-load sequence for the hero                    */
  /* ------------------------------------------------------------------ */

  function pageLoadSequence() {
    const tl = gsap.timeline({ delay: reduced ? 0 : 0.35, defaults: { ease: "power3.out" } });
    tl.from(".brand", { opacity: 0, y: -14, duration: 0.6 })
      .from(".nav-links a", { opacity: 0, y: -10, stagger: 0.05, duration: 0.5 }, "-=0.4")
      .from(".nav-cta", { opacity: 0, y: -10, duration: 0.5 }, "-=0.4")
      .from(".hero .script-accent", { opacity: 0, y: 14, duration: 0.6 }, "-=0.2")
      .from(".hero .eyebrow", { opacity: 0, y: 16, duration: 0.6 }, "-=0.4")
      .from(".hero-title", { opacity: 0, y: 34, duration: 0.85 }, "-=0.35")
      .from(".hero-sub", { opacity: 0, y: 20, duration: 0.6 }, "-=0.5")
      .from(".hero-desc", { opacity: 0, y: 20, duration: 0.6 }, "-=0.45")
      .from(".hero-actions > *", { opacity: 0, y: 16, stagger: 0.08, duration: 0.55 }, "-=0.4")
      .from(".hero-trust-bar > *", { opacity: 0, y: 14, stagger: 0.08, duration: 0.5 }, "-=0.35")
      .from(".hero-stage", { opacity: 0, scale: 0.95, duration: 0.9 }, "-=0.8");
  }

  /* ------------------------------------------------------------------ */
  /* Scroll-triggered reveals (fade-up / fade / scale)                   */
  /* ------------------------------------------------------------------ */

  function initScrollReveals() {
    const groupsBy = (selector, vars) => {
      document.querySelectorAll(selector).forEach((el) => {
        gsap.to(el, {
          ...vars,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true
          }
        });
      });
    };

    groupsBy("[data-reveal]", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });
    groupsBy("[data-reveal-fade]", { opacity: 1, duration: 1 });
    groupsBy("[data-reveal-scale]", { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" });

    // Stagger service/pricing/gallery cards slightly based on index within their grid
    ["#services-grid", "#pricing-grid"].forEach(sel => {
      const grid = document.querySelector(sel);
      if (!grid) return;
      const cards = grid.children;
      gsap.utils.toArray(cards).forEach((card, i) => {
        card.style.transitionDelay = "";
        ScrollTrigger.create({
          trigger: card,
          start: "top 92%",
          once: true,
          onEnter: () => gsap.to(card, { opacity: 1, y: 0, duration: 0.7, delay: (i % 3) * 0.08, ease: "power3.out" })
        });
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Animated counters (About section statistics)                        */
  /* ------------------------------------------------------------------ */

  function initCounters() {
    document.querySelectorAll("[data-counter]").forEach((el) => {
      const target = parseFloat(el.getAttribute("data-counter"));
      const suffix = el.getAttribute("data-counter-suffix") || "";
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              const v = target % 1 === 0 ? Math.round(obj.val) : obj.val.toFixed(1);
              el.textContent = v + suffix;
            }
          });
        }
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Signature Experience — cinematic scroll storytelling                */
  /* ------------------------------------------------------------------ */

  function initSignatureExperience() {
    const section = document.querySelector(".signature");
    const steps = gsap.utils.toArray(".sig-step");
    const progressBar = document.querySelector(".sig-progress-bar");
    const glow = document.querySelector(".sig-visual-glow");
    if (!section || !steps.length) return;

    const stepColors = ["#8FA58A", "#B7A98F", "#7C8F9A", "#DDE6DA"];

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=140%",
      pin: window.innerWidth > 940 && !reduced,
      scrub: 0.6,
      onUpdate: (self) => {
        const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
        steps.forEach((s, i) => s.classList.toggle("active", i === idx));
        if (progressBar) progressBar.style.width = `${self.progress * 100}%`;
        if (glow) glow.style.background = `radial-gradient(circle at 50% 50%, ${stepColors[idx]}66, transparent 65%)`;
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 3D Card Tilt + Cursor Specular Light Tracking                       */
  /* ------------------------------------------------------------------ */

  function initCardTiltAndSheen() {
    if (reduced || isTouch) return;

    const cardSelectors = ".service-card, .price-card, [data-tilt]";

    document.addEventListener("mousemove", (e) => {
      const card = e.target.closest(cardSelectors);
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      // Set CSS variables for specular light reflection
      card.style.setProperty("--mouse-x", `${(px * 100).toFixed(1)}%`);
      card.style.setProperty("--mouse-y", `${(py * 100).toFixed(1)}%`);

      // Gentle 3D perspective rotation
      const rotX = (py - 0.5) * -12;
      const rotY = (px - 0.5) * 12;

      gsap.to(card, {
        rotateX: rotX,
        rotateY: rotY,
        duration: 0.35,
        ease: "power2.out",
        transformPerspective: 1000
      });
    });

    document.addEventListener("mouseout", (e) => {
      const card = e.target.closest(cardSelectors);
      if (card && !card.contains(e.relatedTarget)) {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: "power3.out"
        });
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Magnetic Button Attraction (Desktop only)                          */
  /* ------------------------------------------------------------------ */

  function initMagneticButtons() {
    const magneticTargets = document.querySelectorAll(".btn, .nav-cta, .hamburger, .gallery-filter");

    magneticTargets.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.32;
        const deltaY = (e.clientY - centerY) * 0.32;

        gsap.to(btn, {
          x: deltaX,
          y: deltaY,
          duration: 0.25,
          ease: "power2.out"
        });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1.1, 0.4)"
        });
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Ambient 3D background parallax on scroll                           */
  /* ------------------------------------------------------------------ */

  function initParallaxOrbs() {
    document.querySelectorAll(".ambient-orb").forEach((orb, i) => {
      const speed = (i + 1) * 35;
      gsap.to(orb, {
        y: speed,
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1
        }
      });
    });
  }
})();
