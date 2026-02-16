// ====== ДАННЫЕ ======

const users = [
{login:"user1",password:"pass123",role:"User"},
{login:"admin1",password:"adminpass",role:"Admin"},
{login:"guest1",password:"guest",role:"Guest"},
{login:"expert1",password:"exp123",role:"Expert"}
];

const phonesData = [
{id:1,name:"iPhone 11",brand:"Apple",year:2019,memory:64,condition:"Хорошее",price:25000},
{id:2,name:"Galaxy S10",brand:"Samsung",year:2019,memory:128,condition:"Отличное",price:18000},
{id:3,name:"Pixel 4",brand:"Google",year:2019,memory:64,condition:"Среднее",price:15000},
{id:4,name:"P30 Pro",brand:"Huawei",year:2019,memory:256,condition:"Хорошее",price:20000},
{id:5,name:"Xperia 5",brand:"Sony",year:2019,memory:128,condition:"Отличное",price:22000},
{id:6,name:"iPhone 12",brand:"Apple",year:2020,memory:128,condition:"Хорошее",price:30000},
{id:7,name:"Galaxy S20",brand:"Samsung",year:2020,memory:128,condition:"Среднее",price:27000},
{id:8,name:"Pixel 5",brand:"Google",year:2020,memory:128,condition:"Отличное",price:28000},
{id:9,name:"Mate 40 Pro",brand:"Huawei",year:2020,memory:256,condition:"Хорошее",price:35000},
{id:10,name:"Xperia 1 II",brand:"Sony",year:2020,memory:256,condition:"Среднее",price:40000},
{id:11,name:"iPhone 13",brand:"Apple",year:2021,memory:256,condition:"Отличное",price:38000},
{id:12,name:"Galaxy S21",brand:"Samsung",year:2021,memory:256,condition:"Хорошее",price:32000},
{id:13,name:"Pixel 6",brand:"Google",year:2021,memory:256,condition:"Среднее",price:29000},
{id:14,name:"P50 Pro",brand:"Huawei",year:2021,memory:512,condition:"Отличное",price:45000},
{id:15,name:"Xperia 1 III",brand:"Sony",year:2021,memory:256,condition:"Хорошее",price:48000}
];

// ====== ИНИЦИАЛИЗАЦИЯ ======

if(!localStorage.getItem("phones")){
localStorage.setItem("phones",JSON.stringify(phonesData));
}

// ====== АВТОРИЗАЦИЯ ======

const loginForm=document.getElementById("loginForm");
loginForm?.addEventListener("submit",e=>{
e.preventDefault();
const login=document.getElementById("login").value;
const password=document.getElementById("password").value;
const user=users.find(u=>u.login===login && u.password===password);
if(user){
localStorage.setItem("currentUser",JSON.stringify(user));
window.location="dashboard.html";
}else alert("Неверные данные");
});

document.getElementById("guestBtn")?.addEventListener("click",()=>{
localStorage.setItem("currentUser",JSON.stringify({login:"guest",role:"Guest"}));
window.location="dashboard.html";
});

// ====== ПРОВЕРКА ДОСТУПА ======

const currentUser=JSON.parse(localStorage.getItem("currentUser"));
if(!currentUser && location.pathname.includes("dashboard")) window.location="index.html";

// ====== DASHBOARD ======

function renderPhones(){
const table=document.getElementById("phonesTable");
if(!table) return;

let phones=JSON.parse(localStorage.getItem("phones"));

table.innerHTML="<tr><th>ID</th><th>Название</th><th>Бренд</th><th>Цена</th><th>Действия</th></tr>";

phones.forEach(p=>{
let actions="";
if(currentUser.role==="Admin" || currentUser.role==="User"){
actions+=`<button onclick="editPhone(${p.id})">Ред.</button>`;
}
if(currentUser.role==="Admin"){
actions+=`<button onclick="deletePhone(${p.id})">Удал.</button>`;
}

table.innerHTML+=`
<tr>
<td>${p.id}</td>
<td>${p.name}</td>
<td>${p.brand}</td>
<td>${p.price}</td>
<td>${actions}</td>
</tr>`;
});
}
renderPhones();

function deletePhone(id){
let phones=JSON.parse(localStorage.getItem("phones"));
phones=phones.filter(p=>p.id!==id);
localStorage.setItem("phones",JSON.stringify(phones));
renderPhones();
}

function editPhone(id){
let phones=JSON.parse(localStorage.getItem("phones"));
let phone=phones.find(p=>p.id===id);
let newPrice=prompt("Новая цена:",phone.price);
phone.price=parseInt(newPrice);
localStorage.setItem("phones",JSON.stringify(phones));
renderPhones();
}

// ====== DATABASE ======

function goDatabase(){window.location="database.html";}
function goDashboard(){window.location="dashboard.html";}
function logout(){localStorage.removeItem("currentUser");window.location="index.html";}

const dbPhones=document.getElementById("dbPhones");
if(dbPhones){
let phones=JSON.parse(localStorage.getItem("phones"));
dbPhones.innerHTML="<tr><th>ID</th><th>Название</th><th>Цена</th></tr>";
phones.forEach(p=>{
dbPhones.innerHTML+=`<tr><td>${p.id}</td><td>${p.name}</td><td>${p.price}</td></tr>`;
});
}

const dbUsers=document.getElementById("dbUsers");
if(dbUsers){
dbUsers.innerHTML="<tr><th>Логин</th><th>Роль</th></tr>";
users.forEach(u=>{
dbUsers.innerHTML+=`<tr><td>${u.login}</td><td>${u.role}</td></tr>`;
});
}
