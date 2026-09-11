# Shiva's Salon — Premium Men's Grooming Website

A static, production-ready website for a premium men's grooming salon. Built with
HTML5, vanilla JavaScript, Three.js, GSAP and Lenis — no framework, no backend,
no database. Deploys directly to Firebase Hosting (or any static host).

## Stack

- **HTML5** — semantic markup, one page (`index.html`) plus deep-dive pages under `pages/`
- **CSS** — custom design system in `css/style.css` (CSS variables, no Tailwind build step required)
- **Vanilla JavaScript** — modular files in `js/`
- **Three.js** — hero 3D scene, with WebGL/reduced-motion/mobile fallback
- **GSAP + ScrollTrigger** — scroll reveals, the Signature Experience scroll story, counters
- **Lenis** — smooth scrolling, wired to ScrollTrigger

All third-party libraries are loaded from a CDN (cdnjs) — no `npm install` required to run the site.

## Project structure

```
shivas-salon/
├── index.html              Homepage — every core section lives here
├── pages/
│   ├── services.html       Full service catalog + FAQ
│   ├── gallery.html        Full filterable gallery + lightbox
│   ├── pricing.html        Packages + à la carte pricing table
│   └── contact.html        Contact details, map, hours
├── css/
│   ├── style.css           Design system + layout
│   └── animations.css      Reveal states, loader, keyframes
├── js/
│   ├── config.js           ⭐ Central place to edit salon info, prices, gallery, testimonials
│   ├── main.js              Navigation, mobile menu, cursor, dynamic rendering
│   ├── three-scene.js       Hero 3D scene
│   ├── animations.js        GSAP/Lenis/ScrollTrigger setup
│   ├── gallery.js            Gallery filter + lightbox
│   └── booking.js            Form validation + WhatsApp booking flow
├── assets/                  Image/3D/icon/logo folders (swap in real photography here)
├── favicon/favicon.svg
├── robots.txt
├── sitemap.xml
├── 404.html
└── firebase.json
```

## Editing content

Everything editable lives in **`js/config.js`**:

- `SALON` — name, tagline, phone, WhatsApp number, email, address, hours, social links
- `SERVICES` — the full service menu and starting prices
- `PACKAGES` — the three pricing packages (Basic / Premium / Elite)
- `GALLERY` — gallery items and categories
- `TESTIMONIALS` — client reviews

Changing a value in `config.js` updates it everywhere it's used across the site —
no need to hunt through HTML files.

### WhatsApp booking number

Set once, in `js/config.js`:

```js
whatsapp: "919876543210" // country code + number, digits only
```

## Real photography & 3D assets

The site ships with elegant CSS-gradient placeholders (`.ph-1` … `.ph-5` in
`style.css`) so nothing looks broken out of the box. To use real photography,
add images to `assets/images/...` and swap the placeholder `<div class="ph ...">`
elements for `<img>` tags (or set them as `background-image`).

For a real 3D model instead of the procedural hero object, drop a `.glb` file
in `assets/3d/` and see the comment in `js/three-scene.js` — swap the
procedural `group` for a `GLTFLoader` call.

## Running locally

No build step needed. Any static file server works:

```bash
npx serve .
```

## Deploying to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # point it at this folder, reuse the included firebase.json
firebase deploy --only hosting
```

## Performance & accessibility notes

- 3D scene checks for WebGL support, `prefers-reduced-motion`, and low-memory
  devices before running — otherwise a static illustration is shown.
- All animations respect `prefers-reduced-motion: reduce`.
- Keyboard focus states, semantic headings, alt-equivalent ARIA labels, and a
  keyboard-navigable gallery lightbox are implemented throughout.
- `LocalBusiness` structured data, Open Graph/Twitter metadata, canonical URLs,
  a sitemap and `robots.txt` are included for SEO.
