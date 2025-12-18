(() => {
  const root = document.querySelector('[data-events]');
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll('.event-tab'));
  const img = root.querySelector('[data-events-img]');
  const label = root.querySelector('[data-events-label]');
  const list = root.querySelector('[data-events-list]');

  const DATA = {
    learn: {
      title: 'Обучающие занятия',
      img: 'components/actions/learn.jpg',
      items: [
        'Знакомство с байком и техникой безопасности',
        'Пробный заезд на картодроме',
        'Сопровождение инструктора',
        'Экшн-съёмка',
      ],
    },
    friends: {
      title: 'Дни рождения',
      img: 'components/actions/friends.jpg',
      items: [
        'Праздничное оформление',
        'Конкурсная программа',
        'Банкетная зона',
        'Экшн-съёмка',
      ],
    },
    turnir: {
      title: 'Турниры и чемпионаты',
      img: 'components/actions/turnir.jpg',
      items: [
        'Ежемесячные гонки',
        'Система рейтинга',
        'Кубки и медали',
        'Экшн-съёмка',
      ],
    },
  };

  const setActive = (type) => {
    tabs.forEach((btn) => {
      const isActive = btn.dataset.type === type;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');

      const ico = btn.querySelector('.event-tab__ico');
      const src = isActive ? btn.dataset.iconAct : btn.dataset.icon;
      if (ico && src) ico.src = src;
    });

    const cfg = DATA[type];
    if (!cfg) return;

    // картинка + подпись
    img.src = cfg.img;
    img.alt = cfg.title;
    label.textContent = cfg.title;

    // список
    list.innerHTML = cfg.items
      .map((t, i) => {
        const num = String(i + 1).padStart(2, '0');
        return `<li><span class="num">${num}</span><span class="txt">${t}</span></li>`;
      })
      .join('');
  };

  tabs.forEach((btn) => {
    btn.addEventListener('click', () => setActive(btn.dataset.type));
  });

  // по умолчанию первое
  setActive('learn');
})();
