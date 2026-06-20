const targets = [105, 12, 5, 6];
const ids = ["s1", "s2", "s3", "s4"];

let done = false;

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !done) {
      done = true;

      targets.forEach((target, i) => {
        let count = 0;

        const step = Math.ceil(target / 40);

        const interval = setInterval(() => {
          count = Math.min(count + step, target);

          document.getElementById(ids[i]).textContent = count + "+";

          if (count >= target) {
            clearInterval(interval);
          }
        }, 40);
      });
    }
  },
  {
    threshold: 0.3,
  },
);

observer.observe(document.querySelector(".stats"));
