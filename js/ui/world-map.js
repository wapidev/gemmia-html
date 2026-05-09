// World map — PNG silhouette as the base, SVG overlay for pins, glow, arcs and labels.
// Caller owns the active state; this module just renders.

const MAP_W = 1000;
const MAP_H = 572;
const SVG_NS = 'http://www.w3.org/2000/svg';

const PALETTE = {
  ink:    '#0f1a3d',
  accent: '#1f5fe0'
};

/**
 * Render the map into `container`. Returns `{ setActive(i) }` so the caller
 * can update the highlighted pin without re-rendering the whole map.
 *
 * `pins` is an array of { city, country: {en,es}|string, coord:{x,y}, labelSide? }.
 * `lang` ∈ 'en' | 'es' is used to label the country line.
 */
export function renderWorldMap({ container, pins, lang = 'en', onPin }) {
  container.innerHTML = '';

  // Base PNG
  const img = document.createElement('img');
  img.src = 'assets/world-map.png';
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');
  Object.assign(img.style, {
    width: '100%', height: 'auto', display: 'block', opacity: '0.55', filter: 'saturate(0)'
  });
  container.appendChild(img);

  // SVG overlay
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${MAP_W} ${MAP_H}`);
  svg.setAttribute('aria-hidden', 'true');
  Object.assign(svg.style, {
    position: 'absolute', inset: '0', width: '100%', height: '100%',
    display: 'block', pointerEvents: 'none'
  });

  // Glow gradient
  const defs = document.createElementNS(SVG_NS, 'defs');
  defs.innerHTML = `
    <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${PALETTE.accent}" stop-opacity="0.45" />
      <stop offset="55%" stop-color="${PALETTE.accent}" stop-opacity="0.12" />
      <stop offset="100%" stop-color="${PALETTE.accent}" stop-opacity="0" />
    </radialGradient>
  `;
  svg.appendChild(defs);

  // Connector arcs between consecutive pins
  if (pins.length >= 2) {
    const g = document.createElementNS(SVG_NS, 'g');
    for (let i = 0; i < pins.length - 1; i++) {
      const a = pins[i], b = pins[i + 1];
      const x1 = (a.coord.x / 100) * MAP_W;
      const y1 = (a.coord.y / 100) * MAP_H;
      const x2 = (b.coord.x / 100) * MAP_W;
      const y2 = (b.coord.y / 100) * MAP_H;
      const cx = (x1 + x2) / 2;
      const cy = Math.min(y1, y2) - 70;
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', PALETTE.accent);
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('stroke-dasharray', '4 4');
      path.setAttribute('opacity', '0.6');
      g.appendChild(path);
    }
    svg.appendChild(g);
  }

  // Pins (interactive)
  const pinsGroup = document.createElementNS(SVG_NS, 'g');
  pinsGroup.style.pointerEvents = 'auto';
  svg.appendChild(pinsGroup);

  const pinNodes = pins.map((pin, i) => {
    const cx = (pin.coord.x / 100) * MAP_W;
    const cy = (pin.coord.y / 100) * MAP_H;
    const country = typeof pin.country === 'string' ? pin.country : pin.country[lang];

    const g = document.createElementNS(SVG_NS, 'g');
    g.style.cursor = 'pointer';
    g.addEventListener('click', () => onPin?.(i));
    g.innerHTML = `
      <circle class="map-glow" cx="${cx}" cy="${cy}" r="28" fill="url(#pinGlow)" />
      <circle class="map-pulse" cx="${cx}" cy="${cy}" r="14" fill="none" stroke="${PALETTE.accent}" stroke-width="1.5" opacity="0" />
      <circle class="map-pin" cx="${cx}" cy="${cy}" r="6" fill="${PALETTE.accent}" />
      <circle class="map-dot" cx="${cx}" cy="${cy}" r="2" fill="#fff" />
      <g transform="translate(${pin.labelSide === 'left' ? cx - 14 : cx + 14}, ${cy - 8})">
        <text class="map-city" x="0" y="0"
              fill="${PALETTE.ink}"
              font-family="'Inter Tight', system-ui, sans-serif"
              font-size="14" font-weight="600"
              text-anchor="${pin.labelSide === 'left' ? 'end' : 'start'}"
              style="letter-spacing: 0.01em">${pin.city}</text>
        <text class="map-country" x="0" y="14"
              fill="${PALETTE.ink}" opacity="0.55"
              font-family="'JetBrains Mono', monospace"
              font-size="9" font-weight="500"
              text-anchor="${pin.labelSide === 'left' ? 'end' : 'start'}">${country.toUpperCase()}</text>
      </g>
    `;
    pinsGroup.appendChild(g);
    return g;
  });

  container.appendChild(svg);

  function setActive(activeIdx) {
    pinNodes.forEach((g, i) => {
      const on = i === activeIdx;
      const glow  = g.querySelector('.map-glow');
      const pulse = g.querySelector('.map-pulse');
      const pin   = g.querySelector('.map-pin');
      const dot   = g.querySelector('.map-dot');
      const city  = g.querySelector('.map-city');

      glow.setAttribute('r', on ? '42' : '28');
      pin.setAttribute('r', on ? '8' : '6');
      dot.setAttribute('r', on ? '3' : '2');
      city.setAttribute('font-weight', on ? '700' : '600');

      // Toggle pulse animation by detaching/attaching the <animate> children.
      pulse.innerHTML = '';
      if (on) {
        pulse.setAttribute('opacity', '0.6');
        pulse.innerHTML = `
          <animate attributeName="r" from="10" to="30" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.6" to="0" dur="1.8s" repeatCount="indefinite" />
        `;
      } else {
        pulse.setAttribute('opacity', '0');
      }
    });
  }

  return { setActive };
}
