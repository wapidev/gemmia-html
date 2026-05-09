// Footer — populates the Services and Offices link lists from content data,
// re-rendering on language change so labels stay in sync.

import { SERVICES, OFFICES } from '../content.js';
import { getLang, onLangChange } from '../i18n.js';

export function initFooter() {
  const services = document.getElementById('footer-services');
  const offices  = document.getElementById('footer-offices');
  if (!services || !offices) return;

  function render() {
    const lang = getLang();
    services.replaceChildren(
      ...SERVICES.map((s) => {
        const li = document.createElement('li');
        li.textContent = s.name[lang];
        return li;
      })
    );
    offices.replaceChildren(
      ...OFFICES.map((o) => {
        const li = document.createElement('li');
        li.textContent = `${o.city}, ${o.country[lang]}`;
        return li;
      })
    );
  }

  render();
  onLangChange(render);
}
