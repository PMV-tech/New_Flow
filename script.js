// script.js - COMPLETO E FUNCIONAL
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initLanguage();
    initMobileMenu();
    initSidebar();
    initForms();
    checkAuth();
});

// Tema
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    const savedTheme = localStorage.getItem('barberflow-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('barberflow-theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Idioma
function initLanguage() {
    const langToggle = document.getElementById('langToggle');
    
    const savedLang = localStorage.getItem('barberflow-lang') || 'pt';
    updateLangButton(savedLang);
    
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const current = localStorage.getItem('barberflow-lang') || 'pt';
            const newLang = current === 'pt' ? 'en' : 'pt';
            
            localStorage.setItem('barberflow-lang', newLang);
            updateLangButton(newLang);
            alert('Funcionalidade de idioma ativada. Em produção, redirecionaria para página em inglês.');
        });
    }
}

function updateLangButton(lang) {
    const btn = document.querySelector('.lang-text');
    if (btn) {
        btn.textContent = lang === 'pt' ? 'EN' : 'PT';
    }
}

// Menu Mobile
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
            }
        });
    }
}

// Sidebar
function initSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }
    
    if (closeSidebar && sidebar) {
        closeSidebar.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }
    
    if (sidebar) {
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 992 && sidebar.classList.contains('active')) {
                if (!sidebar.contains(e.target) && 
                    (!menuToggle || !menuToggle.contains(e.target))) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }
}

// Forms
function initForms() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    if (registerForm) {
        initPasswordValidation();
        registerForm.addEventListener('submit', handleRegister);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function initPasswordValidation() {
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', validatePassword);
    }
    
    if (confirmInput && passwordInput) {
        confirmInput.addEventListener('input', () => {
            validateConfirmPassword(passwordInput, confirmInput);
        });
    }
}

function validatePassword() {
    const password = this.value;
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    
    Object.keys(requirements).forEach(req => {
        const el = document.getElementById(`req${req.charAt(0).toUpperCase() + req.slice(1)}`);
        if (el) {
            el.classList.toggle('valid', requirements[req]);
            el.classList.toggle('invalid', !requirements[req]);
        }
    });
    
    return Object.values(requirements).every(req => req);
}

function validateConfirmPassword(pass1, pass2) {
    const errorEl = document.getElementById('confirmPasswordError');
    if (pass1.value !== pass2.value) {
        if (errorEl) errorEl.textContent = 'As senhas não coincidem';
        return false;
    } else {
        if (errorEl) errorEl.textContent = '';
        return true;
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        password: document.getElementById('password').value,
        accountType: document.getElementById('accountType').value,
        agreeTerms: document.getElementById('agreeTerms').checked
    };
    
    // Validação
    let isValid = true;
    
    if (!formData.firstName) {
        document.getElementById('firstNameError').textContent = 'Nome é obrigatório';
        isValid = false;
    }
    
    if (!formData.lastName) {
        document.getElementById('lastNameError').textContent = 'Sobrenome é obrigatório';
        isValid = false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        document.getElementById('emailError').textContent = 'Email inválido';
        isValid = false;
    }
    
    if (!validatePassword.call({value: formData.password})) {
        isValid = false;
    }
    
    if (!validateConfirmPassword(
        document.getElementById('password'),
        document.getElementById('confirmPassword')
    )) {
        isValid = false;
    }
    
    if (!formData.accountType) {
        document.getElementById('accountTypeError').textContent = 'Selecione um tipo de conta';
        isValid = false;
    }
    
    if (!formData.agreeTerms) {
        document.getElementById('termsError').textContent = 'Você deve concordar com os termos';
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Simular cadastro
    const user = {
        id: Date.now(),
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`,
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('barberflow-user', JSON.stringify(user));
    localStorage.setItem('barberflow-auth', 'true');
    localStorage.setItem('barberflow-account-type', formData.accountType);
    
    alert('Conta criada com sucesso! Redirecionando para dashboard...');
    window.location.href = 'dashboard.html';
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe')?.checked;
    
    // Simulação de login
    if (email && password) {
        const user = {
            id: 1,
            email: email,
            name: email.split('@')[0],
            accountType: email.includes('barber') ? 'barber' : 'client'
        };
        
        localStorage.setItem('barberflow-user', JSON.stringify(user));
        localStorage.setItem('barberflow-auth', 'true');
        localStorage.setItem('barberflow-account-type', user.accountType);
        
        if (rememberMe) {
            localStorage.setItem('barberflow-remembered-email', email);
        } else {
            localStorage.removeItem('barberflow-remembered-email');
        }
        
        alert('Login realizado com sucesso!');
        window.location.href = 'dashboard.html';
    } else {
        alert('Preencha todos os campos');
    }
}

// Autenticação
function checkAuth() {
    const protectedPages = ['dashboard', 'appointments', 'reports', 'gastos', 'logout'];
    const currentPage = location.pathname.split('/').pop().replace('.html', '');
    
    if (protectedPages.includes(currentPage)) {
        const isAuth = localStorage.getItem('barberflow-auth') === 'true';
        if (!isAuth) {
            window.location.href = 'login.html';
        }
    }
}

// Logout
function handleLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('barberflow-auth');
        localStorage.removeItem('barberflow-user');
        localStorage.removeItem('barberflow-account-type');
        
        // Manter email lembrado se existir
        if (!localStorage.getItem('barberflow-remembered-email')) {
            localStorage.removeItem('barberflow-remembered-email');
        }
        
        window.location.href = 'index.html';
    }
}

// Exportar funções globais
window.handleLogout = handleLogout;
