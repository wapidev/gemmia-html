// Header behavior:
//  - Adds .is-scrolled when the page scrolls past the threshold
//  - Highlights the current section in the nav (scroll-spy)
//  - Smooth-scrolls when nav links are clicked
//  - Toggles the mobile menu

const SCROLL_THRESHOLD = 30;
const SCROLL_SPY_OFFSET = 140;
const SECTIONS = ['home', 'services', 'about', 'contact'];

export function initHeader() {
  const header = document.getElementById('site-header');
  const burger = document.getElementById('hdr-burger');
  const mobile = document.getElementById('hdr-mobile');
  const navLinks = document.querySelectorAll('.hdr-link');

  if (!header) return;

  // Scroll handler — debounced via rAF
  let pending = false;
  const onScroll = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);

      const probe = window.scrollY + SCROLL_SPY_OFFSET;
      let active = SECTIONS[0];
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= probe) active = id;
      }
      navLinks.forEach((link) => {
        const matches = link.dataset.section === active;
        link.classList.toggle('is-active', matches);
      });
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMobile();
    });
  });

  // Mobile burger
  if (burger && mobile) {
    burger.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      mobile.hidden = open;
    });
  }

  function closeMobile() {
    if (!burger || !mobile) return;
    burger.setAttribute('aria-expanded', 'false');
    mobile.hidden = true;
  }
}
