function generatePassword() {
    const length = document.getElementById('length').value;
    const includeUppercase = document.getElementById('uppercase').checked;
    const includeSpecialChars = document.getElementById('specialChars').checked;
    const includeNumbers = document.getElementById('numbers').checked;
    const includeLetters = document.getElementById('letters').checked;

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
        alert("Veuillez sélectionner au moins une option pour générer un mot de passe.");
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    document.getElementById('password').value = password;
}

function copyPassword() {
    const passwordField = document.getElementById('password');
    const password = passwordField.value;

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(password).then(function() {
            alert('Mot de passe copié dans le presse-papiers');
        }, function(err) {
            alert('Échec de la copie du mot de passe : ', err);
        });
    } else {
        passwordField.select();
        passwordField.setSelectionRange(0, 99999); // Pour les mobiles

        try {
            const successful = document.execCommand('copy');
            const msg = successful ? 'Mot de passe copié dans le presse-papiers' : 'Échec de la copie du mot de passe';
            alert(msg);
        } catch (err) {
            alert('Échec de la copie du mot de passe : ', err);
        }
    }
}

// Pour date copirate
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");
    const yearElement = document.getElementById("year");
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
        console.log("Year updated to:", currentYear);
    } else {
        console.error("Element with id 'year' not found.");
    }
});

