/* ==========================================================================
   SHIVA'S SALON — CENTRAL CONFIG
   Edit this file to update salon info, pricing, gallery and testimonials
   across the entire site. Nothing below needs to be touched anywhere else.
   ========================================================================== */

const SALON = {
  name: "Shiva's Salon",
  tagline: "Look sharp. Feel confident.",
  subTagline: "Premium Men's Grooming & Styling",
  phoneDisplay: "+91 98765 43210",
  phoneHref: "tel:+919876543210",
  whatsapp: "919876543210", // digits only, country code first — used to build wa.me links
  email: "hello@shivassalon.com",
  address: "12 MG Road, Near City Centre, Tanuku, Andhra Pradesh 534211",
  mapsQuery: "Shiva%27s+Salon+Tanuku+Andhra+Pradesh",
  mapsEmbed: "https://www.google.com/maps?q=Shiva%27s+Salon+Tanuku+Andhra+Pradesh&output=embed",
  hours: [
    { day: "Monday – Saturday", time: "10:00 AM – 10:00 PM" },
    { day: "Sunday", time: "11:00 AM – 8:00 PM" }
  ],
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/"
  }
};

const SERVICES = [
  { id: "haircut", name: "Haircut", category: "Haircut", price: 199, desc: "Precision haircut tailored to your face shape and personal style.", image: "assets/images/haircut.jpg", ph: "ph-1" },
  { id: "beard-trim", name: "Beard Trimming", category: "Beard", price: 149, desc: "Sharp, defined lines that keep your beard looking intentional.", image: "assets/images/beard.jpg", ph: "ph-2" },
  { id: "head-massage", name: "Head Massage", category: "Styling", price: 249, desc: "A relaxing pressure-point massage to ease tension and refresh the scalp.", image: "assets/images/salon.jpg", ph: "ph-3" },
  { id: "hair-styling", name: "Hair Styling", category: "Styling", price: 299, desc: "Finished, photo-ready styling for any occasion, big or small.", image: "assets/images/hero.jpg", ph: "ph-4" },
  { id: "hair-color", name: "Hair Color", category: "Color", price: 599, desc: "Natural-looking colour and grey coverage using premium products.", image: "assets/images/haircut.jpg", ph: "ph-5" },
  { id: "hair-wash", name: "Hair Wash", category: "Styling", price: 99, desc: "A thorough cleanse and conditioning wash before any service.", image: "assets/images/salon.jpg", ph: "ph-1" },
  { id: "d-tan", name: "D-Tan Removal", category: "Styling", price: 349, desc: "Brightens sun-tanned skin and evens out your natural tone.", image: "assets/images/beard.jpg", ph: "ph-2" },
  { id: "facial", name: "Facial", category: "Styling", price: 449, desc: "A deep-cleansing facial that leaves skin fresh and even-toned.", image: "assets/images/hero.jpg", ph: "ph-3" },
  { id: "hair-spa", name: "Hair Spa", category: "Styling", price: 399, desc: "Nourishing spa treatment that repairs and strengthens from the roots.", image: "assets/images/salon.jpg", ph: "ph-4" },
  { id: "beard-styling", name: "Beard Styling", category: "Beard", price: 249, desc: "Full beard shaping and design suited to your face structure.", image: "assets/images/beard.jpg", ph: "ph-5" },
  { id: "grooming-combo", name: "Grooming Combo", category: "Styling", price: 649, desc: "Haircut, beard and wash bundled into one efficient session.", image: "assets/images/haircut.jpg", ph: "ph-1" },
  { id: "premium-grooming", name: "Premium Grooming", category: "Styling", price: 999, desc: "Our complete top-to-toe grooming ritual for a head-turning finish.", image: "assets/images/hero.jpg", ph: "ph-2" }
];

const PACKAGES = [
  {
    name: "Basic",
    price: 399,
    featured: false,
    items: ["Haircut", "Beard Trimming", "Hair Wash"]
  },
  {
    name: "Premium",
    price: 699,
    featured: true,
    badge: "Most Popular",
    items: ["Haircut", "Beard Styling", "Head Massage", "Hair Wash", "D-Tan Removal"]
  },
  {
    name: "Elite",
    price: 999,
    featured: false,
    items: ["Haircut", "Beard Styling", "Hair Color / Styling", "Facial", "Head Massage", "D-Tan Removal", "Hair Spa"]
  }
];

const GALLERY = [
  { id: 1, category: "Haircut", tag: "Haircut", image: "assets/images/haircut.jpg", ph: "ph-1", tall: true },
  { id: 2, category: "Beard", tag: "Beard", image: "assets/images/beard.jpg", ph: "ph-2", tall: false },
  { id: 3, category: "Salon", tag: "Salon Interior", image: "assets/images/salon.jpg", ph: "ph-3", tall: false },
  { id: 4, category: "Styling", tag: "Styling", image: "assets/images/hero.jpg", ph: "ph-4", tall: true },
  { id: 5, category: "Color", tag: "Colour", image: "assets/images/haircut.jpg", ph: "ph-5", tall: false },
  { id: 6, category: "Haircut", tag: "Haircut", image: "assets/images/hero.jpg", ph: "ph-2", tall: false },
  { id: 7, category: "Beard", tag: "Beard", image: "assets/images/beard.jpg", ph: "ph-3", tall: true },
  { id: 8, category: "Salon", tag: "Salon Interior", image: "assets/images/salon.jpg", ph: "ph-1", tall: false },
  { id: 9, category: "Styling", tag: "Styling", image: "assets/images/hero.jpg", ph: "ph-5", tall: false },
  { id: 10, category: "Color", tag: "Colour", image: "assets/images/haircut.jpg", ph: "ph-4", tall: true },
  { id: 11, category: "Haircut", tag: "Haircut", image: "assets/images/haircut.jpg", ph: "ph-3", tall: false },
  { id: 12, category: "Beard", tag: "Beard", image: "assets/images/beard.jpg", ph: "ph-1", tall: false }
];

const TESTIMONIALS = [
  { name: "Arjun Rao", initials: "AR", rating: 5, service: "Premium Grooming", quote: "The best grooming experience I've had in the city. Precise cut, relaxed atmosphere, and the head massage is unreal." },
  { name: "Karthik Varma", initials: "KV", rating: 5, service: "Haircut & Beard Styling", quote: "Shiva's has become my monthly ritual. Consistent quality every single time, and booking on WhatsApp is effortless." },
  { name: "Rahul Menon", initials: "RM", rating: 5, service: "Elite Package", quote: "Booked the Elite package before a wedding and walked out looking like a completely different person. Worth every rupee." },
  { name: "Vishnu Teja", initials: "VT", rating: 4, service: "Hair Spa", quote: "Calm, clean space and genuinely skilled stylists. The hair spa left my hair feeling healthier than it has in years." },
  { name: "Sai Kiran", initials: "SK", rating: 5, service: "Beard Trimming", quote: "Attention to detail is next level. They actually listen to what you want instead of pushing their own style." }
];

// Expose globally for non-module scripts
window.SALON = SALON;
window.SERVICES = SERVICES;
window.PACKAGES = PACKAGES;
window.GALLERY = GALLERY;
window.TESTIMONIALS = TESTIMONIALS;
