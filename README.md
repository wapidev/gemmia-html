# Gemmia Logistics — vanilla HTML/CSS/JS

One-page website implemented as static HTML + CSS + ES modules. No build step.

## Run locally

Because this uses ES modules (`<script type="module">`), browsers won't load it from a `file://` URL — you need a local server.

Pick whichever you have handy:

```bash
# Python (pre-installed on macOS, Linux, most Windows setups)
python3 -m http.server 8080

# Node.js
npx serve .

# PHP
php -S localhost:8080
```

Then open `http://localhost:8080`.

## Project structure

```
.
├── index.html              # Markup + data-i18n hooks
├── css/
│   └── styles.css          # All styles (single file, organized by section)
├── js/
│   ├── main.js             # Entry point — boots every module
│   ├── content.js          # Bilingual data (EN/ES)
│   ├── i18n.js             # Language switching engine
│   └── ui/
│       ├── header.js       # Sticky header + scroll-spy + mobile menu
│       ├── services.js     # Services carousel
│       ├── process.js      # "How we work" steps
│       ├── offices.js      # Offices section (uses world-map.js)
│       ├── world-map.js    # Reusable world-map renderer
│       ├── contact.js      # Form validation + multi-select pills
│       └── footer.js       # Footer link lists
└── assets/
    ├── logo-color.svg
    ├── logo-white.svg
    ├── world-map.png
    └── icons/              # 8 industry icons (pre-colored light blue)
```

## Adding a third language

1. In `js/content.js`, copy the `en` block under a new key (e.g. `pt`) and translate every value.
2. Add the country labels to each `country` field in `OFFICES`, the names/short/body fields in `SERVICES`, etc.
3. Add `TRANSPORT_MODES.pt`.
4. In `index.html`, add a third button to `.lang-toggle` with `data-lang="pt"`.

The `data-i18n` machinery picks up new keys automatically.

## Replacing the form submit

In `js/ui/contact.js`, find the `setTimeout(() => { ... }, 1100)` block. Replace it with a real `fetch` call to your backend, e.g.:

```js
const data = Object.fromEntries(new FormData(form).entries());
data.modes = [...selectedModes];
const res = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). Uses ES modules, `Intl.NumberFormat`-free, no transpilation needed.
