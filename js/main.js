/* ==========================================================================
   SHIVA'S SALON — MAIN
   Navigation, mobile menu, custom cursor, loader, and dynamic content
   rendering from config.js (services, pricing, gallery, testimonials,
   footer/contact info). Pure vanilla JS, no framework.
   ========================================================================== */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches;

  document.addEventListener("DOMContentLoaded", () => {
    applySalonInfo();
    renderServices();
    renderPackages();
    renderGallery();
    renderTestimonials();
    populateBookingServiceOptions();

    initLoader();
    initNav();
    initMobileMenu();
    if (!isTouch) initCursor();
    initFooterYear();
  });

  /* ------------------------------------------------------------------ */
  /* Salon info — phone / whatsapp / address / hours wired from config   */
  /* ------------------------------------------------------------------ */

  function waLink(message) {
    const text = encodeURIComponent(message || "Hello Shiva's Salon, I'd like to know more.");
    return `https://wa.me/${SALON.whatsapp}?text=${text}`;
  }
  window.buildWaLink = waLink;

  function applySalonInfo() {
    document.querySelectorAll("[data-phone-href]").forEach(el => el.setAttribute("href", SALON.phoneHref));
    document.querySelectorAll("[data-phone-text]").forEach(el => el.textContent = SALON.phoneDisplay);
    document.querySelectorAll("[data-email-href]").forEach(el => el.setAttribute("href", `mailto:${SALON.email}`));
    document.querySelectorAll("[data-email-text]").forEach(el => el.textContent = SALON.email);
    document.querySelectorAll("[data-address-text]").forEach(el => el.textContent = SALON.address);
    document.querySelectorAll("[data-maps-href]").forEach(el => el.setAttribute("href", `https://www.google.com/maps/search/?api=1&query=${SALON.mapsQuery}`));
    document.querySelectorAll("[data-wa-href]").forEach(el => {
      const msg = el.getAttribute("data-wa-message") || `Hello ${SALON.name}, I'd like to know more.`;
      el.setAttribute("href", waLink(msg));
    });
    document.querySelectorAll("[data-map-embed]").forEach(el => el.setAttribute("src", SALON.mapsEmbed));

    const hoursList = document.getElementById("hours-list");
    if (hoursList) {
      hoursList.innerHTML = SALON.hours.map(h => `<p><strong>${h.day}:</strong> ${h.time}</p>`).join("");
    }

    document.querySelectorAll("[data-social-instagram]").forEach(el => el.setAttribute("href", SALON.social.instagram));
    document.querySelectorAll("[data-social-facebook]").forEach(el => el.setAttribute("href", SALON.social.facebook));
    document.querySelectorAll("[data-social-youtube]").forEach(el => el.setAttribute("href", SALON.social.youtube));
  }

  /* ------------------------------------------------------------------ */
  /* Services grid                                                       */
  /* ------------------------------------------------------------------ */

  function iconFor(category) {
    const icons = {
      Haircut: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.5 15.5M8.5 8.5L20 20"/></svg>`,
      Beard: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v6c0 6-3 10-8 12-5-2-8-6-8-12V4Z"/></svg>`,
      Styling: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M3 7h18M3 17h12"/></svg>`,
      Color: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c3 4 6 7.5 6 11.5A6 6 0 1 1 6 13.5C6 9.5 9 6 12 2Z"/></svg>`
    };
    return icons[category] || icons.Styling;
  }

  function renderServices(limit) {
    const grid = document.getElementById("services-grid");
    if (!grid) return;
    const list = limit ? SERVICES.slice(0, limit) : SERVICES;
    grid.innerHTML = list.map(s => `
      <article class="service-card" data-reveal>
        <div class="service-card-media">
          ${s.image ? `<img src="${s.image}" alt="${s.name}" class="service-card-img" onerror="this.style.display='none';this.nextElementSibling.style.display='block';" /><div class="ph ${s.ph}" style="display:none;"><div class="ph-icon">${iconFor(s.category)}</div></div>` : `<div class="ph ${s.ph}"><div class="ph-icon">${iconFor(s.category)}</div></div>`}
        </div>
        <div class="service-card-body">
          <h3>${s.name}</h3>
          <p>${s.desc}</p>
        </div>
        <div class="service-card-foot">
          <span class="service-price"><small>From</small><br>₹${s.price}</span>
          <a href="#booking" class="service-link" data-service-select="${s.name}">Book Now <span class="arrow">→</span></a>
        </div>
      </article>
    `).join("");

    grid.querySelectorAll("[data-service-select]").forEach(el => {
      el.addEventListener("click", () => {
        const sel = document.getElementById("service");
        if (sel) sel.value = el.getAttribute("data-service-select");
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Pricing packages                                                    */
  /* ------------------------------------------------------------------ */

  function renderPackages() {
    const grid = document.getElementById("pricing-grid");
    if (!grid) return;
    grid.innerHTML = PACKAGES.map(p => `
      <div class="price-card ${p.featured ? "featured" : ""}" data-reveal>
        ${p.badge ? `<span class="price-badge">${p.badge}</span>` : ""}
        <h3>${p.name}</h3>
        <p class="text-muted" style="margin-top:.4rem;font-size:.88rem;">${p.items.length} services included</p>
        <div class="price-tag">₹${p.price}<small> / session</small></div>
        <ul class="price-list">
          ${p.items.map(i => `<li>${i}</li>`).join("")}
        </ul>
        <a href="#booking" class="btn ${p.featured ? "btn-outline-light" : "btn-ghost"} btn-block" data-service-select="${p.name} Package">Book This Package</a>
      </div>
    `).join("");

    grid.querySelectorAll("[data-service-select]").forEach(el => {
      el.addEventListener("click", () => {
        const sel = document.getElementById("service");
        if (sel) sel.value = "Grooming Combo";
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Gallery grid (filtering/lightbox wired in gallery.js)               */
  /* ------------------------------------------------------------------ */

  function renderGallery() {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;
    grid.innerHTML = GALLERY.map((g, i) => `
      <figure class="gallery-item" data-category="${g.category}" data-index="${i}" tabindex="0" role="button" aria-label="View ${g.tag} photo">
        ${g.image ? `<img src="${g.image}" alt="${g.tag}" class="gallery-item-img" style="aspect-ratio:${g.tall ? "3/4" : "1/1"};object-fit:cover;width:100%;height:100%;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='block';" /><div class="ph ${g.ph}" style="aspect-ratio:${g.tall ? "3/4" : "1/1"};display:none;"></div>` : `<div class="ph ${g.ph}" style="aspect-ratio:${g.tall ? "3/4" : "1/1"};"></div>`}
        <figcaption class="gallery-item-tag">${g.tag}</figcaption>
      </figure>
    `).join("");
  }

  /* ------------------------------------------------------------------ */
  /* Testimonials                                                        */
  /* ------------------------------------------------------------------ */

  function renderTestimonials() {
    const track = document.getElementById("testimonial-track");
    if (!track) return;
    const avatarColors = ["#8FA58A", "#B79A7A", "#7C8F9A", "#A98F7C", "#8A9A7C"];
    track.innerHTML = TESTIMONIALS.map((t, i) => `
      <div class="testimonial-card">
        <div class="testimonial-stars" aria-label="${t.rating} out of 5 stars">
          ${Array.from({ length: 5 }).map((_, s) => starSvg(s < t.rating)).join("")}
        </div>
        <p class="quote">"${t.quote}"</p>
        <div class="testimonial-person">
          <div class="testimonial-avatar" style="background:${avatarColors[i % avatarColors.length]}">${t.initials}</div>
          <div>
            <div class="testimonial-name">${t.name}</div>
            <div class="testimonial-service">${t.service}</div>
          </div>
        </div>
      </div>
    `).join("");

    const nav = document.getElementById("testimonial-nav");
    if (nav) {
      nav.innerHTML = TESTIMONIALS.map((_, i) => `<button class="testimonial-dot ${i === 0 ? "active" : ""}" data-dot="${i}" aria-label="Go to testimonial ${i + 1}"></button>`).join("");
    }
  }

  function starSvg(filled) {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="${filled ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.4"><path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.7l-6.1 3.3 1.5-6.8-5.2-4.7 6.9-.7L12 2.5Z"/></svg>`;
  }

  /* ------------------------------------------------------------------ */
  /* Booking service <select> options                                    */
  /* ------------------------------------------------------------------ */

  function populateBookingServiceOptions() {
    const sel = document.getElementById("service");
    if (!sel) return;
    const options = SERVICES.map(s => `<option value="${s.name}">${s.name}</option>`).join("");
    sel.innerHTML = `<option value="" disabled selected>Select a service</option>${options}<option value="Not sure yet">Not sure — recommend for me</option>`;
  }

  /* ------------------------------------------------------------------ */
  /* Loader                                                              */
  /* ------------------------------------------------------------------ */

  function initLoader() {
    const loader = document.getElementById("loader");
    document.documentElement.classList.add("js-ready");
    const hide = () => loader && loader.classList.add("hidden");
    if (document.readyState === "complete") {
      setTimeout(hide, 300);
    } else {
      window.addEventListener("load", () => setTimeout(hide, 300));
      // Safety net in case load event is delayed by slow assets
      setTimeout(hide, 2200);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Sticky nav                                                          */
  /* ------------------------------------------------------------------ */

  function initNav() {
    const nav = document.getElementById("site-nav");
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle("scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Active link highlighting
    const links = nav.querySelectorAll(".nav-links a[href^='#'], .mobile-menu a[href^='#']");
    const sections = Array.from(links)
      .map(l => document.querySelector(l.getAttribute("href")))
      .filter(Boolean);

    if (sections.length && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = "#" + entry.target.id;
            links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === id));
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach(s => observer.observe(s));
    }
  }

  /* ------------------------------------------------------------------ */
  /* Mobile menu                                                         */
  /* ------------------------------------------------------------------ */

  function initMobileMenu() {
    const btn = document.getElementById("hamburger");
    const menu = document.getElementById("mobile-menu");
    if (!btn || !menu) return;

    const close = () => {
      btn.classList.remove("active");
      menu.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };
    const open = () => {
      btn.classList.add("active");
      menu.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };

    btn.addEventListener("click", () => {
      menu.classList.contains("open") ? close() : open();
    });
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  /* ------------------------------------------------------------------ */
  /* Custom cursor (desktop only, disabled for touch / reduced motion)   */
  /* ------------------------------------------------------------------ */

  function initCursor() {
    if (prefersReducedMotion) return;
    document.body.classList.add("has-cursor");
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let cx = x, cy = y;
    let rx = x, ry = y;
    window.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; });

    function raf() {
      // Dot follows immediately with tight spring
      cx += (x - cx) * 0.35;
      cy += (y - cy) * 0.35;
      dot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;

      // Ring follows with soft smooth lag for luxury feel
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;

      requestAnimationFrame(raf);
    }
    raf();

    const hoverables = "a, button, .service-card, .price-card, .gallery-item, #hero-canvas, input, select";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverables)) {
        dot.classList.add("hovering");
        ring.classList.add("hovering");
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverables)) {
        dot.classList.remove("hovering");
        ring.classList.remove("hovering");
      }
    });

    window.addEventListener("mousedown", () => ring.classList.add("active"));
    window.addEventListener("mouseup", () => ring.classList.remove("active"));
  }

  /* ------------------------------------------------------------------ */
  /* Misc                                                                 */
  /* ------------------------------------------------------------------ */

  function initFooterYear() {
    document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
  }
})();
