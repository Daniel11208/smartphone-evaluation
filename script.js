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

function logout(){
localStorage.removeItem("currentUser");
window.location.href = "index.html";
}

const welcome = document.getElementById("welcome");
if(welcome){
const user = JSON.parse(localStorage.getItem("currentUser"));
if(!user) window.location.href="index.html";
welcome.innerText = "Вы вошли как: " + user.role;
}

const phoneForm = document.getElementById("phoneForm");
const phoneTable = document.getElementById("phoneTable");

if(phoneForm){
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if(!currentUser) window.location.href="index.html";

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

const row = document.createElement("tr");
row.innerHTML = `
<td>${brand}</td>
<td>${model}</td>
<td>${price}</td>
<td><button onclick="this.parentElement.parentElement.remove()">Удалить</button></td>
`;

phoneTable.appendChild(row);
phoneForm.reset();
});
}

function goBack(){
window.location.href="dashboard.html";
}
