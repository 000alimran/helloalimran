(function () {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close −' : 'Menu +';
    });
    nav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Menu +';
      });
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = 'Menu +'; }
    });
  }
  const here = location.pathname.replace(/\/+$/, '') || '/';
  document.querySelectorAll('.nav-list a').forEach(function(a) {
    const path = new URL(a.href, location.href).pathname.replace(/\/+$/, '') || '/';
    if (path === here || (path !== '/' && here.startsWith(path + '/'))) a.setAttribute('aria-current','page');
  });
  const buttons = document.querySelectorAll('[data-filter-button]');
  const cards = document.querySelectorAll('[data-type]');
  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const filter = btn.dataset.filterButton;
      const animate = window.Flip && !matchMedia('(prefers-reduced-motion: reduce)').matches;
      const state = animate ? Flip.getState(cards) : null;
      buttons.forEach(function(b) { b.setAttribute('aria-pressed', String(b === btn)); });
      cards.forEach(function(card) { card.hidden = filter !== 'all' && card.dataset.type !== filter; });
      if (state) Flip.from(state, {duration: 0.5, ease: 'power2.inOut', onEnter: function(els) { return gsap.fromTo(els, {autoAlpha: 0, y: 16}, {autoAlpha: 1, y: 0, duration: 0.4, clearProps: 'transform'}); }});
    });
  });
  const bar = document.querySelector('.progress');
  if (bar) {
    let ticking = false;
    function update() {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (max > 0 ? Math.min(100, scrollY/max*100) : 100) + '%';
      ticking = false;
    }
    addEventListener('scroll', function() {if(!ticking) {requestAnimationFrame(update); ticking = true;}}, {passive:true});
    addEventListener('resize', update);
    update();
  }
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
