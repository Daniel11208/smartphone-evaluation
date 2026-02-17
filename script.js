const users=[
{login:"admin1",password:"adminpass",role:"admin"},
{login:"user1",password:"pass123",role:"user"},
{login:"guest",password:"guest",role:"guest"}
];

const models={
Apple:["iPhone 11","iPhone 12","iPhone 13"],
Samsung:["Galaxy S10","Galaxy S20","Galaxy S21"],
Google:["Pixel 4","Pixel 5","Pixel 6"],
Huawei:["P30 Pro","Mate 40 Pro","P50 Pro"],
Sony:["Xperia 5","Xperia 1 II","Xperia 1 III"]
};

if(!localStorage.getItem("phones")){
localStorage.setItem("phones",JSON.stringify([]));
}

function login(){
const l=document.getElementById("login").value.trim();
const p=document.getElementById("password").value.trim();
const user=users.find(u=>u.login===l&&u.password===p);
if(user){
localStorage.setItem("role",user.role);
window.location="editor.html";
}else alert("Неверные данные");
}

function loginGuest(){
localStorage.setItem("role","guest");
window.location="editor.html";
}

function logout(){
localStorage.removeItem("role");
window.location="index.html";
}

function updateModels(){
const brand=document.getElementById("brand").value;
const modelSelect=document.getElementById("model");
modelSelect.innerHTML="<option value=''>Наименование</option>";
if(models[brand]){
models[brand].forEach(m=>{
modelSelect.innerHTML+=`<option>${m}</option>`;
});
}
}

if(location.pathname.includes("editor.html")){

const role=localStorage.getItem("role");
if(!role) window.location="index.html";

document.getElementById("roleText").innerHTML=`Роль: ${role}`;

if(role==="guest"){
document.querySelector(".form-grid").style.display="none";
document.getElementById("delHead").style.display="none";
}

let phones=JSON.parse(localStorage.getItem("phones"));
render();

function render(){
const table=document.getElementById("phoneTable");
table.innerHTML="";
phones.forEach((p,i)=>{
table.innerHTML+=`
<tr>
<td>${p.brand}</td>
<td>${p.model}</td>
<td>${p.year}</td>
<td>${p.memory}GB</td>
<td>${p.condition}</td>
<td>${p.price}₽</td>
${role==="admin"?`<td><button onclick="deletePhone(${i})">X</button></td>`:""}
</tr>`;
});
}

window.addPhone=function(){
if(role==="guest")return;

const phone={
brand:brand.value,
model:model.value,
year:year.value,
memory:memory.value,
condition:condition.value,
price:price.value
};

if(!phone.brand||!phone.model||!phone.year) return;

phones.push(phone);
localStorage.setItem("phones",JSON.stringify(phones));
render();
}

window.deletePhone=function(i){
if(role!=="admin")return;
phones.splice(i,1);
localStorage.setItem("phones",JSON.stringify(phones));
render();
}

window.goDB=()=>window.location="database.html";
}

if(location.pathname.includes("database.html")){
const role=localStorage.getItem("role");
if(!role) window.location="index.html";

document.getElementById("dbRole").innerHTML=`Роль: ${role}`;

let phones=JSON.parse(localStorage.getItem("phones"));
const table=document.getElementById("dbTable");

phones.forEach(p=>{
table.innerHTML+=`
<tr>
<td>${p.brand}</td>
<td>${p.model}</td>
<td>${p.year}</td>
<td>${p.memory}GB</td>
<td>${p.condition}</td>
<td>${p.price}₽</td>
</tr>`;
});

window.goEditor=()=>window.location="editor.html";
}
