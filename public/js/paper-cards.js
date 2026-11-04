// Venture cards start as crumpled paper balls (WebGL) and unfold into the card on click/tap/focus.
// The card's HTML stays the real content; the canvas is decoration. Without WebGL2 or with
// reduced motion the cards render exactly as before.
(function () {
  const grids = document.querySelectorAll('.ventures');
  if (!grids.length || !window.gsap) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const VERT = `#version 300 es
in vec3 aFlat; in vec3 aBall; in float aDelay; in vec3 aWrinkle;
uniform vec2 uSize; uniform vec3 uCenter; uniform mat3 uRot; uniform float uProgress; uniform float uLift;
out vec3 vPos;
void main() {
  // Patches open at different times; wrinkles peak mid-unfold so it reads as paper, not a balloon.
  float t = clamp(uProgress * 1.9 - aDelay * 0.9, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  vec3 ball = uRot * (aBall - uCenter) * (1.0 + uLift) + uCenter + vec3(0.0, uLift * 60.0, 0.0);
  vec3 p = mix(ball, aFlat, t) + aWrinkle * sin(3.14159 * t);
  vPos = p;
  gl_Position = vec4(p.x / (uSize.x * 0.5), p.y / (uSize.y * 0.5), -p.z / 2000.0, 1.0);
}`;
  const FRAG = `#version 300 es
precision highp float;
in vec3 vPos; uniform vec3 uColor; out vec4 outColor;
void main() {
  // Screen-space derivative normals give the faceted, folded-paper look.
  vec3 n = normalize(cross(dFdx(vPos), dFdy(vPos)));
  vec3 L = normalize(vec3(-0.45, 0.55, 0.7));
  // A flat sheet (n = +z) shades to exactly 1.0, so the open card matches its CSS colour.
  float shade = 1.0 + 0.6 * (dot(n, L) - L.z);
  outColor = vec4(uColor * clamp(shade, 0.35, 1.2), 1.0);
}`;

  function hash(x, y, z) { const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return h - Math.floor(h); }
  function noise(x, y, z) {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const xf = x - xi, yf = y - yi, zf = z - zi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
    function l(a, b, t) { return a + (b - a) * t; }
    return l(
      l(l(hash(xi, yi, zi), hash(xi + 1, yi, zi), u), l(hash(xi, yi + 1, zi), hash(xi + 1, yi + 1, zi), u), v),
      l(l(hash(xi, yi, zi + 1), hash(xi + 1, yi, zi + 1), u), l(hash(xi, yi + 1, zi + 1), hash(xi + 1, yi + 1, zi + 1), u), v),
      w);
  }
  function fbm(x, y, z) { let s = 0, a = 0.5, f = 1; for (let i = 0; i < 4; i++) { s += a * noise(x * f, y * f, z * f); f *= 2; a *= 0.5; } return s / 0.9375; }

  function buildMesh(w, h, seed) {
    const sx = 34, sy = Math.max(18, Math.min(48, Math.round(sx * h / w)));
    const count = (sx + 1) * (sy + 1);
    const flat = new Float32Array(count * 3), ball = new Float32Array(count * 3);
    const delay = new Float32Array(count), wrinkle = new Float32Array(count * 3);
    const R = Math.min(w, h) * 0.27, cy = h * 0.06;
    let k = 0;
    for (let j = 0; j <= sy; j++) {
      for (let i = 0; i <= sx; i++, k++) {
        const u = i / sx * 2 - 1, v = j / sy * 2 - 1;
        delay[k] = Math.min(1, 0.6 * Math.hypot(u, v) / 1.4142 + 0.4 * fbm(u * 3 + seed * 7, v * 3, 1));
        wrinkle[k * 3] = (fbm(u * 4 + seed, v * 4, 3) - 0.5) * R * 0.35;
        wrinkle[k * 3 + 1] = (fbm(u * 4, v * 4 + seed, 5) - 0.5) * R * 0.35;
        wrinkle[k * 3 + 2] = (1 - Math.abs(2 * fbm(u * 3.5, v * 3.5, seed + 9) - 1)) * R * 0.9 - R * 0.2;
        // Faint leftover creases once the sheet is flat.
        flat[k * 3] = u * w / 2; flat[k * 3 + 1] = v * h / 2;
        flat[k * 3 + 2] = (1 - Math.abs(2 * fbm(u * 2.5 + seed, v * 2.5, seed) - 1)) * 5;
        // Octahedral mapping wraps the whole square sheet around a sphere, then noise crumples it.
        let x = u, y = v, z = 1 - Math.abs(u) - Math.abs(v);
        if (z < 0) { const ox = x; x = (1 - Math.abs(y)) * (ox < 0 ? -1 : 1); y = (1 - Math.abs(ox)) * (y < 0 ? -1 : 1); }
        const len = Math.hypot(x, y, z); x /= len; y /= len; z /= len;
        const r = R * (0.78 + 0.42 * fbm(x * 1.8 + seed, y * 1.8, z * 1.8));
        const j1 = R * 0.3;
        ball[k * 3] = x * r + (fbm(x * 5 + seed + 11, y * 5, z * 5) - 0.5) * j1;
        ball[k * 3 + 1] = y * r * 1.08 + cy + (fbm(x * 5, y * 5 + seed + 23, z * 5) - 0.5) * j1;
        ball[k * 3 + 2] = z * r + (fbm(x * 5, y * 5, z * 5 + seed + 37) - 0.5) * j1;
      }
    }
    const idx = new Uint16Array(sx * sy * 6);
    let q = 0;
    for (let j = 0; j < sy; j++) {
      for (let i = 0; i < sx; i++) {
        const a = j * (sx + 1) + i, b = a + 1, c = a + sx + 1, d = c + 1;
        idx[q++] = a; idx[q++] = b; idx[q++] = d; idx[q++] = a; idx[q++] = d; idx[q++] = c;
      }
    }
    return { flat, ball, delay, wrinkle, idx, center: [0, cy, 0] };
  }

  function compile(gl, type, src) {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  function parseColor(str) {
    const m = str.match(/[\d.]+/g).map(Number);
    return str.startsWith('color(') ? m.slice(0, 3) : m.slice(0, 3).map(function (c) { return c / 255; });
  }

  function rotation(ax, ay) {
    const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
    // Column-major Ry * Rx
    return new Float32Array([cy, 0, -sy, sx * sy, cx, sx * cy, cx * sy, -sx, cx * cy]);
  }

  function setup(card, seed) {
    const canvas = document.createElement('canvas');
    canvas.className = 'paper-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl2', { antialias: true, premultipliedAlpha: true, alpha: true });
    if (!gl) return null;
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    const loc = {};
    ['uSize', 'uCenter', 'uRot', 'uProgress', 'uLift', 'uColor'].forEach(function (n) { loc[n] = gl.getUniformLocation(prog, n); });
    const vao = gl.createVertexArray();
    const buffers = { flat: gl.createBuffer(), ball: gl.createBuffer(), delay: gl.createBuffer(), wrinkle: gl.createBuffer(), idx: gl.createBuffer() };
    // Read before .is-paper makes the card background transparent.
    const color = parseColor(getComputedStyle(card).backgroundColor);
    const state = { progress: 0, lift: 0, ax: 0.5 + seed * 0.13, ay: -0.6 + seed * 0.21, open: false };
    let mesh = null, w = 0, h = 0, count = 0;

    function upload(name, data, size, attr) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers[name]);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const l = gl.getAttribLocation(prog, attr);
      gl.enableVertexAttribArray(l);
      gl.vertexAttribPointer(l, size, gl.FLOAT, false, 0, 0);
    }
    function resize() {
      const rect = card.getBoundingClientRect();
      if (!rect.width || (Math.abs(rect.width - w) < 1 && Math.abs(rect.height - h) < 1)) return;
      w = rect.width; h = rect.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      mesh = buildMesh(w, h, seed);
      gl.bindVertexArray(vao);
      upload('flat', mesh.flat, 3, 'aFlat');
      upload('ball', mesh.ball, 3, 'aBall');
      upload('delay', mesh.delay, 1, 'aDelay');
      upload('wrinkle', mesh.wrinkle, 3, 'aWrinkle');
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.idx);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.idx, gl.STATIC_DRAW);
      count = mesh.idx.length;
      draw();
    }
    function draw() {
      if (!mesh) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.useProgram(prog);
      gl.bindVertexArray(vao);
      const unwind = 1 - state.progress;
      gl.uniform2f(loc.uSize, w, h);
      gl.uniform3fv(loc.uCenter, mesh.center);
      gl.uniformMatrix3fv(loc.uRot, false, rotation(state.ax * unwind, state.ay * unwind));
      gl.uniform1f(loc.uProgress, state.progress);
      gl.uniform1f(loc.uLift, state.lift);
      gl.uniform3fv(loc.uColor, color);
      gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
    }
    return { canvas, state, draw, resize };
  }

  const touch = matchMedia('(hover: none)').matches;

  grids.forEach(function (grid) {
    const cards = Array.prototype.slice.call(grid.querySelectorAll('.venture'));
    let papers;
    try {
      papers = cards.map(function (card, i) { return setup(card, i + 1); });
    } catch (e) { return; }
    if (papers.some(function (p) { return !p; })) return;

    grid.classList.add('is-paper');
    cards.forEach(function (card, i) {
      const paper = papers[i];
      const content = card.querySelectorAll('.venture-top, .venture-body, .venture-footer');
      const caption = document.createElement('span');
      caption.className = 'paper-caption';
      caption.setAttribute('aria-hidden', 'true');
      const num = card.querySelector('.venture-top span');
      caption.innerHTML = '<b></b><em></em>';
      caption.querySelector('b').textContent = (num ? num.textContent + ' · ' : '') + card.querySelector('h3').textContent;
      caption.querySelector('em').textContent = touch ? 'Tap to unfold' : 'Click to unfold';
      card.prepend(paper.canvas);
      card.appendChild(caption);
      gsap.set(content, { autoAlpha: 0, y: 12 });
      paper.resize();
      new ResizeObserver(paper.resize).observe(card);

      function open() {
        if (paper.state.open) return;
        paper.state.open = true;
        card.classList.add('is-open');
        gsap.to(paper.state, { progress: 1, lift: 0, duration: 1.4, ease: 'power2.inOut', overwrite: true, onUpdate: paper.draw });
        gsap.to(caption, { autoAlpha: 0, duration: 0.3 });
        gsap.to(content, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07, delay: 0.95, ease: 'power3.out' });
      }
      card.addEventListener('click', function (e) {
        // The first click unfolds the paper; once open the card works as a normal link.
        if (!paper.state.open) { e.preventDefault(); open(); }
      });
      card.addEventListener('focus', function () { if (card.matches(':focus-visible')) open(); });
      card.addEventListener('pointerenter', function () {
        if (!paper.state.open) gsap.to(paper.state, { lift: 0.07, ay: paper.state.ay + 0.35, duration: 0.6, ease: 'power2.out', onUpdate: paper.draw });
      });
      card.addEventListener('pointerleave', function () {
        if (!paper.state.open) gsap.to(paper.state, { lift: 0, duration: 0.6, ease: 'power2.out', onUpdate: paper.draw });
      });
    });
  });
})();
