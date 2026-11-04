(function () {
  if (!window.gsap) return;
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (window.Flip) gsap.registerPlugin(Flip);

  const ease = 'power3.out';
  const INTRO = '.hero .eyebrow, .hero-title .line, .hero-lede, .hero-actions, .hero-aside, .hero-base, .page-hero .wrap > *, .article-head > *';
  const REVEAL = [
    '.sec-label', '.section-copy > *', '.kicker-line', '.ventures .venture', '.project-note',
    '.section > .wrap > .eyebrow', '.section > .wrap > .section-title', '.two-panel > *', '.fact-item',
    '.timeline details', '.filters', '.card-list article', '.now-box', '.notice',
    '.article-body > *', '.contact-block .wrap > *'
  ].join(',');

  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', function () {
    gsap.from(INTRO, { autoAlpha: 0, y: 28, duration: 0.9, ease, stagger: 0.08, delay: 0.05, clearProps: 'transform' });

    if (!window.ScrollTrigger) return;
    // Skip elements nested inside another reveal target so nothing animates twice.
    const items = gsap.utils.toArray(REVEAL).filter(function (el) {
      return !el.parentElement.closest(REVEAL) && !el.closest('.hero, .page-hero, .article-head');
    });
    gsap.set(items, { autoAlpha: 0, y: 24 });
    ScrollTrigger.batch(items, {
      start: 'top 90%',
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, ease, stagger: 0.08, overwrite: true, clearProps: 'transform' });
      }
    });
  });

  // Decorative follower ring for mouse users only; the native cursor stays visible.
  gsap.matchMedia().add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', function () {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursor);
    const moveX = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
    const moveY = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
    const interactive = 'a, button, summary, .venture';
    function onMove(e) { moveX(e.clientX); moveY(e.clientY); cursor.classList.add('is-visible'); }
    function onOver(e) { cursor.classList.toggle('is-active', !!e.target.closest(interactive)); }
    function onLeave() { cursor.classList.remove('is-visible'); }
    addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return function () {
      removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cursor.remove();
    };
  });
})();
