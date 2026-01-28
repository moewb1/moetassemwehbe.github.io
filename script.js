const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

window.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => {
    document.body.classList.add("page-loaded");
  });
});

const backgroundEl = document.querySelector(".background");
const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (backgroundEl && !reduceMotion) {
  let rafId = null;
  let latestEvent = null;

  const updateParallax = () => {
    if (!latestEvent) {
      rafId = null;
      return;
    }
    const { innerWidth, innerHeight } = window;
    const x = (latestEvent.clientX - innerWidth / 2) / innerWidth;
    const y = (latestEvent.clientY - innerHeight / 2) / innerHeight;
    const moveX = (x * 18).toFixed(2);
    const moveY = (y * 18).toFixed(2);
    backgroundEl.style.setProperty("--bg-shift-x", `${moveX}px`);
    backgroundEl.style.setProperty("--bg-shift-y", `${moveY}px`);
    rafId = null;
  };

  window.addEventListener("mousemove", (event) => {
    latestEvent = event;
    if (rafId) {
      return;
    }
    rafId = requestAnimationFrame(updateParallax);
  });

  window.addEventListener("mouseleave", () => {
    backgroundEl.style.setProperty("--bg-shift-x", "0px");
    backgroundEl.style.setProperty("--bg-shift-y", "0px");
  });
}

const themeToggle = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("theme");
const initialTheme = savedTheme || "dark";

const applyTheme = (theme) => {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  if (themeToggle) {
    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
  }
};

applyTheme(initialTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.body.getAttribute("data-theme") === "dark" ? "dark" : "light";
    applyTheme(current === "dark" ? "light" : "dark");
  });
}

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    });
  });
}

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav a");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${id}`;
          link.classList.toggle("active", isActive);
        });
      }
    });
  },
  { rootMargin: "-35% 0px -55% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("mousemove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    button.style.setProperty("--ripple-x", `${x}%`);
    button.style.setProperty("--ripple-y", `${y}%`);
  });
});

const modal = document.getElementById("contact-modal");
const openButtons = document.querySelectorAll(".open-contact-modal");
const closeButtons = document.querySelectorAll("[data-close-modal]");

const openModal = () => {
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
};

openButtons.forEach((btn) => btn.addEventListener("click", openModal));
closeButtons.forEach((btn) => btn.addEventListener("click", closeModal));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});
