(() => {
  const target = document.querySelector('#contacts');
  if (!target) return;

  // Ловим все ссылки, которые ведут на #contacts
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href="#contacts"]');
    if (!a) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', '#contacts'); // чтобы якорь появился в URL (по желанию)
  });
})();
