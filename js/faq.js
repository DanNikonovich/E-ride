(() => {
  const root = document.querySelector('[data-faq]');
  if (!root) return;

  const items = Array.from(root.querySelectorAll('.faq-item'));

  const closeItem = (item) => {
    const btn = item.querySelector('.faq-q');
    const body = item.querySelector('.faq-a');
    item.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    body.style.maxHeight = '0px';
  };

  const openItem = (item) => {
    const btn = item.querySelector('.faq-q');
    const body = item.querySelector('.faq-a');
    item.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    body.style.maxHeight = body.scrollHeight + 'px';
  };

  items.forEach((item) => {
    const btn = item.querySelector('.faq-q');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // закрываем остальные
      items.forEach((it) => {
        if (it !== item) closeItem(it);
      });

      // переключаем текущий
      if (isOpen) closeItem(item);
      else openItem(item);
    });
  });

  // чтобы высота корректно пересчитывалась при ресайзе
  window.addEventListener('resize', () => {
    const open = root.querySelector('.faq-item.is-open .faq-a');
    if (open) open.style.maxHeight = open.scrollHeight + 'px';
  });
})();
