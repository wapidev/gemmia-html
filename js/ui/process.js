// "How we work" — renders the 4 process steps and updates them on language change.

import { PROCESS_STEPS } from '../content.js';
import { getLang, onLangChange } from '../i18n.js';

const ICONS = [
  // 01 — isometric box (parcel)
  '<svg viewBox="0 0 60 60" fill="none"><path d="M30 10L52 20v20L30 50L8 40V20L30 10z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 20l22 10 22-10M30 30v20" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M19 15l22 10" stroke="currentColor" stroke-width="1.5"/></svg>',
  // 02 — house/structure
  '<svg viewBox="0 0 60 60" fill="none"><path d="M10 50V20l20-10 20 10v30" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M30 10v40" stroke="currentColor" stroke-width="1.5"/><path d="M10 30l20-10 20 10" stroke="currentColor" stroke-width="1.5"/></svg>',
  // 03 — radar/compass
  '<svg viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="20" stroke="currentColor" stroke-width="1.5"/><circle cx="30" cy="30" r="3" fill="currentColor"/><path d="M30 10v6M30 44v6M10 30h6M44 30h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M44 16L30 30" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  // 04 — checkmark in circle
  '<svg viewBox="0 0 60 60" fill="none"><path d="M14 30l10 10 22-22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="30" cy="30" r="22" stroke="currentColor" stroke-width="1.5"/></svg>'
];

export function initProcess() {
  const grid = document.getElementById('process-grid');
  if (!grid) return;

  function render() {
    const lang = getLang();
    grid.replaceChildren(
      ...PROCESS_STEPS.map((step, i) => {
        const wrap = document.createElement('div');
        wrap.className = 'process-step';
        wrap.innerHTML = `
          <div class="process-step-rail">
            <div class="process-step-num">${step.n}</div>
            <div class="process-step-line"></div>
          </div>
          <div class="process-step-body">
            <h3 class="process-step-name">${step.name[lang]}</h3>
            <p class="process-step-text">${step.body[lang]}</p>
          </div>
          <div class="process-step-icon" aria-hidden="true">${ICONS[i]}</div>
        `;
        return wrap;
      })
    );
  }

  render();
  onLangChange(render);
}
