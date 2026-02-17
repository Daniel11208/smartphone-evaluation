const USERS = [
  { login: "admin", password: "adminpass", role: "admin" },
  { login: "user1", password: "pass123", role: "user" },
  { login: "user2", password: "pass123", role: "user" },
  { login: "user3", password: "pass123", role: "user" }
];

const PHONES_KEY = "phones";

const SMARTPHONES = {
  Apple: ["iPhone 11", "iPhone 12", "iPhone 13"],
  Samsung: ["Galaxy S10", "Galaxy S20", "Galaxy S21"],
  Google: ["Pixel 4", "Pixel 5", "Pixel 6"],
  Huawei: ["P30 Pro", "Mate 40 Pro", "P50 Pro"],
  Sony: ["Xperia 5", "Xperia 1 II", "Xperia 1 III"]
};

const ACCESSORIES = {
  Apple: ["AirPods 2", "MagSafe Charger"],
  Samsung: ["Galaxy Buds", "Wireless Charger"],
  Google: ["Pixel Buds", "Pixel Stand"],
  Huawei: ["FreeBuds 4", "SuperCharge"],
  Sony: ["WF-1000XM4", "LinkBuds Charger"]
};

const SMARTPHONE_BASE_PRICES = {
  "iPhone 11": 25000,
  "Galaxy S10": 18000,
  "Pixel 4": 15000,
  "P30 Pro": 20000,
  "Xperia 5": 22000,
  "iPhone 12": 30000,
  "Galaxy S20": 27000,
  "Pixel 5": 28000,
  "Mate 40 Pro": 35000,
  "Xperia 1 II": 40000,
  "iPhone 13": 38000,
  "Galaxy S21": 32000,
  "Pixel 6": 29000,
  "P50 Pro": 45000,
  "Xperia 1 III": 48000
};

const ACCESSORY_BASE_PRICES = {
  "AirPods 2": 5000,
  "Galaxy Buds": 4000,
  "Pixel Buds": 3500,
  "FreeBuds 4": 6000,
  "WF-1000XM4": 9000,
  "MagSafe Charger": 2500,
  "Wireless Charger": 2000,
  "Pixel Stand": 3000,
  "SuperCharge": 1500,
  "LinkBuds Charger": 2000
};

const CONDITION_MULTIPLIER = {
  Отличное: 1,
  Хорошее: 0.93,
  Среднее: 0.85
};

const STORAGE_MULTIPLIER = {
  "64": 0.95,
  "128": 1,
  "256": 1.08,
  "512": 1.15
};

const YEAR_MULTIPLIER = {
  "2019": 0.93,
  "2020": 0.98,
  "2021": 1.03
};

const ACCESSORY_KIND_MULTIPLIER = {
  Наушники: 1.06,
  Зарядка: 0.96,
  Чехлы: 0.8,
  Экраны: 1.1,
  Батареи: 1.02
};

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

function getModelList(type, brand) {
  if (!type || !brand) return [];
  if (type === "smartphone") return SMARTPHONES[brand] || [];
  if (type === "accessory") return ACCESSORIES[brand] || [];
  return [];
}

function updateModels() {
  const type = document.getElementById("itemType")?.value;
  const brand = document.getElementById("brand")?.value;
  const modelSelect = document.getElementById("model");
  const accessoryKind = document.getElementById("accessoryKind");
  if (!modelSelect) return;

  modelSelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Наименование";
  modelSelect.appendChild(placeholder);

  getModelList(type, brand).forEach((modelName) => {
    const option = document.createElement("option");
    option.value = modelName;
    option.textContent = modelName;
    modelSelect.appendChild(option);
  });

  if (accessoryKind) {
    accessoryKind.disabled = type !== "accessory";
    if (type !== "accessory") accessoryKind.value = "";
  }
}

function calculatePrice(item) {
  const conditionM = CONDITION_MULTIPLIER[item.condition] || 1;

  if (item.itemType === "accessory") {
    const base = ACCESSORY_BASE_PRICES[item.model] || 0;
    const kindM = ACCESSORY_KIND_MULTIPLIER[item.accessoryKind] || 1;
    const computed = base * conditionM * kindM;
    return Math.round(computed / 100) * 100;
  }

  const base = SMARTPHONE_BASE_PRICES[item.model] || 0;
  const storageM = STORAGE_MULTIPLIER[item.storage] || 1;
  const yearM = YEAR_MULTIPLIER[item.year] || 1;
  const computed = base * conditionM * storageM * yearM;
  return Math.round(computed / 100) * 100;
}

function updatePricePreview() {
  const priceInput = document.getElementById("price");
  if (!priceInput) return;

  const current = {
    itemType: document.getElementById("itemType")?.value,
    accessoryKind: document.getElementById("accessoryKind")?.value,
    condition: document.getElementById("condition")?.value,
    storage: document.getElementById("storage")?.value,
    year: document.getElementById("year")?.value,
    brand: document.getElementById("brand")?.value,
    model: document.getElementById("model")?.value
  };

  if (!current.itemType || !current.condition || !current.brand || !current.model) {
    priceInput.value = "";
    return;
  }

  if (current.itemType === "accessory" && !current.accessoryKind) {
    priceInput.value = "";
    return;
  }

  const value = calculatePrice(current);
  priceInput.value = value ? `${value}` : "";
}

function createCell(value) {
  const td = document.createElement("td");
  td.textContent = value;
  return td;
}

function deleteRow(index, tableId, role) {
  if (role !== "admin") return;
  const list = getPhones();
  list.splice(index, 1);
  savePhones(list);
  renderTable(tableId, list, role);
}

function renderTable(tableId, rows, role) {
  const tbody = document.getElementById(tableId);
  if (!tbody) return;

  tbody.innerHTML = "";
  const admin = role === "admin";

  if (!rows.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = admin ? 9 : 8;
    td.className = "empty-cell";
    td.textContent = "Записей пока нет";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  rows.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.appendChild(createCell(row.itemType === "accessory" ? "Аксессуар" : "Смартфон"));
    tr.appendChild(createCell(row.accessoryKind || "-"));
    tr.appendChild(createCell(row.condition));
    tr.appendChild(createCell(`${row.storage} ГБ`));
    tr.appendChild(createCell(row.year));
    tr.appendChild(createCell(row.brand));
    tr.appendChild(createCell(row.model));
    tr.appendChild(createCell(`${row.price} ₽`));

    if (admin) {
      const action = document.createElement("td");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "danger";
      btn.textContent = "Удалить";
      btn.addEventListener("click", () => deleteRow(index, tableId, role));
      action.appendChild(btn);
      tr.appendChild(action);
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

  document.getElementById("roleText").textContent = `Пользователь: ${getLogin()} | Роль: ${role}`;

  const actionHead = document.getElementById("actionHead");
  if (role !== "admin" && actionHead) actionHead.style.display = "none";

  if (role === "guest") {
    document.getElementById("phoneForm").style.display = "none";
    document.getElementById("guestNote").style.display = "block";
  }

  updateModels();
  renderTable("phoneTable", getPhones(), role);

  window.addItem = () => {
    if (role === "guest") return;

    const item = {
      itemType: document.getElementById("itemType").value,
      accessoryKind: document.getElementById("accessoryKind").value,
      condition: document.getElementById("condition").value,
      storage: document.getElementById("storage").value,
      year: document.getElementById("year").value,
      brand: document.getElementById("brand").value,
      model: document.getElementById("model").value,
      price: document.getElementById("price").value
    };

    const required = [item.itemType, item.condition, item.storage, item.year, item.brand, item.model, item.price];
    if (required.some((v) => !v)) {
      alert("Заполните все обязательные поля");
      return;
    }

    if (item.itemType === "accessory" && !item.accessoryKind) {
      alert("Выберите вид аксессуаров");
      return;
    }

    if (item.itemType === "smartphone") {
      item.accessoryKind = "";
    }

    const list = getPhones();
    list.push(item);
    savePhones(list);
    renderTable("phoneTable", list, role);

    document.getElementById("phoneForm").reset();
    updateModels();
    updatePricePreview();
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

  const actionHead = document.getElementById("dbActionHead");
  if (role !== "admin" && actionHead) actionHead.style.display = "none";

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
