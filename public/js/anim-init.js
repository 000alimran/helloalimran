// Runs before first paint so intro elements can start hidden; skipped for reduced motion.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('js-anim');
