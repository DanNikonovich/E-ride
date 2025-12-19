(() => {
  // 1) Stars in form
  const rate = document.querySelector('[data-rate]');
  if (rate) {
    const fill = './components/svg/star_fill.svg';
    const stroke = './components/svg/star_stroke.svg';

    let value = 0;
    const stars = Array.from(rate.querySelectorAll('[data-star]'));

    const paint = () => {
      stars.forEach((btn) => {
        const n = Number(btn.dataset.star);
        const img = btn.querySelector('img');
        img.src = n <= value ? fill : stroke;
      });
    };

    stars.forEach((btn) => {
      btn.addEventListener('click', () => {
        value = Number(btn.dataset.star); // кликаешь 3 => 1..3 fill
        paint();
      });
    });

    paint();
  }

  // 2) Prevent page scroll when user scrolls inside reviews list
  const list = document.querySelector('[data-list]');
  if (list) {
    list.addEventListener('wheel', (e) => {
      const atTop = list.scrollTop === 0;
      const atBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 1;

      if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
        e.preventDefault();
      }
    }, { passive: false });
  }
})();
