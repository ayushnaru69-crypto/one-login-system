// Registration Logic
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
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
        // Strong password rules
        if (
            password.length < 8 ||
            !/[A-Z]/.test(password) ||
            !/[a-z]/.test(password) ||
            !/[0-9]/.test(password) ||
            !/[!@#$%^&*(),.?":{}|<>]/.test(password)
        ) {
            errorEl.textContent =
                "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
            return;
        }
        if (password !== confirmPassword) {
            errorEl.textContent = "Passwords do not match.";
            return;
        }
        if (await getUser(mobile)) {
            errorEl.textContent = "Mobile number already registered.";
            return;
        }
        // Hash password before saving
        const hashed = await hashPassword(password);
        const user = { name, email, mobile, password: hashed };
        try {
            await addUser(user);
            successEl.textContent = "Registration successful! Redirecting to login...";
            setTimeout(() => { window.location.href = "index.html"; }, 1500);
        } catch (err) {
            errorEl.textContent = "Registration failed. Please try again.";
        }
    });
}

// Login Logic
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const mobile = document.getElementById('loginMobile').value.trim();
        const password = document.getElementById('loginPassword').value;
        const errorEl = document.getElementById('loginError');
        errorEl.textContent = '';

        if (!/^[0-9]{10}$/.test(mobile)) {
            errorEl.textContent = "Mobile number must be 10 digits.";
            return;
        }
        const user = await getUser(mobile);
        if (!user) {
            errorEl.textContent = "Invalid mobile number or password.";
            return;
        }
        const hashed = await hashPassword(password);
        if (hashed !== user.password) {
            errorEl.textContent = "Invalid mobile number or password.";
            return;
        }
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = "dashboard.html";
    });
}
