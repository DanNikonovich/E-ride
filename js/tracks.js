(() => {
  const root = document.querySelector('.tracks');
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll('[data-tab]'));
  const panels = Array.from(root.querySelectorAll('[data-panel]'));

  const showPanel = (name) => {
    tabs.forEach(t => {
      const is = t.dataset.tab === name;
      t.classList.toggle('is-active', is);
      t.setAttribute('aria-selected', is ? 'true' : 'false');
    });
    panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === name));
  };

  tabs.forEach(btn => {
    btn.addEventListener('click', () => showPanel(btn.dataset.tab));
  });

  // ROUTES: expand -> play video
  const grid = root.querySelector('[data-routes-grid]');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.route-card'));

  const closeAll = () => {
    grid.classList.remove('is-expanded');
    cards.forEach(c => {
      c.classList.remove('is-open');
      const v = c.querySelector('video');
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    });
  };

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const isOpen = card.classList.contains('is-open');
    
      // если клик по уже открытому — закрыть всё
      if (isOpen){
        closeAll();
        return;
      }
    
      // НЕ закрываем всё полностью — просто переключаем активную
      grid.classList.add('is-expanded');
    
      cards.forEach(c => {
        const v = c.querySelector('video');
        if (c !== card) {
          c.classList.remove('is-open');
          if (v) { v.pause(); v.currentTime = 0; }
        }
      });
    
      card.classList.add('is-open');
    
      const video = card.querySelector('video');
      if (video) {
        video.controls = false;
        video.muted = true;
        video.playsInline = true;
        const p = video.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      }
    });
  });


})();
