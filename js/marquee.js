(() => {
  const root = document.querySelector('[data-marquee]');
  if (!root) return;

  const SPEED_PX_PER_SEC = 80; // скорость, меняй под себя

  function setup(track, direction /* 1 = L->R, -1 = R->L */) {
    // дублируем контент один раз (итого 2 копии)
    const originals = Array.from(track.children);
    originals.forEach(el => track.appendChild(el.cloneNode(true)));

    let x = 0;
    let last = performance.now();

    const loop = (now) => {
      const dt = (now - last) / 1000;
      last = now;

      const halfWidth = track.scrollWidth / 2; // ширина одной “копии”
      x += direction * SPEED_PX_PER_SEC * dt;

      // бесшовная петля
      if (direction === -1) {
        // движемся влево (x отриц)
        if (x <= -halfWidth) x += halfWidth;
      } else {
        // движемся вправо (x полож)
        if (x >= 0) x -= halfWidth;
      }

      track.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  const t1 = root.querySelector('[data-track="1"]');
  const t2 = root.querySelector('[data-track="2"]');

  // 1 строка: слева -> направо
  if (t1) setup(t1, +1);

  // 2 строка: справа -> налево
  if (t2) setup(t2, -1);
})();
