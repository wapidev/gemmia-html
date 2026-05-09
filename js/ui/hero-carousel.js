// Hero background carousel — fades through the slides at a fixed interval.
// Pauses while the tab is hidden and resumes on focus.

const INTERVAL_MS = 5000;

export function initHeroCarousel() {
  const slides = Array.from(document.querySelectorAll('#hero-bg img'));
  if (slides.length < 2) return;

  // Respect users who prefer no motion — keep the first slide static.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  let active = slides.findIndex((s) => s.classList.contains('is-active'));
  if (active < 0) {
    active = 0;
    slides[0].classList.add('is-active');
  }

  let timer = null;
  const advance = () => {
    slides[active].classList.remove('is-active');
    active = (active + 1) % slides.length;
    slides[active].classList.add('is-active');
  };

  const start = () => {
    stop();
    timer = setInterval(advance, INTERVAL_MS);
  };
  const stop = () => {
    if (timer) { clearInterval(timer); timer = null; }
  };

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });

  start();
}
