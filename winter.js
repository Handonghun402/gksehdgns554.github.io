(() => {
  const layer = document.createElement('div');
  layer.className = 'winter-background';
  layer.setAttribute('aria-hidden', 'true');

  // An independent SVG canvas preserves the branches on narrow screens.
  const trunk = 'M-12 810Q35 660 21 494T8 185';
  const branches = 'M24 620Q54 538 118 486M22 506Q58 432 78 393M20 439Q58 352 115 324M15 329Q40 258 69 237M11 243 26 177M49 550 38 512M68 528 92 526M48 389 50 348M80 353 103 358M-10 40Q54 30 136 81M39 40 62 92M90 57 102 129';
  const snowCaps = [
    'M-6 36Q22 32 42 37', 'M67 44Q90 51 110 63',
    'M15 215 23 180', 'M31 292Q47 261 66 239',
    'M52 383Q78 346 109 327', 'M33 479Q53 433 74 402',
    'M53 550Q81 513 112 489', 'M71 524 89 523',
  ];
  ['left', 'right'].forEach(side => {
    const tree = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    tree.setAttribute('viewBox', '0 0 160 800');
    tree.setAttribute('preserveAspectRatio', 'xMinYMin meet');
    tree.setAttribute('focusable', 'false');
    tree.classList.add('winter-tree', `winter-tree--${side}`);
    const caps = snowCaps.map(d => `<path d="${d}"/>`).join('');
    tree.innerHTML = `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <g stroke="#85929b"><path d="${trunk}" stroke-width="7"/><path d="${branches}" stroke-width="2.4"/></g>
      <g stroke="#aebfcb" stroke-width="6.5" opacity=".55">${caps}</g>
      <g stroke="#fff" stroke-width="4.5" transform="translate(0 -1.5)">${caps}</g>
    </g>`;
    layer.append(tree);
  });

  // Sparse, staggered flakes start at different heights without a sudden burst.
  for (let i = 0; i < 20; i++) {
    const flake = document.createElement('span');
    flake.className = 'winter-flake';
    flake.style.cssText = `--left:${(i * 37 + 3) % 100}%;--size:${2 + i % 3}px;--fall:${32 + i % 5 * 5}s;--delay:${-i * 7.3}s;--drift:${i % 2 ? -18 : 18}px;`;
    layer.append(flake);
  }
  document.body.prepend(layer);

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'winter-toggle';
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = preference.matches;
  function update() {
    layer.classList.toggle('paused', paused);
    toggle.textContent = paused ? '눈 재생' : '눈 멈추기';
    toggle.setAttribute('aria-pressed', String(!paused));
  }
  toggle.addEventListener('click', () => { paused = !paused; update(); });
  preference.addEventListener('change', event => { paused = event.matches; update(); });
  document.addEventListener('visibilitychange', () => layer.classList.toggle('tab-hidden', document.hidden));
  document.body.append(toggle);
  layer.classList.toggle('tab-hidden', document.hidden);
  update();
})();
