
let users = JSON.parse(localStorage.getItem("users")) || [
  { name: "vinoth", email: "vinothkumar@gmail.com", password: "1234", balance: 5000 },
  { name: "kathir", email: "kathir@gmail.com", password: "1234", balance: 3000 },
  { name: "mathi", email: "mathi@gmail.com", password: "1234", balance: 4000 }
];

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

const loginPage = document.getElementById("loginPage");
const dashboard = document.getElementById("dashboard");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginError = document.getElementById("loginError");
const userNameSpan = document.getElementById("userName");
const userBalanceSpan = document.getElementById("userBalance");
const sendBtn = document.getElementById("sendBtn");
const transferMessage = document.getElementById("transferMessage");


loginBtn.addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();


  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user)); 
    showDashboard(user);
  } else {
    loginError.textContent = "Invalid Email or Password!";
  }
});


function showDashboard(user) {
  loginPage.classList.add("hidden");
  dashboard.classList.remove("hidden");
  userNameSpan.textContent = user.name;
  userBalanceSpan.textContent = user.balance;
}

sendBtn.addEventListener("click", () => {
  const receiverEmail = document.getElementById("receiverEmail").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);

  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!receiverEmail || isNaN(amount) || amount <= 0) {
    transferMessage.textContent = "Please enter a valid email and amount.";
    transferMessage.className = "error";
    return;
  }

  const sender = users.find(u => u.email === loggedInUser.email);
  const receiver = users.find(u => u.email === receiverEmail);

  if (!receiver) {
    transferMessage.textContent = "Receiver not found!";
    transferMessage.className = "error";
    return;
  }

  if (sender.email === receiver.email) {
    transferMessage.textContent = "You cannot send money to yourself!";
    transferMessage.className = "error";
    return;
  }

  if (sender.balance < amount) {
    transferMessage.textContent = "Insufficient balance!";
    transferMessage.className = "error";
    return;
  }

  sender.balance -= amount;
  receiver.balance += amount;


  saveUsers();


  loggedInUser.balance = sender.balance;
  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

  
  userBalanceSpan.textContent = sender.balance;
  transferMessage.textContent = `₹${amount} sent to ${receiver.name} successfully!`;
  transferMessage.className = "success";

  document.getElementById("receiverEmail").value = "";
  document.getElementById("amount").value = "";
});


logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  dashboard.classList.add("hidden");
  loginPage.classList.remove("hidden");
});

window.onload = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser) {
    showDashboard(loggedInUser);
  }
};
