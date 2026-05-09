// Services carousel — image + body that swaps when you click a progress dot or arrow.

import { SERVICES } from '../content.js';
import { getLang, onLangChange } from '../i18n.js';

export function initServices() {
  const els = {
    img:      document.getElementById('svc-img'),
    num:      document.getElementById('svc-num'),
    name:     document.getElementById('svc-name'),
    short:    document.getElementById('svc-short'),
    body:     document.getElementById('svc-body'),
    progress: document.getElementById('svc-progress'),
    prev:     document.getElementById('svc-prev'),
    next:     document.getElementById('svc-next')
  };

  if (!els.img || !els.progress) return;

  let active = 0;
  const total = SERVICES.length;
  const totalLabel = String(total).padStart(2, '0');

  // Build progress dots once
  els.progress.replaceChildren(
    ...SERVICES.map((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'svc-feature-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Service ${i + 1}`);
      dot.addEventListener('click', () => render(i));
      return dot;
    })
  );

  els.prev.addEventListener('click', () => render((active - 1 + total) % total));
  els.next.addEventListener('click', () => render((active + 1) % total));

  function render(i) {
    active = i;
    const lang = getLang();
    const s = SERVICES[i];

    els.img.src = s.img;
    els.img.alt = s.name[lang];
    els.num.textContent = `${s.n} / ${totalLabel}`;
    els.name.textContent = s.name[lang];
    els.short.textContent = s.short[lang];
    els.body.textContent = s.body[lang];

    Array.from(els.progress.children).forEach((dot, k) => {
      dot.classList.toggle('is-active', k === i);
    });
  }

  render(0);
  onLangChange(() => render(active));
}
