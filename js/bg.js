(() => {
  // --- canvas ---
  const c = document.createElement('canvas');
  c.setAttribute('aria-hidden', 'true');
  c.style.cssText = `
    position:fixed; inset:0;
    width:100%; height:100%;
    z-index:-1;              /* строго под контентом */
    pointer-events:none;     /* не перекрывает клики */
  `;
  document.body.prepend(c);

  const ctx = c.getContext('2d', { alpha: true });

  // --- helpers ---
  const DPR = () => Math.min(window.devicePixelRatio || 1, 2);
  const rand = (a,b)=>a+Math.random()*(b-a);
  const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
  const lerp = (a,b,t)=>a+(b-a)*t;

  let W=0,H=0,dpr=1;
  const resize = () => {
    dpr = DPR();
    W = Math.floor(innerWidth);
    H = Math.floor(innerHeight);
    c.width  = Math.floor(W * dpr);
    c.height = Math.floor(H * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  };
  window.addEventListener('resize', resize, { passive:true });
  resize();

  // --- optional: если у тебя уже есть светло-серая "дымка" фоном, уменьши силу фигур ---
  const SETTINGS = {
    count: clamp(Math.round((W * H) / 150000), 18, 34), // было реже → стало больше
    speed: 0.14,         // чуть живее (можно 0.12 если надо медленнее)
    opacity: 0.22,       // заметнее (было ~0.12)
    blur: 32,            // меньше blur → цвет читается лучше
    drift: 0.75,
  };


  // --- blobs ---
  const blobs = [];
  const makeBlob = () => {
    const base  = rand(0.22, 0.42) * Math.min(W, H);  // больше по размеру
    const shade = rand(242, 255);                     // ближе к белому (ярче)
    const alpha = rand(0.16, 0.26) * SETTINGS.opacity * 6; // более заметно
    const points = Math.floor(rand(5, 9));           // разные формы

    return {
      x: rand(0, W),
      y: rand(0, H),
      r: base,
      vx: rand(-1, 1) * SETTINGS.speed,
      vy: rand(-1, 1) * SETTINGS.speed,
      shade,
      alpha,
      points,
      seed: rand(0, 1000),
      wobble: rand(0.0006, 0.0014), // скорость “перетекания”
    };
  };

  for (let i=0;i<SETTINGS.count;i++) blobs.push(makeBlob());

  // --- background blend: мягко, без “пятен” поверх контента ---
  // Сами фигуры рисуем *очень прозрачно* + blur, поэтому не перекрывают визуал.
  const drawBlob = (b, t) => {
    const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
    // центр чуть ярче, края растворяются
    g.addColorStop(0.00, `rgba(${b.shade},${b.shade},${b.shade},${b.alpha})`);
    g.addColorStop(0.55, `rgba(${b.shade},${b.shade},${b.shade},${b.alpha*0.55})`);
    g.addColorStop(1.00, `rgba(${b.shade},${b.shade},${b.shade},0)`);

    ctx.save();
    ctx.fillStyle = g;
    ctx.beginPath();

    // “мягкая форма” через точки по окружности с шумом
    const p = b.points;
    const step = (Math.PI * 2) / p;

    for (let i=0;i<=p;i++){
      const a = i * step;
      const noise =
        Math.sin((t*0.001 + b.seed) * 2.2 + i) * SETTINGS.drift +
        Math.cos((t*0.001 + b.seed) * 1.6 - i) * SETTINGS.drift;

      const rr = b.r * (1 + noise*0.07); // небольшая деформация
      const px = b.x + Math.cos(a) * rr;
      const py = b.y + Math.sin(a) * rr;

      if (i===0) ctx.moveTo(px, py);
      else ctx.quadraticCurveTo(b.x, b.y, px, py);
    }

    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  let last = performance.now();

  const tick = (now) => {
    const dt = Math.min(40, now - last);
    last = now;

    ctx.clearRect(0,0,W,H);

    // лёгкое “сведение” с прошлым (очень мягко), чтобы движение было плавным
    // (можно отключить, если хочешь)
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.filter = `blur(${SETTINGS.blur}px)`;
    ctx.globalAlpha = 1;

    for (const b of blobs) {
      // движение
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      // “дыхание” скорости — очень медленно
      const wob = Math.sin(now * b.wobble + b.seed) * 0.15;
      b.x += wob;
      b.y -= wob * 0.6;

      // мягкие границы (wrap)
      const pad = b.r * 0.65;
      if (b.x < -pad) b.x = W + pad;
      if (b.x > W + pad) b.x = -pad;
      if (b.y < -pad) b.y = H + pad;
      if (b.y > H + pad) b.y = -pad;

      drawBlob(b, now);
    }

    ctx.restore();

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
})();