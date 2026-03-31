const USERS = [
  { login: "admin", password: "adminpass", role: "admin" },
  { login: "user1", password: "pass123", role: "user" },
  { login: "user2", password: "pass123", role: "user" },
  { login: "user3", password: "pass123", role: "user" }
];

const PHONES_KEY = "phones";
const MIN_PRICE = 500;
const MAX_PRICE = 200000;

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

const CONDITIONS = ["Хорошее", "Отличное", "Среднее"];
const STORAGES = ["64", "128", "256", "512"];
const YEARS = ["2019", "2020", "2021"];
const BRANDS = ["Apple", "Samsung", "Google", "Huawei", "Sony"];
const ACCESSORY_KINDS = ["Наушники", "Зарядка", "Чехлы", "Экраны", "Батареи"];

const SMARTPHONE_BASE_PRICES = {
  "iPhone 11": 25000, "Galaxy S10": 18000, "Pixel 4": 15000, "P30 Pro": 20000, "Xperia 5": 22000,
  "iPhone 12": 30000, "Galaxy S20": 27000, "Pixel 5": 28000, "Mate 40 Pro": 35000, "Xperia 1 II": 40000,
  "iPhone 13": 38000, "Galaxy S21": 32000, "Pixel 6": 29000, "P50 Pro": 45000, "Xperia 1 III": 48000
};

const ACCESSORY_BASE_PRICES = {
  "AirPods 2": 5000, "Galaxy Buds": 4000, "Pixel Buds": 3500, "FreeBuds 4": 6000, "WF-1000XM4": 9000,
  "MagSafe Charger": 2500, "Wireless Charger": 2000, "Pixel Stand": 3000, "SuperCharge": 1500, "LinkBuds Charger": 2000
};

const CONDITION_MULTIPLIER = { Отличное: 1, Хорошее: 0.93, Среднее: 0.85 };
const STORAGE_MULTIPLIER = { "64": 0.95, "128": 1, "256": 1.08, "512": 1.15 };
const YEAR_MULTIPLIER = { "2019": 0.93, "2020": 0.98, "2021": 1.03 };
const ACCESSORY_KIND_MULTIPLIER = { Наушники: 1.06, Зарядка: 0.96, Чехлы: 0.8, Экраны: 1.1, Батареи: 1.02 };

function clampPrice(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.max(MIN_PRICE, Math.min(MAX_PRICE, Math.round(num / 100) * 100));
}

function getModelList(type, brand, kind) {
  if (type === "smartphone") return SMARTPHONES[brand] || [];
  if (type === "accessory" && kind === "Наушники") return ACCESSORIES[brand] || [];
  return [];
}

function updateFormFields() {
  const type = document.getElementById("itemType").value;

  const accessoryKind = document.getElementById("accessoryKind");
  const model = document.getElementById("model");
  const storage = document.getElementById("storage");
  const year = document.getElementById("year");

  const isSmartphone = type === "smartphone";
  const isAccessory = type === "accessory";

  // === СМАРТФОН ===
  if (isSmartphone) {
    accessoryKind.value = "";
    accessoryKind.disabled = true;

    storage.disabled = false;
    year.disabled = false;

    model.disabled = false;
  }

  // === АКСЕССУАР ===
  else if (isAccessory) {
    accessoryKind.disabled = false;

    storage.value = "";
    year.value = "";
    storage.disabled = true;
    year.disabled = true;

    const isHeadphones = accessoryKind.value === "Наушники";

    if (isHeadphones) {
      model.disabled = false;
    } else {
      model.disabled = true;
      model.innerHTML = '<option value="">— не требуется —</option>';
    }
  }

  // === НИЧЕГО НЕ ВЫБРАНО ===
  else {
    accessoryKind.disabled = false;
    storage.disabled = false;
    year.disabled = false;
    model.disabled = false;
  }
}

function isValidRecord(item) {
  if (!["smartphone","accessory"].includes(item.itemType)) return false;
  if (!CONDITIONS.includes(item.condition)) return false;
  if (!BRANDS.includes(item.brand)) return false;

  if (item.itemType === "accessory") {
    if (!ACCESSORY_KINDS.includes(item.accessoryKind)) return false;
    if (item.accessoryKind === "Наушники") {
      if (!getModelList("accessory", item.brand, "Наушники").includes(item.model)) return false;
    } else {
      if (item.model !== item.accessoryKind) return false;
    }
  }

  if (item.itemType === "smartphone") {
    if (!STORAGES.includes(item.storage) || !YEARS.includes(item.year)) return false;
  }

  const p = Number(item.price);
  return Number.isInteger(p) && p >= MIN_PRICE && p <= MAX_PRICE;
}

function sanitizeRecord(input) {
  let model = String(input.model || "");
  if (input.itemType === "accessory" && input.accessoryKind !== "Наушники") {
    model = input.accessoryKind;
  }

  const item = {
    itemType: String(input.itemType || ""),
    accessoryKind: String(input.accessoryKind || ""),
    condition: String(input.condition || ""),
    storage: String(input.storage || ""),
    year: String(input.year || ""),
    brand: String(input.brand || ""),
    model: model,
    price: clampPrice(input.price)
  };
  return isValidRecord(item) ? item : null;
}

function getPhones() {
  const raw = JSON.parse(localStorage.getItem(PHONES_KEY) || "[]");
  return Array.isArray(raw) ? raw.map(sanitizeRecord).filter(Boolean) : [];
}

function savePhones(phones) {
  const cleaned = Array.isArray(phones) ? phones.map(sanitizeRecord).filter(Boolean) : [];
  localStorage.setItem(PHONES_KEY, JSON.stringify(cleaned));
}

function getRole() { return localStorage.getItem("role"); }
function getLogin() { return localStorage.getItem("login") || "unknown"; }
function setSession(l, r) { localStorage.setItem("login", l); localStorage.setItem("role", r); }
function clearSession() { localStorage.removeItem("login"); localStorage.removeItem("role"); }

function login() {
  const lv = document.getElementById("login").value.trim();
  const pv = document.getElementById("password").value.trim();
  const user = USERS.find(u => u.login === lv && u.password === pv);
  if (!user) { alert("Неверные логин или пароль"); return; }
  setSession(user.login, user.role);
  window.location.href = "editor.html";
}
function loginGuest() { setSession("guest", "guest"); window.location.href = "editor.html"; }
function logout() { clearSession(); window.location.href = "index.html"; }

function calculatePrice(item) {
  const cm = CONDITION_MULTIPLIER[item.condition] || 1;
  if (item.itemType === "accessory") {
    return clampPrice((ACCESSORY_BASE_PRICES[item.model] || ACCESSORY_BASE_PRICES[item.accessoryKind] || 0) * cm * (ACCESSORY_KIND_MULTIPLIER[item.accessoryKind] || 1));
  }
  return clampPrice((SMARTPHONE_BASE_PRICES[item.model] || 0) * cm *
         (STORAGE_MULTIPLIER[item.storage] || 1) * (YEAR_MULTIPLIER[item.year] || 1));
}

function updateModels() {
  const type = document.getElementById("itemType").value;
  const brand = document.getElementById("brand").value;
  const kind = document.getElementById("accessoryKind").value;
  const modelSel = document.getElementById("model");

  // ВСЕГДА чистим
  modelSel.innerHTML = '<option value="">Наименование</option>';

  // если бренд пуст → ничего не делаем
  if (!brand) return;

  // === СМАРТФОН ===
  if (type === "smartphone") {
    const list = SMARTPHONES[brand];

    if (list && list.length) {
      list.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m;
        opt.textContent = m;
        modelSel.appendChild(opt);
      });
    }
  }

  // === АКСЕССУАР ===
  else if (type === "accessory") {

    if (kind === "Наушники") {
      const list = ACCESSORIES[brand];

      if (list && list.length) {
        list.forEach(m => {
          const opt = document.createElement("option");
          opt.value = m;
          opt.textContent = m;
          modelSel.appendChild(opt);
        });
      }
    } else {
      modelSel.innerHTML = '<option value="">— не требуется —</option>';
    }
  }

  updateFormFields();
  updatePricePreview();
}

function updateAccessoryKind() {
  updateModels();
}

function updatePricePreview() {
  const priceInput = document.getElementById("price");
  if (!priceInput) return;

  let model = document.getElementById("model").value;
  const kind = document.getElementById("accessoryKind").value;
  const type = document.getElementById("itemType").value;

  if (type === "accessory" && kind !== "Наушники") {
    model = kind;
  }

  const cur = {
    itemType: type,
    accessoryKind: kind,
    condition: document.getElementById("condition").value,
    storage: document.getElementById("storage").value,
    year: document.getElementById("year").value,
    brand: document.getElementById("brand").value,
    model: model
  };

  if (!cur.itemType || !cur.condition || !cur.brand ||
      (cur.itemType === "accessory" && !cur.accessoryKind) ||
      (cur.itemType === "smartphone" && (!cur.storage || !cur.year)) ||
      (cur.itemType === "accessory" && cur.accessoryKind === "Наушники" && !cur.model)) {
    priceInput.value = "";
    return;
  }

  priceInput.value = String(calculatePrice(cur));
}

function createCell(value) {
  const td = document.createElement("td");
  td.textContent = value || "—";
  return td;
}

function deleteRow(index, tableId, role) {
  if (role !== "admin") return;
  const list = getPhones();
  if (index < 0 || index >= list.length) return;
  list.splice(index, 1);
  savePhones(list);
  renderTable(tableId, getPhones(), role);
}

function renderTable(tableId, rows, role) {
  const tbody = document.getElementById(tableId);
  if (!tbody) return;
  tbody.innerHTML = "";
  const cleanRows = Array.isArray(rows) ? rows.map(sanitizeRecord).filter(Boolean) : [];
  const admin = role === "admin";

  if (!cleanRows.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = admin ? 9 : 8;
    td.className = "empty-cell";
    td.textContent = "Записей пока нет";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  cleanRows.forEach((row, i) => {
    const tr = document.createElement("tr");
    tr.appendChild(createCell(row.itemType === "accessory" ? "Аксессуар" : "Смартфон"));
    tr.appendChild(createCell(row.accessoryKind));
    tr.appendChild(createCell(row.condition));
    tr.appendChild(createCell(row.itemType === "smartphone" ? `${row.storage} ГБ` : "—"));
    tr.appendChild(createCell(row.itemType === "smartphone" ? row.year : "—"));
    tr.appendChild(createCell(row.brand));
    tr.appendChild(createCell(row.model));
    tr.appendChild(createCell(`${row.price} ₽`));

    if (admin) {
      const td = document.createElement("td");
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "danger"; btn.textContent = "Удалить";
      btn.addEventListener("click", () => deleteRow(i, tableId, role));
      td.appendChild(btn);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  });
}

function initEditorPage() {
  const role = getRole();
  if (!role) { window.location.href = "index.html"; return; }

  document.getElementById("roleText").textContent = `Пользователь: ${getLogin()} | Роль: ${role}`;

  if (role !== "admin") document.getElementById("actionHead").style.display = "none";

  if (role === "guest") {
    document.getElementById("phoneForm").style.display = "none";
    document.getElementById("guestNote").style.display = "block";
  }

  updateModels();
  renderTable("phoneTable", getPhones(), role);

  window.addItem = () => {
    if (role === "guest") return;

    let modelVal = document.getElementById("model").value;
    const kind = document.getElementById("accessoryKind").value;
    const type = document.getElementById("itemType").value;

    if (type === "accessory" && kind !== "Наушники") {
      modelVal = kind;
    }

    const item = {
      itemType: type,
      accessoryKind: kind,
      condition: document.getElementById("condition").value,
      storage: document.getElementById("storage").value,
      year: document.getElementById("year").value,
      brand: document.getElementById("brand").value,
      model: modelVal,
      price: document.getElementById("price").value
    };

    item.price = calculatePrice(item);
    const norm = sanitizeRecord(item);
    if (!norm) { alert("Проверьте поля: неверные данные"); return; }

    const list = getPhones();
    list.push(norm);
    savePhones(list);
    renderTable("phoneTable", getPhones(), role);

    document.getElementById("phoneForm").reset();
    updateModels();
  };

  window.goDB = () => window.location.href = "database.html";
}

function initIndexPage() { if (getRole()) window.location.href = "editor.html"; }

function initDatabasePage() {
  const role = getRole();
  if (!role) { window.location.href = "index.html"; return; }
  document.getElementById("dbRole").textContent = `Пользователь: ${getLogin()} | Роль: ${role}`;
  if (role !== "admin") document.getElementById("dbActionHead").style.display = "none";
  renderTable("dbTable", getPhones(), role);
  window.goEditor = () => window.location.href = "editor.html";
}

// Запуск
if (!localStorage.getItem(PHONES_KEY)) savePhones([]);

if (location.pathname.endsWith("index.html") || location.pathname === "/") initIndexPage();
if (location.pathname.endsWith("editor.html")) initEditorPage();
if (location.pathname.endsWith("database.html")) initDatabasePage();
