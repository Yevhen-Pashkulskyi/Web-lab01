// Знаходимо всі посилання з класом js-click (ті, що мають відкривати меню)
const menuLinks = document.querySelectorAll('.js-click');

menuLinks.forEach(link => {
  link.addEventListener('click', function(event) {
    // 1. Скасовуємо стандартний перехід за посиланням
    event.preventDefault();

    // 2. Зупиняємо "спливання" кліку, щоб window.onclick не спрацював миттєво
    event.stopPropagation();

    // 3. Знаходимо меню, яке йде наступним після посилання (ul.dropdown або ul.dropright)
    const submenu = this.nextElementSibling;

    if (submenu) {
      // 4. Перемикаємо видимість меню
      submenu.classList.toggle('show');
      // Перемикаємо поворот стрілочки
      this.classList.toggle('active');
    }

    // 5. Закриваємо інші відкриті меню на цьому ж рівні (необов'язково, але гарно)
    const parentUl = this.closest('ul');
    if (parentUl) {
      const allSubmenusInThisLevel = parentUl.querySelectorAll('.show');
      allSubmenusInThisLevel.forEach(openMenu => {
        // Якщо це не те меню, яке ми щойно відкрили - закриваємо його
        if (openMenu !== submenu) {
          openMenu.classList.remove('show');
          const previousLink = openMenu.previousElementSibling;
          if(previousLink) previousLink.classList.remove('active');
        }
      });
    }
  });
});

// Глобальний клік по сторінці закриває всі меню
window.addEventListener('click', function() {
  // Знаходимо все, що відкрито
  const allOpenMenus = document.querySelectorAll('.show');
  const allActiveLinks = document.querySelectorAll('.js-click.active');

  // Приховуємо меню
  allOpenMenus.forEach(menu => {
    menu.classList.remove('show');
  });

  // Повертаємо стрілочки назад
  allActiveLinks.forEach(link => {
    link.classList.remove('active');
  });
});
