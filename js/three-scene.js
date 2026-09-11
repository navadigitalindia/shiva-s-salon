/* ==========================================================================
   SHIVA'S SALON — LUXURY 3D HERO GROOMING EXPERIENCE
   Procedural luxury 3D grooming composition:
   • Olive-tinted frosted glass grooming bottle with metallic pump dispenser
   • Precision barber shears / scissors with brushed chrome blades & dark handles
   • Stylized matte barber comb
   • Floating satin ambient rings & soft studio lighting
   • Mouse drag & parallax interactivity with smooth spring damping
   • WebGL & reduced-motion fallback
   ========================================================================== */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function supportsWebGL() {
    try {
      const canvas = document.createElement("canvas");
      return !!(window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    } catch (e) {
      return false;
    }
  }

  function init() {
    const stage = document.querySelector(".hero-stage");
    const canvas = document.getElementById("hero-canvas");
    const fallback = document.querySelector(".hero-stage-fallback");
    if (!stage || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isNarrow = window.innerWidth < 720;
    const lowMemory = navigator.deviceMemory && navigator.deviceMemory <= 2;
    const hasThree = typeof window.THREE !== "undefined";

    const shouldUse3D = hasThree && supportsWebGL() && !reduced && !lowMemory;

    if (!shouldUse3D) {
      showFallback();
      return;
    }

    try {
      runScene({ lightweight: isNarrow });
    } catch (err) {
      console.warn("3D hero scene failed, displaying fallback.", err);
      showFallback();
    }

    function showFallback() {
      canvas.style.display = "none";
      if (fallback) fallback.style.display = "flex";
    }
  }

  function runScene({ lightweight }) {
    const canvas = document.getElementById("hero-canvas");
    const stage = document.querySelector(".hero-stage");
    const fallback = document.querySelector(".hero-stage-fallback");

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lightweight ? 1.25 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0.2, 7.2);

    function sizeToStage() {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    sizeToStage();

    // =========================================================================
    // STUDIO LIGHTING
    // Soft, flattering product photography lighting in White/Olive/Sage palette
    // =========================================================================

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdde6da, 1.2);
    fillLight.position.set(-5, -1, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x8fa58a, 1.8);
    rimLight.position.set(-3, 4, -4);
    scene.add(rimLight);

    const bottomGlow = new THREE.PointLight(0xdde6da, 1.0, 10);
    bottomGlow.position.set(0, -3, 2);
    scene.add(bottomGlow);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    // =========================================================================
    // MATERIALS PALETTE (Olive Green, Sage, Chrome, Charcoal)
    // =========================================================================

    // Translucent Frosted Olive Glass
    const frostedOliveMat = new THREE.MeshPhysicalMaterial({
      color: 0x8fa58a,
      roughness: 0.28,
      metalness: 0.08,
      transmission: 0.55,
      ior: 1.5,
      thickness: 0.8,
      clearcoat: 0.7,
      clearcoatRoughness: 0.3
    });

    // Polished Chrome / Brushed Stainless Steel
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf0f3ef,
      roughness: 0.18,
      metalness: 0.94
    });

    // Dark Charcoal Ergonomic Grip
    const charcoalMat = new THREE.MeshStandardMaterial({
      color: 0x263027,
      roughness: 0.45,
      metalness: 0.25
    });

    // Light Sage Matte Comb Material
    const sageMat = new THREE.MeshStandardMaterial({
      color: 0xa9bda4,
      roughness: 0.38,
      metalness: 0.12
    });

    // Soft Gold / Champagne Accent Ring
    const goldAccentMat = new THREE.MeshStandardMaterial({
      color: 0xc8b896,
      roughness: 0.25,
      metalness: 0.85
    });

    // Main composition group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const segDetail = lightweight ? 24 : 48;

    // -------------------------------------------------------------------------
    // 1. LUXURY GROOMING BOTTLE
    // -------------------------------------------------------------------------
    const bottleGroup = new THREE.Group();

    // Bottle body (cylinder with rounded shoulders)
    const bodyGeo = new THREE.CylinderGeometry(0.68, 0.68, 2.1, segDetail);
    const bottleBody = new THREE.Mesh(bodyGeo, frostedOliveMat);
    bottleGroup.add(bottleBody);

    // Shoulder taper
    const shoulderGeo = new THREE.CylinderGeometry(0.42, 0.68, 0.45, segDetail);
    const shoulder = new THREE.Mesh(shoulderGeo, frostedOliveMat);
    shoulder.position.y = 1.25;
    bottleGroup.add(shoulder);

    // Metallic Collar / Neck
    const neckGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.35, segDetail);
    const neck = new THREE.Mesh(neckGeo, chromeMat);
    neck.position.y = 1.62;
    bottleGroup.add(neck);

    // Gold Accent Ring on Collar
    const collarRingGeo = new THREE.TorusGeometry(0.33, 0.035, 16, segDetail);
    collarRingGeo.rotateX(Math.PI / 2);
    const collarRing = new THREE.Mesh(collarRingGeo, goldAccentMat);
    collarRing.position.y = 1.52;
    bottleGroup.add(collarRing);

    // Pump Head
    const pumpGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.4, 24);
    const pump = new THREE.Mesh(pumpGeo, chromeMat);
    pump.position.y = 1.95;
    bottleGroup.add(pump);

    // Dispenser Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.42, 16);
    nozzleGeo.rotateZ(-Math.PI / 2.3);
    const nozzle = new THREE.Mesh(nozzleGeo, chromeMat);
    nozzle.position.set(0.24, 2.05, 0);
    bottleGroup.add(nozzle);

    // Luxury Minimalist Label Band
    const labelGeo = new THREE.CylinderGeometry(0.69, 0.69, 0.85, segDetail, 1, true);
    const labelMat = new THREE.MeshStandardMaterial({
      color: 0xfafbf9,
      roughness: 0.65,
      metalness: 0.05
    });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.y = -0.15;
    bottleGroup.add(label);

    bottleGroup.position.set(-0.35, -0.2, 0);
    bottleGroup.rotation.z = 0.08;
    rootGroup.add(bottleGroup);

    // -------------------------------------------------------------------------
    // 2. PRECISION BARBER SCISSORS / SHEARS
    // -------------------------------------------------------------------------
    const scissorsGroup = new THREE.Group();

    // Blade 1
    const bladeGeo1 = new THREE.ConeGeometry(0.18, 2.5, 4);
    bladeGeo1.scale(0.3, 1, 1);
    const blade1 = new THREE.Mesh(bladeGeo1, chromeMat);
    blade1.position.set(0, 0.95, 0);
    blade1.rotation.z = -0.12;
    scissorsGroup.add(blade1);

    // Blade 2
    const bladeGeo2 = new THREE.ConeGeometry(0.18, 2.5, 4);
    bladeGeo2.scale(0.3, 1, 1);
    const blade2 = new THREE.Mesh(bladeGeo2, chromeMat);
    blade2.position.set(0, 0.95, 0);
    blade2.rotation.z = 0.16;
    scissorsGroup.add(blade2);

    // Center Pivot Screw
    const pivotGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.1, 24);
    pivotGeo.rotateX(Math.PI / 2);
    const pivot = new THREE.Mesh(pivotGeo, goldAccentMat);
    pivot.position.set(0, -0.1, 0.04);
    scissorsGroup.add(pivot);

    // Handle Shanks
    const shankGeo1 = new THREE.CylinderGeometry(0.08, 0.09, 1.1, 16);
    const shank1 = new THREE.Mesh(shankGeo1, charcoalMat);
    shank1.position.set(-0.25, -0.65, 0);
    shank1.rotation.z = 0.22;
    scissorsGroup.add(shank1);

    const shankGeo2 = new THREE.CylinderGeometry(0.08, 0.09, 1.1, 16);
    const shank2 = new THREE.Mesh(shankGeo2, charcoalMat);
    shank2.position.set(0.25, -0.65, 0);
    shank2.rotation.z = -0.22;
    scissorsGroup.add(shank2);

    // Finger Rings
    const ringGeo1 = new THREE.TorusGeometry(0.28, 0.075, 16, 32);
    const ring1 = new THREE.Mesh(ringGeo1, charcoalMat);
    ring1.position.set(-0.45, -1.3, 0);
    scissorsGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(0.28, 0.075, 16, 32);
    const ring2 = new THREE.Mesh(ringGeo2, charcoalMat);
    ring2.position.set(0.45, -1.3, 0);
    scissorsGroup.add(ring2);

    // Finger rest (tang)
    const tangGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.35, 12);
    const tang = new THREE.Mesh(tangGeo, charcoalMat);
    tang.position.set(0.8, -1.35, 0);
    tang.rotation.z = -Math.PI / 3;
    scissorsGroup.add(tang);

    scissorsGroup.position.set(1.25, 0.1, 0.35);
    scissorsGroup.rotation.set(-0.25, 0.3, -0.45);
    scissorsGroup.scale.setScalar(0.72);
    rootGroup.add(scissorsGroup);

    // -------------------------------------------------------------------------
    // 3. PRECISION BARBER COMB
    // -------------------------------------------------------------------------
    const combGroup = new THREE.Group();

    // Comb spine
    const spineGeo = new THREE.BoxGeometry(0.18, 2.8, 0.08);
    const spine = new THREE.Mesh(spineGeo, sageMat);
    combGroup.add(spine);

    // Comb teeth (array of small slats)
    const teethCount = lightweight ? 18 : 32;
    const teethGroup = new THREE.Group();
    const toothGeo = new THREE.BoxGeometry(0.48, 0.035, 0.06);

    for (let i = 0; i < teethCount; i++) {
      const tooth = new THREE.Mesh(toothGeo, sageMat);
      const yOffset = -1.2 + (i / (teethCount - 1)) * 2.4;
      tooth.position.set(0.28, yOffset, 0);
      teethGroup.add(tooth);
    }
    combGroup.add(teethGroup);

    combGroup.position.set(-1.4, 0.45, -0.4);
    combGroup.rotation.set(0.35, -0.4, 0.65);
    combGroup.scale.setScalar(0.7);
    rootGroup.add(combGroup);

    // -------------------------------------------------------------------------
    // 4. SATIN AMBIENT 3D RINGS & FLOATING PEARL PARTICLES
    // -------------------------------------------------------------------------
    const orbitalRingGeo1 = new THREE.TorusGeometry(2.35, 0.032, 16, segDetail * 2);
    const orbitalRing1 = new THREE.Mesh(orbitalRingGeo1, frostedOliveMat);
    orbitalRing1.rotation.x = Math.PI / 2.3;
    orbitalRing1.rotation.y = 0.2;
    rootGroup.add(orbitalRing1);

    const orbitalRingGeo2 = new THREE.TorusGeometry(1.85, 0.02, 16, segDetail * 2);
    const orbitalRing2 = new THREE.Mesh(orbitalRingGeo2, goldAccentMat);
    orbitalRing2.rotation.x = -Math.PI / 3;
    rootGroup.add(orbitalRing2);

    // Floating micro droplets / pearls
    const pearlMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 0.9
    });
    const pearl1 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 24), pearlMat);
    pearl1.position.set(1.6, 1.4, 0.8);
    rootGroup.add(pearl1);

    const pearl2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), frostedOliveMat);
    pearl2.position.set(-1.8, -1.2, 0.6);
    rootGroup.add(pearl2);

    const pearl3 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), goldAccentMat);
    pearl3.position.set(0.2, 1.8, -0.5);
    rootGroup.add(pearl3);

    // Contact soft shadow floor disk
    const shadowGeo = new THREE.CircleGeometry(2.4, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x263027,
      transparent: true,
      opacity: 0.12
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.95;
    rootGroup.add(shadow);

    rootGroup.scale.setScalar(0.96);

    // =========================================================================
    // INTERACTION & ANIMATION CONTROLS
    // Damped mouse tracking, interactive drag rotation, and scroll parallax
    // =========================================================================

    let mouseX = 0, mouseY = 0;
    let targetRotX = 0, targetRotY = 0;
    let dragRotX = 0, dragRotY = 0;
    let isDragging = false;
    let previousPointerX = 0, previousPointerY = 0;
    let scrollFactor = 0;
    const clock = new THREE.Clock();

    // Mouse pointer parallax
    stage.addEventListener("pointermove", (e) => {
      if (isDragging) {
        const deltaX = e.clientX - previousPointerX;
        const deltaY = e.clientY - previousPointerY;
        dragRotY += deltaX * 0.008;
        dragRotX += deltaY * 0.008;
        previousPointerX = e.clientX;
        previousPointerY = e.clientY;
        return;
      }

      const rect = stage.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    });

    stage.addEventListener("pointerdown", (e) => {
      isDragging = true;
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
      canvas.style.cursor = "grabbing";
    });

    window.addEventListener("pointerup", () => {
      if (isDragging) {
        isDragging = false;
        canvas.style.cursor = "grab";
      }
    });

    stage.addEventListener("pointerleave", () => {
      if (!isDragging) {
        mouseX = 0;
        mouseY = 0;
      }
    });

    // Scroll parallax depth reaction
    window.addEventListener("scroll", () => {
      const maxScroll = window.innerHeight * 1.3;
      scrollFactor = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    }, { passive: true });

    function debounce(fn, wait) {
      let t;
      return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
      };
    }
    window.addEventListener("resize", debounce(sizeToStage, 120));

    // =========================================================================
    // TICK RENDER LOOP
    // =========================================================================

    function tick() {
      const t = clock.getElapsedTime();

      // Smooth inertia towards cursor
      targetRotX += (mouseY * 0.3 - targetRotX) * 0.05;
      targetRotY += (mouseX * 0.45 - targetRotY) * 0.05;

      // Natural gentle float dynamics
      const floatY = Math.sin(t * 0.8) * 0.09 - (scrollFactor * 0.3);
      const floatRotZ = Math.sin(t * 0.5) * 0.04;

      rootGroup.position.y = floatY;
      rootGroup.rotation.x = targetRotX + dragRotX + Math.sin(t * 0.4) * 0.03;
      rootGroup.rotation.y = targetRotY + dragRotY + (t * 0.1) + (scrollFactor * Math.PI * 0.45);
      rootGroup.rotation.z = floatRotZ;

      // Subtle individual floating offsets for secondary items
      scissorsGroup.position.y = 0.1 + Math.sin(t * 1.2 + 1) * 0.06;
      scissorsGroup.rotation.z = -0.45 + Math.cos(t * 0.9) * 0.05;

      combGroup.position.y = 0.45 + Math.cos(t * 1.1 + 2) * 0.05;
      combGroup.rotation.x = 0.35 + Math.sin(t * 0.7) * 0.04;

      orbitalRing1.rotation.z = t * 0.08;
      orbitalRing2.rotation.z = -t * 0.12;

      pearl1.position.y = 1.4 + Math.sin(t * 1.5) * 0.08;
      pearl2.position.y = -1.2 + Math.cos(t * 1.4) * 0.07;
      pearl3.position.y = 1.8 + Math.sin(t * 1.3 + 1.5) * 0.06;

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    tick();

    // Smooth fade in
    canvas.style.opacity = 0;
    canvas.style.transition = "opacity 0.8s ease";
    requestAnimationFrame(() => { canvas.style.opacity = 1; });
    if (fallback) fallback.style.display = "none";
  }
})();
