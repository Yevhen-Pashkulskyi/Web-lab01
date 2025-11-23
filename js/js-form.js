// Елементи DOM
const phoneInput = document.getElementById('phoneInput');
const smsInput = document.getElementById('smsInput');
const nextBtn = document.getElementById('nextBtn');
const loginBtn = document.getElementById('loginBtn');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const displayPhone = document.getElementById('displayPhone');
const maskedPhone = document.getElementById('maskedPhone');
const resendTimer = document.getElementById('resendTimer');

// Змінна для зберігання чистих 9 цифр номера (без +380)
let phoneDigits = '';

// === 1. Форматування та валідація номера телефону ===
phoneInput.addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, ''); // залишаємо тільки цифри

  // Якщо користувач ввів 380 на початку — прибираємо їх
  if (value.startsWith('380')) {
    value = value.substring(3);
  }

  // Обмежуємо до 9 цифр (український мобільний стандарт)
  if (value.length > 9) {
    value = value.substring(0, 9);
  }

  // Зберігаємо чисті цифри для подальшого використання
  phoneDigits = value;

  // Форматування: +380 (67) 123 45 67
  let formatted = '+380';
  if (value.length > 0) formatted += ' (' + value.substring(0, 2);
  if (value.length >= 2) formatted += ') ' + value.substring(2, 5);
  if (value.length >= 5) formatted += ' ' + value.substring(5, 7);
  if (value.length >= 7) formatted += ' ' + value.substring(7, 9);

  e.target.value = formatted;

  // Кнопка активна тільки при повних 9 цифрах
  nextBtn.disabled = value.length < 9;
});

// === 2. Перехід на крок з SMS-кодом ===
nextBtn.addEventListener('click', function(e) {
  e.preventDefault();

  // Повний номер для відображення
  const fullNumber = '+380' + phoneDigits;

  // Показуємо номер у заголовку
  displayPhone.textContent = phoneInput.value;

  // Маскуємо номер: +380 67 123 •• ••
  maskedPhone.textContent = fullNumber.substring(0, 10) + ' •• ••';

  // Перехід між кроками
  step1.classList.add('hidden');
  step2.classList.remove('hidden');

  // Фокус на поле SMS
  smsInput.focus();

  // Запускаємо таймер
  startResendTimer();
});

// === 3. Валідація SMS-коду (6 цифр) ===
smsInput.addEventListener('input', function() {
  // Дозволяємо тільки цифри
  this.value = this.value.replace(/\D/g, '').substring(0, 6);
  loginBtn.disabled = this.value.length !== 6;
});

// === 4. Успішний вхід ===
loginBtn.addEventListener('click', function(e) {
  e.preventDefault();
  if (loginBtn.disabled) return;

  const remember = document.getElementById('rememberMe').checked;
  const message = remember
    ? 'Вітаємо! Ви увійшли та будете запам’ятані на цьому пристрої.'
    : 'Вітаємо! Ви успішно увійшли в особистий кабінет Київстар!';

  alert(message);
  // location.href = 'cabinet.html';
});

// === 5. Таймер повторної відправки SMS ===
function startResendTimer() {
  let seconds = 55;

  const timer = setInterval(() => {
    seconds--;
    resendTimer.textContent = `Надіслати код повторно через 0:${seconds.toString().padStart(2, '0')}`;

    if (seconds <= 0) {
      clearInterval(timer);
      resendTimer.textContent = 'Надіслати код повторно';
      resendTimer.style.color = '#0095eb';
      resendTimer.style.textDecoration = 'underline';
      resendTimer.style.cursor = 'pointer';
      resendTimer.onclick = () => {
        alert('Новий код надіслано!');
        startResendTimer();
      };
    }
  }, 1000);
}
