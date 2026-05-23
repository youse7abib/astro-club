// =============================================================================
// Stars Background
// =============================================================================
const canvas = document.getElementById("stars-bg");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let stars = [];
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: 250 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.5,
      o: Math.random() * 0.6 + 0.4,
      d: (Math.random() - 0.5) * 0.02,
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const starRGB =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--star-color")
        .trim() || "200, 220, 255";
    stars.forEach((s) => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${starRGB},${s.o})`;
      ctx.fill();
      s.o += s.d;
      if (s.o <= 0.1 || s.o >= 0.9) s.d *= -1;
    });
    requestAnimationFrame(draw);
  }
  resize();
  window.addEventListener("resize", resize);
  draw();
}

// =============================================================================
// Stats Counter
// =============================================================================
const statsSection = document.querySelector(".stats");
if (statsSection) {
  const targets = [30, 12, 8, 3];
  const ids = ["s1", "s2", "s3", "s4"];
  let done = false;
  const obs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !done) {
        done = true;
        targets.forEach((t, i) => {
          let c = 0;
          const step = Math.ceil(t / 40);
          const iv = setInterval(() => {
            c = Math.min(c + step, t);
            const el = document.getElementById(ids[i]);
            if (el) el.textContent = c + "+";
            if (c >= t) clearInterval(iv);
          }, 40);
        });
      }
    },
    { threshold: 0.3 },
  );
  obs.observe(statsSection);
}

// =============================================================================
// Card Entrance Animation
// =============================================================================
const co = new IntersectionObserver(
  (entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.style.opacity = "1";
          e.target.style.transform = "translateY(0)";
        }, i * 90);
        co.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 },
);
document.querySelectorAll(".program-card, .branch-card").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(28px)";
  el.style.transition = "opacity .5s ease, transform .5s ease";
  co.observe(el);
});

// =============================================================================
// Smooth Scroll
// =============================================================================
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id === "#") return;
    const t = document.querySelector(id);
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// =============================================================================
// Navbar Shrink on Scroll
// =============================================================================
window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  if (nav) nav.classList.toggle("nav-scrolled", window.scrollY > 50);
});

// =============================================================================
// Hamburger Menu
// =============================================================================
function initHamburger() {
  const hamburger = document.getElementById("nav-hamburger");
  const navLinks = document.getElementById("nav-links");
  const dropdown = document.getElementById("nav-programs");
  const dropToggle = document.getElementById("nav-programs-toggle");

  if (!hamburger || !navLinks || !dropdown || !dropToggle) return;

  // Sync the drawer's top position to the real nav height
  function syncDrawerTop() {
    const nav = document.querySelector("nav");
    if (nav && window.innerWidth <= 768) {
      navLinks.style.top = nav.offsetHeight + "px";
    } else {
      navLinks.style.top = "";
    }
  }
  syncDrawerTop();
  window.addEventListener("resize", syncDrawerTop);

  function closeMenu() {
    navLinks.classList.remove("is-open");
    hamburger.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
  }

  // Hamburger toggle
  hamburger.addEventListener("click", () => {
    const opening = !navLinks.classList.contains("is-open");
    syncDrawerTop(); // re-measure in case nav shrank on scroll
    if (opening) {
      navLinks.classList.add("is-open");

      hamburger.classList.add("is-open");

      hamburger.setAttribute("aria-expanded", "true");
    } else {
      closeMenu();
    }
  });

  // Programs: accordion on mobile, hover on desktop (CSS handles desktop)
  dropToggle.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle("is-open");
    }
  });

  // Close when any regular link is tapped
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (link === dropToggle && window.innerWidth <= 768) return;
      closeMenu();
    });
  });

  // Reset on resize to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMenu();
      dropdown.classList.remove("is-open");
    }
  });
}

// Wait for components.js to inject the navbar, then init
const placeholder = document.getElementById("navbar-placeholder");
if (placeholder) {
  if (document.getElementById("nav-hamburger")) {
    initHamburger();
  } else {
    const mo = new MutationObserver(() => {
      if (document.getElementById("nav-hamburger")) {
        mo.disconnect();
        initHamburger();
      }
    });
    mo.observe(placeholder, { childList: true, subtree: true });
  }
} else {
  initHamburger();
}
