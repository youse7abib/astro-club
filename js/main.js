// Stars Background
const canvas = document.getElementById("stars-bg");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let stars = [];
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: 250 }, () => ({
      // Slightly increased the number of stars
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.5, // Increased size: radius is now between 1.0 and 3.5
      o: Math.random() * 0.6 + 0.4, // Increased brightness: opacity is now between 0.4 and 1.0
      d: (Math.random() - 0.5) * 0.02, // Slightly faster fading effect
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dynamically grab the star color from your CSS variables
    const rootStyles = getComputedStyle(document.documentElement);
    const starRGB =
      rootStyles.getPropertyValue("--star-color").trim() || "200, 220, 255";

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

// Stats Counter
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

// Card Entrance Animation
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
document.querySelectorAll(".program-card,.branch-card").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(28px)";
  el.style.transition = "opacity .5s ease,transform .5s ease";
  co.observe(el);
});

// Smooth scroll for hash links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const targetId = a.getAttribute("href");
    if (targetId === "#") return; // skip empty hashes

    // Only smooth scroll if the element exists on the current page
    const t = document.querySelector(targetId);
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: "smooth" });
    }
  });
});
// --- NAVBAR SHRINK ON SCROLL ---
window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  if (nav) {
    // If the user scrolls down more than 50 pixels, add the shrunk class
    if (window.scrollY > 50) {
      nav.classList.add("nav-scrolled");
    } else {
      // If they scroll back to the top, remove it to make it large again
      nav.classList.remove("nav-scrolled");
    }
  }
});
