/* ==========================================================================
   SHIVA'S SALON — GALLERY
   Category filtering + accessible lightbox (keyboard + swipe).
   Depends on #gallery-grid being rendered by main.js first.
   ========================================================================== */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    // Slight delay to ensure main.js has rendered the grid from config.
    requestAnimationFrame(setup);
  });

  function setup() {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;

    const filters = document.querySelectorAll(".gallery-filter");
    const lightbox = document.getElementById("lightbox");
    const lightboxMedia = document.getElementById("lightbox-media");
    const lightboxTag = document.getElementById("lightbox-tag");
    let currentIndex = 0;
    let visibleItems = [];

    function refreshVisible() {
      visibleItems = Array.from(grid.querySelectorAll(".gallery-item:not(.hide)"));
    }
    refreshVisible();

    /* ---------------- Filtering ---------------- */
    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        filters.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.getAttribute("data-filter");
        grid.querySelectorAll(".gallery-item").forEach((item) => {
          const match = cat === "All" || item.getAttribute("data-category") === cat;
          item.classList.toggle("hide", !match);
        });
        refreshVisible();
      });
    });

    /* ---------------- Lightbox ---------------- */
    if (!lightbox) return;

    grid.addEventListener("click", (e) => {
      const item = e.target.closest(".gallery-item");
      if (item) openLightbox(item);
    });
    grid.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("gallery-item")) {
        e.preventDefault();
        openLightbox(e.target);
      }
    });

    function openLightbox(item) {
      refreshVisible();
      currentIndex = visibleItems.indexOf(item);
      renderLightbox();
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
      document.getElementById("lightbox-close").focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }

    function renderLightbox() {
      if (!visibleItems.length) return;
      const item = visibleItems[currentIndex];
      const phClass = Array.from(item.querySelector(".ph").classList).find(c => c.startsWith("ph-"));
      lightboxMedia.className = `ph ${phClass}`;
      lightboxTag.textContent = item.getAttribute("data-category");
    }

    function next() { currentIndex = (currentIndex + 1) % visibleItems.length; renderLightbox(); }
    function prev() { currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length; renderLightbox(); }

    document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
    document.getElementById("lightbox-next").addEventListener("click", next);
    document.getElementById("lightbox-prev").addEventListener("click", prev);
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

    window.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });

    // Basic swipe support
    let touchStartX = 0;
    lightbox.addEventListener("touchstart", (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    lightbox.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    }, { passive: true });
  }
})();
