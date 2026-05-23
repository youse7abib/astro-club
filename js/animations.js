const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, i * 90);

        cardObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
  },
);

document.querySelectorAll(".program-card, .branch-card").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(28px)";
  el.style.transition = "opacity .5s ease, transform .5s ease";

  cardObserver.observe(el);
});
