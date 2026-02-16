// ===== Пользователи =====
const users=[
{login:"admin1",password:"adminpass",role:"admin"},
{login:"user1",password:"pass123",role:"user"},
{login:"guest",password:"guest",role:"guest"}
];

// ===== Данные смартфонов =====
const defaultPhones=[
{name:"iPhone 11",brand:"Apple",year:2019,memory:64,condition:"Хорошее",price:25000},
{name:"Galaxy S10",brand:"Samsung",year:2019,memory:128,condition:"Отличное",price:18000},
{name:"Pixel 4",brand:"Google",year:2019,memory:64,condition:"Среднее",price:15000},
{name:"P30 Pro",brand:"Huawei",year:2019,memory:256,condition:"Хорошее",price:20000},
{name:"Xperia 5",brand:"Sony",year:2019,memory:128,condition:"Отличное",price:22000},
{name:"iPhone 12",brand:"Apple",year:2020,memory:128,condition:"Хорошее",price:30000},
{name:"Galaxy S20",brand:"Samsung",year:2020,memory:128,condition:"Среднее",price:27000},
{name:"Pixel 5",brand:"Google",year:2020,memory:128,condition:"Отличное",price:28000},
{name:"Mate 40 Pro",brand:"Huawei",year:2020,memory:256,condition:"Хорошее",price:35000},
{name:"Xperia 1 II",brand:"Sony",year:2020,memory:256,condition:"Среднее",price:40000},
{name:"iPhone 13",brand:"Apple",year:2021,memory:256,condition:"Отличное",price:38000},
{name:"Galaxy S21",brand:"Samsung",year:2021,memory:256,condition:"Хорошее",price:32000},
{name:"Pixel 6",brand:"Google",year:2021,memory:256,condition:"Среднее",price:29000},
{name:"P50 Pro",brand:"Huawei",year:2021,memory:512,condition:"Отличное",price:45000},
{name:"Xperia 1 III",brand:"Sony",year:2021,memory:256,condition:"Хорошее",price:48000}
];

// если первый запуск
if(!localStorage.getItem("phones")){
localStorage.setItem("phones",JSON.stringify(defaultPhones));
}

// ===== Вход =====
function login(){
const l=document.getElementById("login").value.trim();
const p=document.getElementById("password").value.trim();
const user=users.find(u=>u.login===l&&u.password===p);

if(user){
localStorage.setItem("role",user.role);
window.location="editor.html";
}else alert("Неверные данные");
}

function logout(){
localStorage.removeItem("role");
window.location="index.html";
}

// ===== РЕДАКТОР =====
if(location.pathname.includes("editor.html")){

const role=localStorage.getItem("role");
if(!role) window.location="index.html";

document.getElementById("roleText").innerHTML=
`<span class="role-badge">Роль: ${role}</span>`;

let phones=JSON.parse(localStorage.getItem("phones"));
render();

function render(){
const table=document.getElementById("phoneTable");
table.innerHTML="";
phones.forEach((p,i)=>{
table.innerHTML+=`
<tr>
<td>${p.name}</td>
<td>${p.brand}</td>
<td>${p.year}</td>
<td>${p.memory}GB</td>
<td>${p.condition}</td>
<td>${p.price}₽</td>
${role==="admin"?`<td><button onclick="deletePhone(${i})">Удалить</button></td>`:""}
</tr>`;
});
}

window.deletePhone=function(i){
if(role!=="admin")return;
phones.splice(i,1);
localStorage.setItem("phones",JSON.stringify(phones));
render();
}

window.goDatabase=()=>location="database.html";
}

// ===== БД =====
if(location.pathname.includes("database.html")){

const role=localStorage.getItem("role");
if(!role) window.location="index.html";

document.getElementById("dbRole").innerHTML=
`<span class="role-badge">Роль: ${role}</span>`;

let phones=JSON.parse(localStorage.getItem("phones"));
const table=document.getElementById("dbTable");

phones.forEach(p=>{
table.innerHTML+=`
<tr>
<td>${p.name}</td>
<td>${p.brand}</td>
<td>${p.year}</td>
<td>${p.memory}GB</td>
<td>${p.condition}</td>
<td>${p.price}₽</td>
</tr>`;
});

window.goEditor=()=>location="editor.html";
}
