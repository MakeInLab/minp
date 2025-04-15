document.addEventListener('DOMContentLoaded', function() {
    const passwordField = document.getElementById('password');
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('length-value');
    const themeToggle = document.getElementById('theme-toggle');
    const passwordStrength = document.getElementById('password-strength');
    const strengthValue = document.getElementById('strength-value');
    const toast = document.getElementById('toast');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    
    if (typeof PhosphorIcons !== 'undefined') {
        PhosphorIcons.replace();
    }
    
    if (lengthSlider) {
        lengthSlider.addEventListener('input', function() {
            lengthValue.textContent = this.value;
        });
    }
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            generatePassword();
        });
    }
    
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            copyPassword();
        });
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            generatePassword();
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            document.body.classList.toggle('light-mode');
            
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
        });
    }

    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedDarkMode !== null) {
        if (savedDarkMode === 'true') {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
    } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        }
    }
    
    const logoContainer = document.querySelector('.logo-container');
    const sidebar = document.querySelector('.sidebar');
    
    if (logoContainer && sidebar && window.innerWidth <= 768) {
        logoContainer.addEventListener('click', function() {
            sidebar.classList.toggle('expanded');
        });
    }
    
    const yearElement = document.getElementById("year");
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
    }
    
    generatePassword();
});

function generatePassword() {
    const lengthElement = document.getElementById('length');
    if (!lengthElement) return;
    
    const length = lengthElement.value;
    const includeUppercase = document.getElementById('uppercase') ? document.getElementById('uppercase').checked : false;
    const includeSpecialChars = document.getElementById('specialChars') ? document.getElementById('specialChars').checked : false;
    const includeNumbers = document.getElementById('numbers') ? document.getElementById('numbers').checked : true;
    const includeLetters = document.getElementById('letters') ? document.getElementById('letters').checked : true;
    const passwordField = document.getElementById('password');
    
    if (!passwordField) return;

    let characters = '';

    if (includeLetters) {
        characters += 'abcdefghijklmnopqrstuvwxyz';
        if (includeUppercase) {
            characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
    }
    if (includeNumbers) {
        characters += '0123456789';
    }
    if (includeSpecialChars) {
        characters += '!@#$%^&*()_+[]{}|;:,.<>?';
    }

    if (characters.length === 0) {
        showToast("Veuillez sélectionner au moins une option pour générer un mot de passe.");
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    passwordField.value = password;
    evaluatePasswordStrength(password);
}

function evaluatePasswordStrength(password) {
    const passwordStrength = document.getElementById('password-strength');
    const strengthValue = document.getElementById('strength-value');
    
    if (!passwordStrength || !strengthValue) return;
    
    passwordStrength.classList.remove('weak', 'medium', 'strong', 'very-strong');
    
    if (!password) {
        strengthValue.textContent = "Indéterminée";
        return;
    }
    
    const length = password.length;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\[\]{}|;:,.<>?]/.test(password);
    
    let score = 0;
    
    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    
    if (hasLowerCase) score += 1;
    if (hasUpperCase) score += 1;
    if (hasNumbers) score += 1;
    if (hasSpecialChars) score += 1;
    
    let strengthClass = '';
    let strengthText = '';
    
    if (length < 8) {
        strengthClass = 'weak';
        strengthText = 'Faible';
    } else if (score < 4) {
        strengthClass = 'weak';
        strengthText = 'Faible';
    } else if (score < 6) {
        strengthClass = 'medium';
        strengthText = 'Moyenne';
    } else if (score < 8) {
        strengthClass = 'strong';
        strengthText = 'Forte';
    } else {
        strengthClass = 'very-strong';
        strengthText = 'Très forte';
    }
    
    passwordStrength.classList.add(strengthClass);
    strengthValue.textContent = strengthText;
}

function copyPassword() {
    const passwordField = document.getElementById('password');
    if (!passwordField) return;
    
    const password = passwordField.value;

    if (!password) {
        showToast("Veuillez d'abord générer un mot de passe.");
        return;
    }

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(password).then(function() {
            showToast("Mot de passe copié!");
        }, function(err) {
            showToast("Échec de la copie : " + err);
        });
    } else {
        passwordField.select();
        passwordField.setSelectionRange(0, 99999);

        try {
            const successful = document.execCommand('copy');
            const msg = successful ? "Mot de passe copié!" : "Échec de la copie";
            showToast(msg);
        } catch (err) {
            showToast("Échec de la copie : " + err);
        }
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    const toastMessage = document.querySelector('.toast-message');
    if (toastMessage) {
        toastMessage.textContent = message;
    }
    
    toast.classList.add('show');
    
    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

