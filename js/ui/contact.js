// Contact form — multi-select transport mode pills, validation, simulated submit.

import { TRANSPORT_MODES } from '../content.js';
import { getLang, onLangChange, t } from '../i18n.js';

export function initContact() {
  const form = document.getElementById('contact-form');
  const wrap = document.getElementById('contact-form-wrap');
  const pills = document.getElementById('mode-pills');
  const submitBtn = document.getElementById('submit-btn');

  if (!form || !pills || !submitBtn) return;

  const selectedModes = new Set();

  function renderPills() {
    const lang = getLang();
    const modes = TRANSPORT_MODES[lang];
    // Drop modes that are no longer in the list (defensive — currently all 5 exist in both)
    [...selectedModes].forEach((m, idx) => {
      if (!TRANSPORT_MODES.en.includes(m) && !TRANSPORT_MODES.es.includes(m)) {
        selectedModes.delete(m);
      }
    });
    pills.replaceChildren(
      ...modes.map((m, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        // Track by the EN canonical so language switches don't lose selection
        const canonical = TRANSPORT_MODES.en[i];
        const on = selectedModes.has(canonical);
        btn.className = 'mode-pill' + (on ? ' is-active' : '');
        btn.setAttribute('aria-pressed', String(on));
        btn.innerHTML = `
          <span class="mode-pill-check" aria-hidden="true">${on ? CHECK_SVG : ''}</span>
          ${m}
        `;
        btn.addEventListener('click', () => {
          if (selectedModes.has(canonical)) selectedModes.delete(canonical);
          else selectedModes.add(canonical);
          renderPills();
        });
        return btn;
      })
    );
  }

  const CHECK_SVG = '<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 6l2.5 2.5L9 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function clearError(field) {
    field.classList.remove('has-err');
    field.querySelector('.field-err')?.remove();
  }

  function setError(field, message) {
    clearError(field);
    field.classList.add('has-err');
    const err = document.createElement('span');
    err.className = 'field-err';
    err.textContent = message;
    field.appendChild(err);
  }

  // Clear error as the user types
  form.querySelectorAll('input, textarea').forEach((input) => {
    input.addEventListener('input', () => {
      const field = input.closest('.field');
      if (field) clearError(field);
    });
  });

  function validate() {
    let ok = true;
    const fields = {
      name:    form.querySelector('[name="name"]'),
      email:   form.querySelector('[name="email"]'),
      message: form.querySelector('[name="message"]')
    };

    if (!fields.name.value.trim()) {
      setError(fields.name.closest('.field'), t('contact.form.required'));
      ok = false;
    }
    const email = fields.email.value.trim();
    if (!email) {
      setError(fields.email.closest('.field'), t('contact.form.required'));
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(fields.email.closest('.field'), t('contact.form.invalid'));
      ok = false;
    }
    if (!fields.message.value.trim()) {
      setError(fields.message.closest('.field'), t('contact.form.required'));
      ok = false;
    }
    return ok;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    submitBtn.disabled = true;
    submitBtn.querySelector('[data-i18n="contact.form.cta"]').textContent = t('contact.form.sending');

    // Simulate async submit. Replace with your real endpoint.
    setTimeout(() => {
      wrap.innerHTML = `
        <div class="contact-success">
          <div class="contact-success-mark">
            <svg viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="28" stroke="currentColor" stroke-width="1.5"/>
              <path d="M18 30l8 8 16-18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>${t('contact.form.sent')}</h3>
        </div>
      `;
    }, 1100);
  });

  renderPills();
  onLangChange(renderPills);
}
