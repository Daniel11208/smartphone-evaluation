const form = document.getElementById('addPhoneForm');

if (form) {
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

    smartphoneData?.querySelector('tbody')?.appendChild(newRow);
    form.reset();
  });
}
