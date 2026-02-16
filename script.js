// ===== ПОЛЬЗОВАТЕЛИ =====
const users = [
{login:"user1",password:"pass123",role:"User"},
{login:"admin1",password:"adminpass",role:"Admin"},
{login:"guest1",password:"guest",role:"Guest"},
{login:"evaluator",password:"eval456",role:"User"},
{login:"moderator",password:"mod789",role:"Admin"},
{login:"expert1",password:"exp123",role:"Expert"},
{login:"expert2",password:"exp456",role:"Expert"},
{login:"expert3",password:"exp789",role:"Expert"}
];

// ===== ВХОД =====
const loginForm = document.getElementById("loginForm");

loginForm?.addEventListener("submit", function(e){
e.preventDefault();

const login = document.getElementById("login").value.trim();
const password = document.getElementById("password").value.trim();

const user = users.find(u =>
u.login === login &&
u.password === password
);

if(user){
localStorage.setItem("currentUser", JSON.stringify(user));
window.location.href = "dashboard.html";
}else{
alert("Неверные данные");
}
});

function loginAsGuest(){
localStorage.setItem("currentUser", JSON.stringify({role:"Guest"}));
window.location.href = "dashboard.html";
}

// ===== DASHBOARD =====
const welcome = document.getElementById("welcome");
if(welcome){
const user = JSON.parse(localStorage.getItem("currentUser"));
if(!user) window.location.href="index.html";
welcome.innerText = "Вы вошли как: " + user.role;
}

function logout(){
localStorage.removeItem("currentUser");
window.location.href="index.html";
}

function goBack(){
window.location.href="dashboard.html";
}

// ===== БАЗА ДАННЫХ =====
const phoneForm = document.getElementById("phoneForm");
const phoneTable = document.getElementById("phoneTable");

if(phoneForm){
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if(!currentUser) window.location.href="index.html";

let phones = JSON.parse(localStorage.getItem("phones")) || [];

renderPhones();

if(currentUser.role === "Guest"){
phoneForm.style.display="none";
}

phoneForm.addEventListener("submit", function(e){
e.preventDefault();

if(currentUser.role === "Guest"){
alert("Недостаточно прав");
return;
}

const brand = document.getElementById("brand").value;
const model = document.getElementById("model").value;
const price = document.getElementById("price").value;

phones.push({brand, model, price});
localStorage.setItem("phones", JSON.stringify(phones));

renderPhones();
phoneForm.reset();
});

function renderPhones(){
phoneTable.innerHTML="";
phones.forEach((phone, index)=>{
const row = document.createElement("tr");
row.innerHTML = `
<td>${phone.brand}</td>
<td>${phone.model}</td>
<td>${phone.price}</td>
<td>
${currentUser.role !== "Guest" ?
`<button onclick="deletePhone(${index})">X</button>` : ""}
</td>
`;
phoneTable.appendChild(row);
});
}

window.deletePhone = function(index){
phones.splice(index,1);
localStorage.setItem("phones", JSON.stringify(phones));
renderPhones();
}
}
