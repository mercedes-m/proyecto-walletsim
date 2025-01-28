const titulo = document.getElementById("titulo");

titulo.textContent = "WalletSim";

let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser  = null;
let balance = 0;
const transactionList = [];

const updateBalance = () => {
    document.getElementById('balance').innerText = `Balance: $${balance}`;
};

const displayTransactions = () => {
    const list = document.getElementById('transaction-list');
    list.innerHTML = '';
    transactionList.forEach((transaction, index) => {
        const listItem = document.createElement('li');
        listItem.innerText = transaction;
        list.appendChild(listItem);
    });
};

const saveUsersToLocalStorage = () => {
    localStorage.setItem('users', JSON.stringify(users));
};

const registerUser  = () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const dni = document.getElementById('dni').value;

    // Verificar si el usuario ya existe
    if (users.find(user => user.username === username)) {
        alert('El usuario ya existe.');
        return;
    }

    // Agregar el nuevo usuario al array
    users.push({ username, password, dni, balance: 0 });
    saveUsersToLocalStorage();
    alert('Usuario registrado con éxito.');
};

const loginUser  = () => {
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    // Verificar las credenciales
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        currentUser  = user;
        balance = user.balance;
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('wallet-section').style.display = 'block';
        updateBalance();
    } else {
        alert('Nombre de usuario o contraseña incorrectos.');
    }
};

const addMoney = () => {
    const amount = parseFloat(prompt("Ingrese el monto a ingresar:"));
    if (amount <= 0) {
        alert('El monto debe ser mayor que cero.');
        return;
    }
    balance += amount;
    currentUser .balance = balance;
    transactionList.push(`Ingresó: $${amount}`);
    updateBalance();
    displayTransactions();
};

const withdrawMoney = () => {
    const amount = parseFloat(prompt("Ingrese el monto a retirar:"));
    if (amount <= 0) {
        alert('El monto debe ser mayor que cero.');
        return;
    }
    if (amount > balance) {
        alert('No hay suficiente saldo.');
        return;
    }
    balance -= amount;
    currentUser .balance = balance;
    transactionList.push(`Retiró: $${amount}`);
    updateBalance();
    displayTransactions();
};

const transferMoney = () => {
    const amount = parseFloat(prompt("Ingrese el monto a transferir:"));
    const recipientUsername = prompt("Ingrese el nombre de usuario del destinatario:");

    if (amount <= 0) {
        alert('El monto debe ser mayor que cero.');
        return;
    }
    if (amount > balance) {
        alert('No hay suficiente saldo.');
        return;
    }
    const recipient = users.find(user => user.username === recipientUsername);
    if (!recipient) {
        alert('El usuario no existe.');
        return;
    }

    // Realizar la transferencia
    balance -= amount;
    currentUser .balance = balance;
    recipient.balance += amount;
    transactionList.push(`Transferido: $${amount} a ${recipientUsername}`);
    updateBalance();
    displayTransactions();
};

// Asignar eventos a los botones
document.getElementById('register-btn').addEventListener('click', registerUser );
document.getElementById('login-btn').addEventListener('click', loginUser );
document.getElementById('add-btn').addEventListener('click', addMoney);
document.getElementById('withdraw-btn').addEventListener('click', withdrawMoney);
document.getElementById('transfer-btn').addEventListener('click', transferMoney);