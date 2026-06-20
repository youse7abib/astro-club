const canvas = document.getElementById("stars-bg");
const ctx = canvas.getContext("2d");

let stars = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  stars = Array.from({ length: 220 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.3 + 0.2,
    o: Math.random() * 0.7 + 0.2,
    d: (Math.random() - 0.5) * 0.015,
  }));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((s) => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,220,255,${s.o})`;
    ctx.fill();

    s.o += s.d;

    if (s.o <= 0.1 || s.o >= 0.9) {
      s.d *= -1;
    }
  });

  requestAnimationFrame(draw);
}

resize();
window.addEventListener("resize", resize);
draw();
