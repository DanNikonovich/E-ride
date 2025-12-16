(() => {
  const btn = document.querySelector('.hero__to-top');
  if (!btn) return;

  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  btn.addEventListener('click', (e) => {
    e.preventDefault();

    const start = window.pageYOffset;
    const duration = 700;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      window.scrollTo(0, start * (1 - eased));

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  });
})();
