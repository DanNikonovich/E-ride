(() => {
  const root = document.querySelector('[data-why]');
  if (!root) return;

  const spacer = root.querySelector('[data-spacer]');
  const slides = Array.from(root.querySelectorAll('[data-slide]'));
  const lastIndex = slides.length - 1;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const getRange = () => spacer.getBoundingClientRect().height - window.innerHeight;

  const lerp = (a, b, t) => a + (b - a) * t;

  // управление траекторией
  const X_START = -120; // % (слева)
  const X_END   = 120;  // % (вправо)

  const render = () => {
    const rect = root.getBoundingClientRect();
    const range = getRange();
    const scrolled = clamp(-rect.top, 0, range);
    const t = range > 0 ? scrolled / range : 0; // 0..1

    // делим скролл на “сцены” по количеству слайдов
    // каждый слайд занимает один сегмент, последний — с остановкой в центре
    const seg = 1 / slides.length;

    slides.forEach((el, i) => {
      el.classList.remove('is-locked');
      const start = i * seg;
      const end = (i + 1) * seg;

      // локальный прогресс внутри сегмента (0..1)
      const local = clamp((t - start) / seg, 0, 1);

      // по умолчанию: вне сегмента — скрыто
      if (t < start || t > end) {
        el.style.opacity = 0;
        // уводим влево чтобы не мигало
        el.style.transform = `translate(${X_START}%, -50%)`;
        return;
      }

      // последний: едет, потом “замок” в центре
      if (i === lastIndex) {
        // первые ~60% сегмента — едет к центру, дальше стоит
        const lockAt = 0.6;
        if (local >= lockAt) {
          el.classList.add('is-locked');
          return;
        }

        const moveT = local / lockAt; // 0..1 до момента фиксации
        const x = lerp(X_START, -50, moveT); // -50% = центр
        el.style.opacity = 1;
        el.style.transform = `translate(${x}%, -50%)`;
        return;
      }

      // обычные: едет горизонтально слева -> вправо
      const x = lerp(X_START, X_END, local);

      // плавное появление/исчезновение (чтобы следующий появлялся, когда предыдущий ушёл)
      // можно чуть “сжать” окна видимости
      const fadeInEnd = 0.15;
      const fadeOutStart = 0.85;

      let op = 1;
      if (local < fadeInEnd) op = local / fadeInEnd;
      if (local > fadeOutStart) op = (1 - local) / (1 - fadeOutStart);

      el.style.opacity = clamp(op, 0, 1);
      el.style.transform = `translate(${x}%, -50%)`;
    });

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
})();
