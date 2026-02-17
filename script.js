const USERS = [
  { login: "admin", password: "adminpass", role: "admin" },
  { login: "user1", password: "pass123", role: "user" },
  { login: "user2", password: "pass123", role: "user" },
  { login: "user3", password: "pass123", role: "user" }
];

const MODELS_BY_BRAND = {
  Apple: ["iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15"],
  Samsung: ["Galaxy S21", "Galaxy S22", "Galaxy S23", "Galaxy A54"],
  Google: ["Pixel 6", "Pixel 7", "Pixel 8"],
  Xiaomi: ["Redmi Note 12", "Xiaomi 13", "Xiaomi 14"],
  Huawei: ["P40", "P50", "Mate 50"]
};

const YEARS = ["2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"];
const PHONES_KEY = "phones";

function getPhones() {
  return JSON.parse(localStorage.getItem(PHONES_KEY) || "[]");
}

function savePhones(phones) {
  localStorage.setItem(PHONES_KEY, JSON.stringify(phones));
}

function getRole() {
  return localStorage.getItem("role");
}

function getLogin() {
  return localStorage.getItem("login") || "unknown";
}

function setSession(login, role) {
  localStorage.setItem("login", login);
  localStorage.setItem("role", role);
}

function clearSession() {
  localStorage.removeItem("login");
  localStorage.removeItem("role");
}

function login() {
  const loginValue = document.getElementById("login").value.trim();
  const passwordValue = document.getElementById("password").value.trim();
  const user = USERS.find((u) => u.login === loginValue && u.password === passwordValue);

  if (!user) {
    alert("Неверные логин или пароль");
    return;
  }

  setSession(user.login, user.role);
  window.location.href = "editor.html";
}

function loginGuest() {
  setSession("guest", "guest");
  window.location.href = "editor.html";
}

function logout() {
  clearSession();
  window.location.href = "index.html";
}

function updateModels() {
  const brand = document.getElementById("brand")?.value;
  const modelSelect = document.getElementById("model");
  if (!modelSelect) return;

  modelSelect.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Модель";
  modelSelect.appendChild(placeholder);

  const models = MODELS_BY_BRAND[brand] || [];
  models.forEach((modelName) => {
    const option = document.createElement("option");
    option.value = modelName;
    option.textContent = modelName;
    modelSelect.appendChild(option);
  });
}

function createCell(value) {
  const td = document.createElement("td");
  td.textContent = value;
  return td;
}

function deletePhoneByIndex(index, tableId, role) {
  if (role !== "admin") return;

  const phones = getPhones();
  phones.splice(index, 1);
  savePhones(phones);
  renderTable(tableId, phones, role);
}

function renderTable(tableId, phones, role) {
  const tbody = document.getElementById(tableId);
  if (!tbody) return;

  tbody.innerHTML = "";
  const isAdmin = role === "admin";

  if (phones.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = isAdmin ? 12 : 11;
    td.className = "empty-cell";
    td.textContent = "Записей пока нет";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  phones.forEach((phone, index) => {
    const tr = document.createElement("tr");
    tr.appendChild(createCell(phone.brand));
    tr.appendChild(createCell(phone.model));
    tr.appendChild(createCell(phone.year));
    tr.appendChild(createCell(phone.condition));
    tr.appendChild(createCell(`${phone.storage} ГБ`));
    tr.appendChild(createCell(`${phone.ram} ГБ`));
    tr.appendChild(createCell(`${phone.battery} мАч`));
    tr.appendChild(createCell(`${phone.camera} Мп`));
    tr.appendChild(createCell(phone.screen));
    tr.appendChild(createCell(phone.cpu));
    tr.appendChild(createCell(`${phone.price} ₽`));

    if (isAdmin) {
      const actionsCell = document.createElement("td");
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "danger";
      deleteBtn.textContent = "Удалить";
      deleteBtn.addEventListener("click", () => deletePhoneByIndex(index, tableId, role));
      actionsCell.appendChild(deleteBtn);
      tr.appendChild(actionsCell);
    }

    tbody.appendChild(tr);
  });
}

function initEditorPage() {
  const role = getRole();
  if (!role) {
    window.location.href = "index.html";
    return;
  }

  const roleText = document.getElementById("roleText");
  roleText.textContent = `Пользователь: ${getLogin()} | Роль: ${role}`;

  const yearSelect = document.getElementById("year");
  YEARS.forEach((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  });

  const actionHead = document.getElementById("actionHead");
  if (role !== "admin" && actionHead) {
    actionHead.style.display = "none";
  }

  if (role === "guest") {
    const form = document.getElementById("phoneForm");
    const note = document.getElementById("guestNote");
    if (form) form.style.display = "none";
    if (note) note.style.display = "block";
  }

  renderTable("phoneTable", getPhones(), role);

  window.addPhone = () => {
    if (role === "guest") return;

    const phone = {
      brand: document.getElementById("brand").value,
      model: document.getElementById("model").value,
      year: document.getElementById("year").value,
      condition: document.getElementById("condition").value,
      storage: document.getElementById("storage").value,
      ram: document.getElementById("ram").value,
      battery: document.getElementById("battery").value,
      camera: document.getElementById("camera").value,
      screen: document.getElementById("screen").value.trim(),
      cpu: document.getElementById("cpu").value.trim(),
      price: document.getElementById("price").value
    };

    const hasEmptyFields = Object.values(phone).some((v) => String(v).trim() === "");
    if (hasEmptyFields) {
      alert("Заполните все поля перед добавлением");
      return;
    }

    const phones = getPhones();
    phones.push(phone);
    savePhones(phones);
    renderTable("phoneTable", phones, role);

    document.getElementById("phoneForm").reset();
    updateModels();
  };

  window.goDB = () => {
    window.location.href = "database.html";
  };
}

function initDatabasePage() {
  const role = getRole();
  if (!role) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("dbRole").textContent = `Пользователь: ${getLogin()} | Роль: ${role}`;

  const dbActionHead = document.getElementById("dbActionHead");
  if (role !== "admin" && dbActionHead) {
    dbActionHead.style.display = "none";
  }

  renderTable("dbTable", getPhones(), role);

  window.goEditor = () => {
    window.location.href = "editor.html";
  };
}

if (!localStorage.getItem(PHONES_KEY)) {
  savePhones([]);
}

if (location.pathname.endsWith("editor.html")) {
  initEditorPage();
}

if (location.pathname.endsWith("database.html")) {
  initDatabasePage();
}
