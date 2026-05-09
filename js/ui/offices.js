// Offices section — renders 3 office cards alongside the world map.
// Clicking a card or a map pin updates the active office.

import { OFFICES } from '../content.js';
import { getLang, onLangChange } from '../i18n.js';
import { renderWorldMap } from './world-map.js';

export function initOffices() {
  const list = document.getElementById('off-list');
  const mapHost = document.getElementById('world-map');
  if (!list || !mapHost) return;

  let active = 0;
  let map = null;

  function render() {
    const lang = getLang();

    // Re-render the map with the current language (country labels)
    map = renderWorldMap({
      container: mapHost,
      pins: OFFICES,
      lang,
      onPin: setActive
    });

    // Render the cards
    list.replaceChildren(
      ...OFFICES.map((o, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'off-card';
        btn.innerHTML = `
          <div class="off-card-top">
            <span class="off-card-num">/ 0${i + 1}</span>
            <span class="off-card-status">
              <span class="off-card-dot"></span>
              <span class="off-card-status-label">VIEW</span>
            </span>
          </div>
          <div class="off-card-city">${o.city}</div>
          <div class="off-card-country">${o.country[lang]}</div>
          <div class="off-card-addr">
            ${o.address.split('\n').map((line) => `<div>${line}</div>`).join('')}
          </div>
        `;
        btn.addEventListener('click', () => setActive(i));
        return btn;
      })
    );

    setActive(active);
  }

  function setActive(i) {
    active = i;
    Array.from(list.children).forEach((btn, k) => {
      const on = k === i;
      btn.classList.toggle('is-active', on);
      const status = btn.querySelector('.off-card-status');
      const label = btn.querySelector('.off-card-status-label');
      if (status) status.classList.toggle('on', on);
      if (label)  label.textContent = on ? 'ACTIVE' : 'VIEW';
    });
    map?.setActive(i);
  }

  render();
  onLangChange(render);
}
