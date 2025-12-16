(() => {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.mnav');
  const closeBtn = document.querySelector('.mnav__close');

  if (!burger || !menu) return;

  const open = () => {
    document.body.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
  };

  const close = () => {
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  };

  burger.addEventListener('click', () => {
    document.body.classList.contains('menu-open') ? close() : open();
  });

  closeBtn?.addEventListener('click', close);

  // клик по фону
  menu.addEventListener('click', (e) => {
    if (e.target === menu) close();
  });

  // Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // закрывать при клике по ссылке
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();
