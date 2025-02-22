const titulo = document.getElementById("titulo");
titulo.textContent = "WalletSim";

let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = null;
let balance = 0;
const transactionList = [];

// Función para actualizar el balance en la interfaz
const updateBalance = () => {
    document.getElementById('balance').innerText = `Balance: $${balance}`;
};

// Función para mostrar las transacciones en la interfaz
const displayTransactions = () => {
    const list = document.getElementById('transaction-list');
    list.innerHTML ='';
    transactionList.forEach((transaction) => {
        const listItem = document.createElement('li');
        listItem.innerText = transaction;
        list.appendChild(listItem);
    });
};

// Función para guardar usuarios en localStorage
const saveUsersToLocalStorage = () => {
    localStorage.setItem('users', JSON.stringify(users));
};

// Función para cargar usuarios desde una API
const loadUsersFromAPI = async () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        
        // Transformar los datos para que coincidan con tu estructura
        users = data.map(user => ({
            username: user.username,
            password: 'defaultPassword', // establecer una contraseña predeterminada
            balance: 0
        }));

        saveUsersToLocalStorage(); // Guardar en localStorage
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
};

// Función para registrar un nuevo usuario
const registerUser = () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Verificar si el usuario ya existe
    if (users.find(user => user.username === username)) {
        Swal.fire({
            title: 'Error',
            text: 'El usuario ya existe.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Agregar el nuevo usuario al array
    users.push({ username, password, balance: 0 });
    saveUsersToLocalStorage();
    Swal.fire({
        title: 'Éxito',
        text: 'Usuario registrado con éxito.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
};

// Función para iniciar sesión
const loginUser = () => {
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    // Verificar las credenciales
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        currentUser = user;
        balance = user.balance;
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('wallet-section').style.display = 'block';
        updateBalance();
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Nombre de usuario o contraseña incorrectos.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
};

// Función para agregar dinero
const addMoney = () => {
    const amount = parseFloat(document.getElementById('amount').value);
    if (amount <= 0) {
        Swal.fire({
            title: 'Error',
            text: 'El monto debe ser mayor que cero.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    balance += amount;
    currentUser.balance = balance; //Actualiza el saldo del usuario
    transactionList.push(`Ingresó: $${amount}`);
    saveUsersToLocalStorage(); // Guarda el usuario actualizado
    updateBalance();
    displayTransactions();
    Swal.fire({
        title: 'Éxito',
        text: `Has ingresado $${amount} a tu billetera.`,
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
};

// Función para retirar dinero
const withdrawMoney = () => {
    const amount = parseFloat(document.getElementById('amount').value);
    if (amount <= 0) {
        Swal.fire({
            title: 'Error',
            text: 'El monto debe ser mayor que cero.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    if (amount > balance) {
        Swal.fire({
            title: 'Error',
            text: 'No hay suficiente saldo.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    balance -= amount;
    currentUser.balance = balance; //Actualiza el saldo del usuario
    transactionList.push(`Retiró: $${amount}`);
    saveUsersToLocalStorage();
    updateBalance();
    displayTransactions();
    Swal.fire({
        title: 'Éxito',
        text: `Has retirado $${amount} de tu billetera.`,
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
};

// Función para transferir dinero
const transferMoney = () => {
    const amount = parseFloat(document.getElementById('amount').value);
    const recipientUsername = document.getElementById('transfer-username').value;

    if (amount <= 0) {
        Swal.fire({
            title: 'Error',
            text: 'El monto debe ser mayor que cero.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    if (amount > balance) {
        Swal.fire({
            title: 'Error',
            text: 'No hay suficiente saldo.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    const recipient = users.find(user => user.username === recipientUsername);
    if (!recipient) {
        Swal.fire({
            title: 'Error',
            text: 'El usuario no existe.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Realizar la transferencia
    balance -= amount;
    currentUser.balance = balance;
    recipient.balance += amount;
    transactionList.push(`Transferido: $${amount} a ${recipientUsername}`);
    saveUsersToLocalStorage();
    updateBalance();
    displayTransactions();

    Swal.fire({
        title: 'Éxito',
        text: `Has transferido $${amount} a ${recipientUsername}.`,
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
};

// Asignar eventos a los botones
document.getElementById('register-btn').addEventListener('click', registerUser);
document.getElementById('login-btn').addEventListener('click', loginUser);
document.getElementById('add-btn').addEventListener('click', addMoney);
document.getElementById('withdraw-btn').addEventListener('click', withdrawMoney);
document.getElementById('confirm-transfer-btn').addEventListener('click', transferMoney);

// Mostrar la sección de transferencia solo si se va a transferir dinero
document.getElementById('transfer-btn').addEventListener('click', () => {
    document.getElementById('transfer-section').style.display = 'block'
});   

// Llama a la función para cargar usuarios al iniciar la aplicación
loadUsersFromAPI();