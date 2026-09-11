/* ==========================================================================
   SHIVA'S SALON — BOOKING
   Client-side validation, then builds a WhatsApp deep link so the
   customer can send their appointment request directly. There is no
   backend — SALON.whatsapp (see config.js) is the single place the
   number is configured.
   ========================================================================== */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", setup);

  function setup() {
    const form = document.getElementById("booking-form");
    if (!form) return;

    const fields = {
      name: form.querySelector("#full-name"),
      phone: form.querySelector("#phone"),
      service: form.querySelector("#service"),
      date: form.querySelector("#pref-date"),
      time: form.querySelector("#pref-time")
    };

    // Prevent picking a date in the past
    if (fields.date) {
      const today = new Date().toISOString().split("T")[0];
      fields.date.setAttribute("min", today);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const errors = validate(fields);
      renderErrors(errors);

      if (Object.keys(errors).length > 0) {
        const firstErrorField = fields[Object.keys(errors)[0]];
        if (firstErrorField) firstErrorField.focus();
        return;
      }

      const message = buildMessage(fields);
      const link = window.buildWaLink ? window.buildWaLink(message) : `https://wa.me/${SALON.whatsapp}?text=${encodeURIComponent(message)}`;

      const opened = window.open(link, "_blank", "noopener");
      showAlt(link, message);

      if (!opened) {
        showToast("Couldn't open WhatsApp automatically — use the options below.");
      } else {
        showToast("Opening WhatsApp with your appointment details…");
      }
    });

    // Clear individual field errors as the user fixes them
    Object.values(fields).forEach((el) => {
      if (!el) return;
      el.addEventListener("input", () => clearFieldError(el));
      el.addEventListener("change", () => clearFieldError(el));
    });
  }

  function validate(fields) {
    const errors = {};

    if (!fields.name.value.trim()) {
      errors.name = "Please enter your name.";
    } else if (fields.name.value.trim().length < 2) {
      errors.name = "That name looks too short.";
    }

    const phoneDigits = fields.phone.value.replace(/\D/g, "");
    if (!phoneDigits) {
      errors.phone = "Please enter your phone number.";
    } else if (phoneDigits.length < 10 || phoneDigits.length > 13) {
      errors.phone = "Please enter a valid phone number.";
    }

    if (!fields.service.value) {
      errors.service = "Please select a service.";
    }

    if (!fields.date.value) {
      errors.date = "Please choose a preferred date.";
    }

    if (!fields.time.value) {
      errors.time = "Please choose a preferred time.";
    }

    return errors;
  }

  function renderErrors(errors) {
    Object.keys(errors).forEach((key) => {
      const wrap = document.querySelector(`[data-field="${key}"]`);
      if (!wrap) return;
      wrap.classList.add("error");
      const msg = wrap.querySelector(".field-error");
      if (msg) msg.textContent = errors[key];
    });
  }

  function clearFieldError(el) {
    const wrap = el.closest("[data-field]");
    if (!wrap) return;
    wrap.classList.remove("error");
    const msg = wrap.querySelector(".field-error");
    if (msg) msg.textContent = "";
  }

  function formatDate(value) {
    if (!value) return "";
    const d = new Date(value + "T00:00:00");
    if (isNaN(d)) return value;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  }

  function buildMessage(fields) {
    return [
      `Hello ${SALON.name},`,
      ``,
      `I would like to book an appointment.`,
      ``,
      `Name: ${fields.name.value.trim()}`,
      `Phone: ${fields.phone.value.trim()}`,
      `Service: ${fields.service.value}`,
      `Date: ${formatDate(fields.date.value)}`,
      `Time: ${fields.time.value}`,
      ``,
      `Thank you.`
    ].join("\n");
  }

  function showAlt(link, message) {
    const alt = document.getElementById("booking-alt");
    if (!alt) return;
    alt.classList.add("show");
    alt.innerHTML = `
      Didn't open automatically?
      <a href="${link}" target="_blank" rel="noopener" style="color:var(--color-olive-deep); font-weight:600;">Open WhatsApp</a>
      or <a href="${SALON.phoneHref}" style="color:var(--color-olive-deep); font-weight:600;">call the salon</a>
      or <button type="button" id="copy-msg" style="background:none;border:none;padding:0;color:var(--color-olive-deep);font-weight:600;text-decoration:underline;">copy your message</button>.
    `;
    const copyBtn = document.getElementById("copy-msg");
    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(message);
          showToast("Appointment message copied.");
        } catch (e) {
          showToast("Couldn't copy — please select the text manually.");
        }
      });
    }
  }

  function showToast(text) {
    let toast = document.getElementById("app-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "app-toast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove("show"), 3600);
  }
})();
