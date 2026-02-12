// Добавление смартфона в таблицу на главной странице
const form = document.getElementById('addPhoneForm');
const smartphoneData = document.getElementById('smartphoneData');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const phoneName = document.getElementById('phoneName').value;
  const phoneBrand = document.getElementById('phoneBrand').value;
  const phoneMemory = document.getElementById('phoneMemory').value;
  const phoneCondition = document.getElementById('phoneCondition').value;
  const phonePrice = document.getElementById('phonePrice').value;

  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${phoneName}</td>
    <td>${phoneBrand}</td>
    <td>${phoneMemory} GB</td>
    <td>${phoneCondition}</td>
    <td>${phonePrice} ₽</td>
  `;
  
  smartphoneData.querySelector('tbody').appendChild(newRow);
  form.reset();
});

// Логика для регистрации и входа
const loginForm = document.getElementById('loginForm');
loginForm?.addEventListener('submit', function(event) {
  event.preventDefault();
  alert('Вы успешно вошли!');
});

const registerBtn = document.getElementById('registerBtn');
registerBtn?.addEventListener('click', function() {
  alert('Регистрация не реализована в этом примере.');
});
