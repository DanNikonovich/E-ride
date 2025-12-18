(() => {
  const root = document.querySelector('[data-why]');
  if (!root) return;

  const spacer = root.querySelector('[data-spacer]');
  const slides = Array.from(root.querySelectorAll('[data-slide]'));
  const lastIndex = slides.length - 1;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  // Позиции в процентах для translateX(...)
  // Центр = -50% (если элемент позиционируется left:50%)
  const X_CENTER = -50;
  const X_RIGHT  = 120;   // за правым краем
  const X_LEFT   = -220;  // далеко влево (чтобы точно ушёл)

  const getRange = () => spacer.getBoundingClientRect().height - window.innerHeight;

  const render = () => {
    const rect = root.getBoundingClientRect();
    const range = getRange();
    const scrolled = clamp(-rect.top, 0, range);
    const t = range > 0 ? clamp(scrolled / range, 0, 1) : 0; // 0..1

    const seg = 1 / slides.length;

    slides.forEach((el, i) => {
      const start = i * seg;
      const end = (i + 1) * seg;
      const local = clamp((t - start) / seg, 0, 1);

      // По умолчанию прячем
      el.style.opacity = 0;

      // Вне сегмента — уводим в безопасную позицию
      if (t < start) {
        // ещё не время: ждёт справа
        el.style.transform = `translate(${X_RIGHT}%, -50%)`;
        return;
      }
      if (t > end) {
        // уже прошло: ушёл влево
        el.style.transform = `translate(${X_LEFT}%, -50%)`;
        return;
      }

      // Теперь мы внутри сегмента -> показываем и двигаем
      el.style.opacity = 1;

      // Первый: стартует сразу в центре
      if (i === 0) {
        // 0..1: центр -> уезжает влево
        const x = lerp(X_CENTER, X_LEFT, local);
        el.style.transform = `translate(${x}%, -50%)`;
        return;
      }

      // Последний: приезжает к центру и в конце остаётся в центре
      if (i === lastIndex) {
        // 0..1: справа -> центр
        const x = lerp(X_RIGHT, X_CENTER, local);
        el.style.transform = `translate(${x}%, -50%)`;
        return;
      }

      // Обычные: справа -> центр -> влево (двухфазно)
      // 0..0.5: right -> center
      // 0.5..1: center -> left
      if (local <= 0.5) {
        const x = lerp(X_RIGHT, X_CENTER, local / 0.5);
        el.style.transform = `translate(${x}%, -50%)`;
      } else {
        const x = lerp(X_CENTER, X_LEFT, (local - 0.5) / 0.5);
        el.style.transform = `translate(${x}%, -50%)`;
      }

      // мягкие fade-in/out, чтобы следующий появлялся когда прошлый ушёл
      const fadeInEnd = 0.15;
      const fadeOutStart = 0.85;

      let op = 1;
      if (local < fadeInEnd) op = local / fadeInEnd;
      if (local > fadeOutStart) op = (1 - local) / (1 - fadeOutStart);
      el.style.opacity = clamp(op, 0, 1);
    });

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
})();
