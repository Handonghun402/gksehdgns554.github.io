(() => {
  const layer = document.createElement('div');
  layer.className = 'autumn-leaves';
  layer.setAttribute('aria-hidden', 'true');
  const colors = ['#a96340', '#b58242', '#a54e3e', '#bd9855'];
  const maple = 'M30 2 36 17 43 12 42 25 56 20 52 30 60 34 41 43 44 50 32 47 32 60 28 60 29 47 16 50 19 43 0 34 8 30 4 20 18 25 17 12 24 17Z';
  const leafSvg = `<svg viewBox="0 0 60 64" focusable="false"><path d="${maple}" fill="currentColor"/><path d="M30 12v44M30 37 15 29m15 8 15-8M30 29l-7-9m7 9 7-9" fill="none" stroke="#f4e5d3" stroke-width="1" opacity=".6"/></svg>`;
  ['left', 'right'].forEach((side, sideIndex) => {
    const edge = document.createElement('div');
    edge.className = `autumn-edge autumn-edge--${side}`;
    const tree = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    tree.setAttribute('viewBox', '0 0 160 800');
    tree.setAttribute('preserveAspectRatio', 'xMinYMin meet');
    tree.setAttribute('focusable', 'false');
    tree.classList.add('autumn-tree');
    const clusters = [[21,190,26,-25],[60,258,24,15],[102,316,22,35],[15,360,28,-30],[68,427,23,20],[113,477,20,-15],[35,525,23,15],[97,113,24,25],[48,80,28,-20],[119,63,20,20]];
    tree.innerHTML = `<g fill="none" stroke="#82705f" stroke-linecap="round"><path d="M-12 810Q35 660 21 494T8 185" stroke-width="8"/><path d="M24 620Q54 538 118 486M22 506Q58 432 78 393M20 439Q58 352 115 324M15 329Q40 258 69 237M11 243 26 177M49 550 38 512M68 528 92 526M48 389 50 348M80 353 103 358M-10 40Q54 30 136 81M39 40 62 92M90 57 102 129" stroke-width="3"/></g>` + clusters.map(([x,y,size,angle],i) => `<g transform="translate(${x-size/2} ${y-size/2}) rotate(${angle} ${size/2} ${size/2}) scale(${size/60})"><path d="${maple}" fill="${colors[(i+sideIndex)%colors.length]}"/></g>`).join('');
    edge.append(tree);
    [15, 43, 72, 90].forEach((left, n) => {
      const i = n + sideIndex * 4;
      const leaf = document.createElement('span');
      leaf.className = 'autumn-leaf';
      leaf.style.cssText = `--left:${left}%;--fall:${26 + i % 4 * 4}s;--delay:${-i * 5.7}s;--size:${18 + i % 3 * 5}px;--drift:${i % 2 ? -12 : 12}px;--color:${colors[i % colors.length]};--sway:${5 + i % 3}s;`;
      leaf.innerHTML = leafSvg;
      edge.append(leaf);
    });
    layer.append(edge);
  });
  document.body.prepend(layer);
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'autumn-toggle';
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = preference.matches;
  function update() {
    layer.classList.toggle('paused', paused);
    toggle.textContent = paused ? '낙엽 재생' : '낙엽 멈추기';
    toggle.setAttribute('aria-pressed', String(!paused));
  }
  toggle.addEventListener('click', () => { paused = !paused; update(); });
  preference.addEventListener('change', e => { paused = e.matches; update(); });
  document.addEventListener('visibilitychange', () => layer.classList.toggle('tab-hidden', document.hidden));
  document.body.append(toggle);
  update();
})();

