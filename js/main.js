
const canvasWarp = document.getElementById("stars-bg");
if (canvasWarp) {
  const ctxWarp = canvasWarp.getContext("2d");

  const STAR_COUNT = 380;
  const MAX_DEPTH = 900;
  const BASE_SPEED = 0.5; 
  const BOOST_SPEED = 3.0;
  const STREAK_RATIO = 0.18;
  const TRAIL_ALPHA = 0.18;

  const CLUSTER_BIAS = -0.7;

  let W = 0,
    H = 0,
    cx = 0,
    cy = 0;
  let speed = BASE_SPEED;
  let boostTimer = 0;

  function getStarRGB() {
    try {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--star-color")
        .trim();
      return v || "200,220,255";
    } catch {
      return "200,220,255";
    }
  }

  let warpStars = [];
  function initWarpStars() {
    warpStars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      let rAngle = Math.random() * Math.PI * 2;
      let rDist =
        Math.pow(Math.random(), 1 / (1 - CLUSTER_BIAS)) * Math.max(W, H) * 0.5;
      warpStars.push({
        x: Math.cos(rAngle) * rDist,
        y: Math.sin(rAngle) * rDist,
        z: Math.random() * MAX_DEPTH,
        size: 0.5 + Math.random() * 1.5,
      });
    }
  }

  function resizeWarp() {
    W = canvasWarp.width = window.innerWidth;
    H = canvasWarp.height = window.innerHeight;
    cx = W / 2;
    cy = H / 2;
    initWarpStars();
  }

  function drawWarp() {
    requestAnimationFrame(drawWarp);
    const rgb = getStarRGB();

    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme === "light") {
      ctxWarp.fillStyle = `rgba(238, 246, 251, ${TRAIL_ALPHA})`;
    } else {
      ctxWarp.fillStyle = `rgba(5, 10, 20, ${TRAIL_ALPHA})`;
    }

    ctxWarp.fillRect(0, 0, W, H);

    if (boostTimer > 0) {
      boostTimer--;
      if (boostTimer === 0) speed = BASE_SPEED;
    }

    for (let i = 0; i < STAR_COUNT; i++) {
      let s = warpStars[i];
      s.z -= speed;

      if (s.z <= 0) {
        s.z = MAX_DEPTH;
        let rAngle = Math.random() * Math.PI * 2;
        let rDist =
          Math.pow(Math.random(), 1 / (1 - CLUSTER_BIAS)) *
          Math.max(W, H) *
          0.5;
        s.x = Math.cos(rAngle) * rDist;
        s.y = Math.sin(rAngle) * rDist;
      }

      let k = 160 / s.z;
      let px = s.x * k + cx;
      let py = s.y * k + cy;

      if (px < 0 || px > W || py < 0 || py > H) continue;

      let r = s.size * (1 - s.z / MAX_DEPTH) * 2.5;
      ctxWarp.beginPath();

      if (s.z < MAX_DEPTH * STREAK_RATIO) {
        let tailK = 160 / (s.z + speed * 2);
        let oldX = s.x * tailK + cx;
        let oldY = s.y * tailK + cy;
        ctxWarp.moveTo(px, py);
        ctxWarp.lineTo(oldX, oldY);
        ctxWarp.strokeStyle = `rgba(${rgb}, ${1 - s.z / (MAX_DEPTH * STREAK_RATIO)})`;
        ctxWarp.lineWidth = r;
        ctxWarp.lineCap = "round";
        ctxWarp.stroke();
      } else {
        ctxWarp.arc(px, py, r, 0, Math.PI * 2);
        ctxWarp.fillStyle = `rgba(${rgb}, 0.6)`;
        ctxWarp.fill();
      }
    }
  }

  window.addEventListener("scroll", () => {
    if (window.scrollY > 5) {
      speed = BOOST_SPEED;
      boostTimer = 12;
    }
  });

  resizeWarp();
  window.addEventListener("resize", resizeWarp);
  drawWarp();
}


const canvasBody = document.getElementById("stars-bg-body");
if (canvasBody) {
  const ctxBody = canvasBody.getContext("2d");

  const STAR_COUNT_BODY = 140;
  const CONNECT_DIST = 110;
  const STRETCH_FACTOR = 3.2;
  const BASE_SPEED_BODY = 0.25;

  const MIN_STAR_SIZE = 4.0; 
  const MAX_STAR_SIZE = 9.0;
  let WB = 0,
    HB = 0;
  let CXB = 0,
    CYB = 0;

  function getStarRGB() {
    try {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--star-color")
        .trim();
      return v || "200,220,255";
    } catch {
      return "200,220,255";
    }
  }

  function makeBodyStar(initRandom = true) {
    const layer = Math.random();
    const angle = Math.random() * Math.PI * 2;
    const speed = (0.4 + layer * 1.2) * BASE_SPEED_BODY;
    const maxDist = Math.sqrt(WB * WB + HB * HB) * 0.5;
    const dist = initRandom
      ? Math.random() * maxDist
      : Math.random() * maxDist * 0.5;

    return {
      x: CXB + Math.cos(angle) * dist,
      y: CYB + Math.sin(angle) * dist,
      angle: angle,
      speed: speed,
      r: MIN_STAR_SIZE + layer * (MAX_STAR_SIZE - MIN_STAR_SIZE),
      o: initRandom ? 0.15 + layer * 0.2 + Math.random() * 0.4 : 0.0,
      minO: 0.15 + layer * 0.2,
      maxO: 0.55 + layer * 0.4,
      do: 0.004 + Math.random() * 0.004,
      isFadingIn: !initRandom,
      layer,
    };
  }

  let bodyStars = [];

  function resizeBody() {
    WB = canvasBody.width = window.innerWidth;
    HB = canvasBody.height = window.innerHeight;
    CXB = WB / 2;
    CYB = HB / 2;
    if (bodyStars.length === 0) {
      bodyStars = Array.from({ length: STAR_COUNT_BODY }, () =>
        makeBodyStar(true),
      );
    }
  }

  function drawBody() {
    requestAnimationFrame(drawBody);
    ctxBody.clearRect(0, 0, WB, HB);
    const rgb = getStarRGB();

    for (let i = 0; i < bodyStars.length; i++) {
      const s = bodyStars[i];
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;

      if (s.x < -50 || s.x > WB + 50 || s.y < -50 || s.y > HB + 50) {
        bodyStars[i] = makeBodyStar(false);
        continue;
      }

      if (s.isFadingIn) {
        s.o += s.do;
        if (s.o >= s.minO) s.isFadingIn = false;
      } else {
        s.o += s.do;
        if (s.o < s.minO || s.o > s.maxO) s.do *= -1;
      }
      s.o = Math.max(0, Math.min(s.o, s.maxO));
    }

    for (let i = 0; i < bodyStars.length; i++) {
      for (let j = i + 1; j < bodyStars.length; j++) {
        const a = bodyStars[i],
          b = bodyStars[j];
        if (Math.abs(a.layer - b.layer) > 0.35) continue;

        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECT_DIST) {
          const avgLayer = (a.layer + b.layer) * 0.5;
          const lineAlpha =
            (1 - dist / CONNECT_DIST) *
            0.14 *
            (0.3 + avgLayer * 0.7) *
            (a.o * b.o);
          ctxBody.beginPath();
          ctxBody.moveTo(a.x, a.y);
          ctxBody.lineTo(b.x, b.y);
          ctxBody.strokeStyle = `rgba(${rgb},${lineAlpha})`;
          ctxBody.lineWidth = 0.6;
          ctxBody.stroke();
        }
      }
    }

    for (let i = 0; i < bodyStars.length; i++) {
      const s = bodyStars[i];
      const dx = s.x - CXB;
      const dy = s.y - CYB;
      const distToCenter = Math.sqrt(dx * dx + dy * dy);
      const currentStretch = (distToCenter / WB) * STRETCH_FACTOR * s.layer;

      ctxBody.beginPath();
      ctxBody.moveTo(s.x, s.y);
      ctxBody.lineTo(
        s.x - Math.cos(s.angle) * currentStretch,
        s.y - Math.sin(s.angle) * currentStretch,
      );
      ctxBody.strokeStyle = `rgba(${rgb},${s.o})`;
      ctxBody.lineWidth = s.r;
      ctxBody.lineCap = "round";
      ctxBody.stroke();
    }
  }

  resizeBody();
  window.addEventListener("resize", resizeBody);
  drawBody();
}


// =============================================================================
// Stats Counter
// =============================================================================
const statsSection = document.querySelector(".stats");
if (statsSection) {
  const targets = [105, 34, 5, 6];
  const ids = ["s1", "s2", "s3", "s4"];
  let done = false;
  const obs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !done) {
        done = true;
        const duration = 2000;
        const start = performance.now();
        function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOut(progress);
          targets.forEach((t, i) => {
            const el = document.getElementById(ids[i]);
            if (el) el.textContent = Math.round(eased * t) + "+";
          });
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
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

  if (!hamburger || !navLinks || !dropdown || !dropToggle) return; // Sync the drawer's top position to the real nav height

  function syncDrawerTop() {
    const nav = document.querySelector("nav");
    if (nav && window.innerWidth <= 868) {
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
  } // Hamburger toggle

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
  }); // Programs: accordion on mobile, hover on desktop (CSS handles desktop)

  dropToggle.addEventListener("click", (e) => {
    if (window.innerWidth <= 860) {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle("is-open");
    }
  }); // Close when any regular link is tapped

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (link === dropToggle && window.innerWidth <= 860) return;
      closeMenu();
    });
  }); // Reset on resize to desktop

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
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

// ═══════════════════════════════════════════════════════════════
// Gallery tab switcher — clean rewrite
// ═══════════════════════════════════════════════════════════════
(function () {
  const tabs = document.querySelectorAll(".gtab");
  const indicator = document.querySelector(".gtab-indicator");
  if (!tabs.length || !indicator) return; // All panel ids in order — direction is determined by index comparison

  const panelOrder = ["workshops", "astrophoto"];
  let current = "workshops";
  let animating = false;

  function switchTab(next) {
    if (next === current || animating) return;
    animating = true;

    const fromIdx = panelOrder.indexOf(current);
    const toIdx = panelOrder.indexOf(next);
    const goRight = toIdx > fromIdx; // moving to a later panel = slide in from right

    const outPanel = document.getElementById("panel-" + current);
    const inPanel = document.getElementById("panel-" + next); // 1. Move indicator pill

    indicator.classList.toggle("slide-right", goRight); // 2. Active tab highlight

    tabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === next)); // 3. Position incoming panel just off-screen (no transition yet)

    inPanel.style.transition = "none";
    inPanel.style.transform = goRight
      ? "translateX(100%)"
      : "translateX(-100%)";
    inPanel.style.opacity = "0";
    inPanel.style.position = "absolute";
    inPanel.style.top = "0";
    inPanel.style.left = "0";
    inPanel.style.width = "100%";
    inPanel.style.pointerEvents = "none"; // Force reflow — makes the browser register the starting position

    void inPanel.offsetWidth; // 4. Slide both panels simultaneously

    const TRANSITION =
      "opacity 0.38s ease, transform 0.38s cubic-bezier(0.4,0,0.2,1)"; // outgoing slides away

    outPanel.style.transition = TRANSITION;
    outPanel.style.transform = goRight
      ? "translateX(-100%)"
      : "translateX(100%)";
    outPanel.style.opacity = "0";
    outPanel.style.position = "absolute";
    outPanel.style.top = "0";
    outPanel.style.left = "0";
    outPanel.style.width = "100%";
    outPanel.style.pointerEvents = "none"; // incoming slides in

    inPanel.style.transition = TRANSITION;
    inPanel.style.transform = "translateX(0)";
    inPanel.style.opacity = "1"; // 5. After transition: make inPanel the layout owner, clean up outPanel

    setTimeout(() => {
      // Reset outgoing to hidden default (off right so it enters correctly next time)
      outPanel.style.transition = "none";
      outPanel.style.transform = goRight
        ? "translateX(100%)"
        : "translateX(-100%)";
      outPanel.style.opacity = "0";
      outPanel.style.position = "absolute";
      outPanel.style.pointerEvents = "none";
      outPanel.classList.remove("active"); // Make incoming the flow element

      inPanel.style.transition = "";
      inPanel.style.transform = "";
      inPanel.style.opacity = "";
      inPanel.style.position = "relative";
      inPanel.style.top = "";
      inPanel.style.left = "";
      inPanel.style.width = "";
      inPanel.style.pointerEvents = "";
      inPanel.classList.add("active");

      current = next;
      animating = false;
    }, 420);
  } // Init: ensure only workshops is visible, astrophoto is hidden off-right

  const initOut = document.getElementById("panel-astrophoto");
  if (initOut) {
    initOut.style.transition = "none";
    initOut.style.transform = "translateX(100%)";
    initOut.style.opacity = "0";
    initOut.style.position = "absolute";
    initOut.style.pointerEvents = "none";
    initOut.classList.remove("active");
  }
  const initIn = document.getElementById("panel-workshops");
  if (initIn) {
    initIn.style.position = "relative";
    initIn.style.transform = "";
    initIn.style.opacity = "";
    initIn.style.pointerEvents = "";
    initIn.classList.add("active");
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });
})();
