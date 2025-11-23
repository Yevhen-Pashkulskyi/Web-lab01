// === Отримання всіх необхідних елементів зі сторінки (DOM) ===
const phoneInput = document.getElementById('phoneInput');     // Поле для вводу номера телефону
const smsInput = document.getElementById('smsInput');         // Поле для вводу SMS-коду
const nextBtn = document.getElementById('nextBtn');           // Кнопка "Далі" на першому кроці
const loginBtn = document.getElementById('loginBtn');         // Кнопка "Далі" на другому кроці (вхід)
const step1 = document.getElementById('step1');               // Блок з першим кроком (введення номера)
const step2 = document.getElementById('step2');               // Блок з другим кроком (SMS-код)
const displayPhone = document.getElementById('displayPhone'); // Місце, де показується повний номер у заголовку
const maskedPhone = document.getElementById('maskedPhone');   // Місце, де показується замаскований номер (•• ••)
const resendTimer = document.getElementById('resendTimer');   // Текст з таймером повторної відправки

// Змінна для збереження чистих 9 цифр номера (без +380) — щоб використовувати пізніше
let phoneDigits = '';

// === 1. Обробка вводу номера телефону (форматування + валідація) ===
phoneInput.addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, ''); // Прибираємо всі символи, крім цифр (залишаємо тільки 0-9)

  // Якщо користувач вручну ввів "380" на початку — прибираємо їх, бо ми додамо +380 автоматично
  if (value.startsWith('380')) {
    value = value.substring(3);
  }

  // Український мобільний номер — завжди 9 цифр після +380. Обмежуємо введення
  if (value.length > 9) {
    value = value.substring(0, 9);
  }

  // Зберігаємо "чисті" 9 цифр у змінну — знадобиться при переході на наступний крок
  phoneDigits = value;

  // Форматуємо номер у вигляд: +380 (67) 123 45 67
  let formatted = '+380';
  if (value.length > 0) formatted += ' (' + value.substring(0, 2);        // +380 (
  if (value.length >= 2) formatted += ') ' + value.substring(2, 5);       // ) 123
  if (value.length >= 5) formatted += ' ' + value.substring(5, 7);        // 45
  if (value.length >= 7) formatted += ' ' + value.substring(7, 9);        // 67

  e.target.value = formatted; // Вставляємо відформатований номер назад у поле

  // Активуємо кнопку "Далі" тільки якщо введено повних 9 цифр
  nextBtn.disabled = value.length < 9;
});

// === 2. Перехід з першого кроку (номер) на другий (SMS-код) ===
nextBtn.addEventListener('click', function(e) {
  e.preventDefault(); // Зупиняємо стандартну відправку форми (бо це не <form>)

  // Складаємо повний номер з префіксом +380 та збереженими цифрами
  const fullNumber = '+380' + phoneDigits;

  // Показуємо гарний відформатований номер у заголовку другого кроку
  displayPhone.textContent = phoneInput.value;

  // Показуємо замаскований номер: наприклад, +380 67 123 •• ••
  maskedPhone.textContent = fullNumber.substring(0, 10) + ' •• ••';

  // Ховаємо перший крок, показуємо другий
  step1.classList.add('hidden');
  step2.classList.remove('hidden');

  // Автоматично ставимо курсор у поле для SMS-коду
  smsInput.focus();

  // Запускаємо зворотний відлік 60 секунд
  startResendTimer();
});

// === 3. Обробка вводу SMS-коду (тільки цифри, максимум 6) ===
smsInput.addEventListener('input', function() {
  // Прибираємо все, крім цифр, і обмежуємо до 6 символів
  this.value = this.value.replace(/\D/g, '').substring(0, 6);

  // Активуємо кнопку "Далі" тільки якщо введено рівно 6 цифр
  loginBtn.disabled = this.value.length !== 6;
});

// === 4. Обробка натискання кнопки "Далі" на кроці з SMS-кодом ===
loginBtn.addEventListener('click', function(e) {
  e.preventDefault(); // Зупиняємо будь-яку стандартну дію

  // Якщо кнопка неактивна — просто виходимо (захист від помилок)
  if (loginBtn.disabled) return;

  // Перевіряємо, чи користувач поставив галочку "Запам'ятати мене"
  const remember = document.getElementById('rememberMe').checked;

  // Формуємо різне повідомлення залежно від чекбокса
  const message = remember
    ? 'Вітаємо! Ви увійшли та будете запам’ятані на цьому пристрої.'
    : 'Вітаємо! Ви успішно увійшли в особистий кабінет Київстар!';

  alert(message); // Показуємо повідомлення про успішний вхід

  // Тут можна додати перехід на особисту сторінку:
  // location.href = 'cabinet.html';
});

// === 5. Таймер зворотного відліку для повторної відправки SMS ===
function startResendTimer() {
  let seconds = 60; // Починаємо з 60 секунд (як на справжньому сайті)

  // Запускаємо таймер, який оновлюється кожну секунду
  const timer = setInterval(() => {
    seconds--;
    // Оновлюємо текст: "Надіслати код повторно через 0:59", "0:58" тощо
    resendTimer.textContent = `Надіслати код повторно через 0:${seconds.toString().padStart(2, '0')}`;

    // Коли таймер дійшов до 0
    if (seconds <= 0) {
      clearInterval(timer); // Зупиняємо таймер
      resendTimer.textContent = 'Надіслати код повторно'; // Змінюємо текст
      resendTimer.style.color = '#0095eb';        // Робимо текст синім
      resendTimer.style.textDecoration = 'underline'; // Додаємо підкреслення
      resendTimer.style.cursor = 'pointer';       // Курсор-рука

      // Додаємо можливість клікнути і надіслати код ще раз
      resendTimer.onclick = () => {
        alert('Новий код надіслано!');
        startResendTimer(); // Перезапускаємо таймер
      };
    }
  }, 1000); // 1000 мс = 1 секунда
}
