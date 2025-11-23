// Елементи
const phoneInput = document.getElementById('phoneInput');
const smsInput = document.getElementById('smsInput');
const nextBtn = document.getElementById('nextBtn');
const loginBtn = document.getElementById('loginBtn');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const displayPhone = document.getElementById('displayPhone');
const maskedPhone = document.getElementById('maskedPhone');
const resendTimer = document.getElementById('resendTimer');

// Форматування номера +380 (••) ••• •• ••
phoneInput.addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');

  if (value.length > 12) value = value.slice(0, 12);
  if (value.startsWith('380')) value = value.slice(3);

  let formatted = '';
  if (value.length > 0) formatted = '+380 ';
  if (value.length > 0) formatted += '(' + value.slice(0, 2);
  if (value.length >= 2) formatted += ') ' + value.slice(2, 5);
  if (value.length >= 5) formatted += ' ' + value.slice(5, 7);
  if (value.length >= 7) formatted += ' ' + value.slice(7, 9);

  e.target.value = formatted;

  // Активуємо кнопку, якщо введено мінімум 9 цифр після 380
  nextBtn.disabled = value.length < 9;
});

// Перехід на крок з SMS-кодом
nextBtn.addEventListener('click', function(e) {
  e.preventDefault();

  const clean = phoneInput.value.replace(/\D/g, '');
  const fullNumber = '+380' + clean.slice(3);

  displayPhone.textContent = phoneInput.value;
  maskedPhone.textContent = fullNumber.slice(0, -4) + ' •• ••';

  step1.classList.add('hidden');
  step2.classList.remove('hidden');

  smsInput.focus();
  startResendTimer();
});

// Активація кнопки при введенні 6 цифр
smsInput.addEventListener('input', function() {
  loginBtn.disabled = this.value.length !== 6;
});

// Успішний вхід
loginBtn.addEventListener('click', function(e) {
  e.preventDefault();
  alert('Вітаємо! Ви успішно увійшли в особистий кабінет Київстар!');
  // location.href = 'cabinet.html';
});

// Таймер повторної відправки
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
    }
  }, 1000);
}
