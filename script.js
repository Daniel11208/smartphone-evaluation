// ===== Пользователи =====
const users = [
{login:"admin1", password:"adminpass", role:"admin"},
{login:"user1", password:"pass123", role:"user"},
{login:"guest", password:"guest", role:"guest"}
];

// ===== Вход =====
function login(){
const loginVal = document.getElementById("login").value.trim();
const passVal = document.getElementById("password").value.trim();

const user = users.find(u => u.login === loginVal && u.password === passVal);

if(user){
localStorage.setItem("role", user.role);
window.location.href = "editor.html";
}else{
alert("Неверные данные");
}
}

function logout(){
localStorage.removeItem("role");
window.location.href="index.html";
}

// ===== РЕДАКТОР =====
if(window.location.pathname.includes("editor.html")){

const role = localStorage.getItem("role");
if(!role) window.location.href="index.html";

document.getElementById("roleText").innerText="Роль: "+role;

let phones = JSON.parse(localStorage.getItem("phones")) || [];
render();

if(role === "guest"){
document.getElementById("formBlock").style.display="none";
document.getElementById("deleteCol").style.display="none";
}

function render(){
const table = document.getElementById("phoneTable");
table.innerHTML="";

phones.forEach((p,i)=>{
let row=`<tr>
<td>${p.brand}</td>
<td>${p.model}</td>
<td>${p.price}</td>`;

if(role==="admin"){
row+=`<td><button onclick="deletePhone(${i})">X</button></td>`;
}else{
row+=`<td></td>`;
}

row+=`</tr>`;
table.innerHTML+=row;
});
}

window.addPhone=function(){
if(role==="guest") return;

const brand=document.getElementById("brand").value;
const model=document.getElementById("model").value;
const price=document.getElementById("price").value;

phones.push({brand,model,price});
localStorage.setItem("phones",JSON.stringify(phones));
render();
}

window.deletePhone=function(index){
if(role!=="admin") return;
phones.splice(index,1);
localStorage.setItem("phones",JSON.stringify(phones));
render();
}

window.goDatabase=function(){
window.location.href="database.html";
}
}

// ===== БАЗА =====
if(window.location.pathname.includes("database.html")){

const role = localStorage.getItem("role");
if(!role) window.location.href="index.html";

document.getElementById("dbRole").innerText="Роль: "+role;

let phones = JSON.parse(localStorage.getItem("phones")) || [];
const table=document.getElementById("dbTable");

phones.forEach(p=>{
table.innerHTML+=`
<tr>
<td>${p.brand}</td>
<td>${p.model}</td>
<td>${p.price}</td>
</tr>`;
});

window.goEditor=function(){
window.location.href="editor.html";
}
}
