(function () {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  // Запуск анимаций после загрузки (чтобы старт был ч/б)
  const start = () => hero.classList.add("is-animating");

  // Если картинка уже в кеше — load может не сработать, поэтому:
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }
})();
