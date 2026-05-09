// Entry point. Loads i18n first (so static text is translated before UI modules
// query the DOM), then wires up each interactive section.

import { initI18n }      from './i18n.js';
import { initHeader }    from './ui/header.js';
import { initServices }  from './ui/services.js';
import { initProcess }   from './ui/process.js';
import { initOffices }   from './ui/offices.js';
import { initContact }   from './ui/contact.js';
import { initFooter }    from './ui/footer.js';

function boot() {
  initI18n();
  initHeader();
  initServices();
  initProcess();
  initOffices();
  initContact();
  initFooter();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
