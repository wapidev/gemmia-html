// Hero background carousel — fades through 4 slides at a fixed interval,
// also rendering navigation dots that let the user jump to any slide.
// Pauses while the tab is hidden and resumes on focus.

const INTERVAL_MS = 5500;

export function initHeroCarousel() {
  const slides = Array.from(document.querySelectorAll('.hero-bg-slide'));
  const dotsHost = document.getElementById('hero-bg-dots');
  if (slides.length < 2 || !dotsHost) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Build clickable dots
  const dots = slides.map((_, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hero-bg-dot' + (i === 0 ? ' is-active' : '');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', `Slide ${i + 1}`);
    btn.setAttribute('aria-selected', String(i === 0));
    btn.addEventListener('click', () => goTo(i));
    return btn;
  });
  dotsHost.replaceChildren(...dots);

  let active = 0;
  let timer = null;

  function goTo(i) {
    if (i === active) return;
    slides[active].classList.remove('is-active');
    dots[active].classList.remove('is-active');
    dots[active].setAttribute('aria-selected', 'false');

    active = i;
    slides[active].classList.add('is-active');
    dots[active].classList.add('is-active');
    dots[active].setAttribute('aria-selected', 'true');

    // Reset the auto-advance timer when the user clicks a dot
    if (timer) start();
  }

  const advance = () => goTo((active + 1) % slides.length);

  const start = () => {
    stop();
    if (!reduceMotion) timer = setInterval(advance, INTERVAL_MS);
  };
  const stop = () => {
    if (timer) { clearInterval(timer); timer = null; }
  };

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });

  start();
}
