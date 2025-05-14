document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    // agregar elementos de mensaje de error
    const emailError = document.createElement('div');
    emailError.className = 'error-message';
    emailInput.parentNode.appendChild(emailError);

    const passwordError = document.createElement('div');
    passwordError.className = 'error-message';
    passwordInput.parentNode.appendChild(passwordError);

    // css para el error de los campos
    const style = document.createElement('style');
    style.textContent = `
        .error-message {
            color: #dc3545;
            font-size: 12px;
            margin-top: 5px;
            text-align: left;
        }
        .input-error {
            border-color: #dc3545 !important;
        }
    `;
    document.head.appendChild(style);

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        return password.length >= 8 && /[A-Z]/.test(password);
    }

    function validateForm() {
        let isValid = true;
        
        if (!validateEmail(emailInput.value)) {
            emailError.textContent = 'Por favor, ingresa un correo electrónico válido';
            emailInput.classList.add('input-error');
            isValid = false;
        } else {
            emailError.textContent = '';
            emailInput.classList.remove('input-error');
        }

        if (!validatePassword(passwordInput.value)) {
            passwordError.textContent = 'La contraseña debe tener al menos 8 caracteres y una mayúscula';
            passwordInput.classList.add('input-error');
            isValid = false;
        } else {
            passwordError.textContent = '';
            passwordInput.classList.remove('input-error');
        }

        return isValid;
    }

    // validación en tiempo real
    emailInput.addEventListener('input', () => {
        if (emailInput.value) {
            if (!validateEmail(emailInput.value)) {
                emailError.textContent = 'Por favor, ingresa un correo electrónico válido';
                emailInput.classList.add('input-error');
            } else {
                emailError.textContent = '';
                emailInput.classList.remove('input-error');
            }
        }
    });

    passwordInput.addEventListener('input', () => {
        if (passwordInput.value) {
            if (!validatePassword(passwordInput.value)) {
                passwordError.textContent = 'La contraseña debe tener al menos 8 caracteres y una mayúscula';
                passwordInput.classList.add('input-error');
            } else {
                passwordError.textContent = '';
                passwordInput.classList.remove('input-error');
            }
        }
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        const auth = new AuthSystem();
        const result = auth.login(emailInput.value, passwordInput.value);
        
        if (result.success) {
            showToast(result.message);
            updateAuthUI();
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showToast(result.message, 'danger');
        }
    });
});