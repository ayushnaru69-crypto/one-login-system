// Utilities
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Registration Logic
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const mobile = document.getElementById('regMobile').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        const errorEl = document.getElementById('registerError');
        const successEl = document.getElementById('registerSuccess');
        errorEl.textContent = '';
        successEl.textContent = '';

        // Validations
        if (!name || !email || !mobile || !password || !confirmPassword) {
            errorEl.textContent = "All fields are required.";
            return;
        }
        if (!/^[0-9]{10}$/.test(mobile)) {
            errorEl.textContent = "Mobile number must be 10 digits.";
            return;
        }
        if (!/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            errorEl.textContent = "Enter a valid email address.";
            return;
        }
        if (password.length < 6) {
            errorEl.textContent = "Password must be at least 6 characters.";
            return;
        }
        if (password !== confirmPassword) {
            errorEl.textContent = "Passwords do not match.";
            return;
        }

        const users = getUsers();
        if (users.find(u => u.mobile === mobile)) {
            errorEl.textContent = "Mobile number already registered.";
            return;
        }
        users.push({ name, email, mobile, password });
        saveUsers(users);

        successEl.textContent = "Registration successful! Redirecting to login...";
        setTimeout(() => { window.location.href = "index.html"; }, 1500);
    });
}

// Login Logic
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const mobile = document.getElementById('loginMobile').value.trim();
        const password = document.getElementById('loginPassword').value;

        const errorEl = document.getElementById('loginError');
        errorEl.textContent = '';

        if (!/^[0-9]{10}$/.test(mobile)) {
            errorEl.textContent = "Mobile number must be 10 digits.";
            return;
        }
        const users = getUsers();
        const user = users.find(u => u.mobile === mobile && u.password === password);
        if (!user) {
            errorEl.textContent = "Invalid mobile number or password.";
            return;
        }
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = "dashboard.html";
    });
}
