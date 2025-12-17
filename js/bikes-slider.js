(() => {
  const root = document.querySelector('[data-slider]');
  if (!root) return;

  const track = root.querySelector('[data-track]');
  const prev = root.querySelector('[data-prev]');
  const next = root.querySelector('[data-next]');
  const slides = Array.from(track.children);
  const priceTag = root.querySelector('#priceTag');

  let index = 0;
  let isAnimating = false;

  const update = () => {
    const x = -index * 100;
    track.style.transform = `translateX(${x}%)`;
    
    /* === ВОТ ЭТО НОВОЕ === */
    const color = slides[index].dataset.color;
    priceTag.style.setProperty('--tag-color', color);
    /* ==================== */
    
    const atStart = index === 0;
    const atEnd = index === slides.length - 1;
    
    prev.classList.toggle('is-disabled', atStart);
    prev.classList.toggle('is-active', !atStart);
    
    next.classList.toggle('is-disabled', atEnd);
    next.classList.toggle('is-active', !atEnd);
    
    prev.disabled = atStart;
    next.disabled = atEnd;
  };


  const shake = () => {
    root.classList.add('shake');
    setTimeout(() => root.classList.remove('shake'), 200);
  };

  const go = (dir) => {
    if (isAnimating) return;
    const nextIndex = index + dir;
    if (nextIndex < 0 || nextIndex >= slides.length) return;

    isAnimating = true;
    index = nextIndex;
    update();

    // ждём завершение 600ms анимации, потом лёгкий shake
    setTimeout(() => {
      shake();
      isAnimating = false;
    }, 600);
  };

  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));

  update();
})();
