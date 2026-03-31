document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;

            // Simple Gmail Validation logic for specific forms
            if (data.email && !data.email.endsWith('@gmail.com')) {
                showError(form, 'Only @gmail.com addresses are allowed.');
                shakeForm(form);
                return;
            }

            // Confirm Password check
            if (data.confirm_password && data.password !== data.confirm_password) {
                showError(form, 'Passwords do not match.');
                shakeForm(form);
                return;
            }

            // UI Feedback
            submitBtn.innerText = 'Processing...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {
                    if (result.redirect) {
                        window.location.href = result.redirect;
                    } else {
                        showSuccess(form, result.message);
                        if (form.id === 'register-form') {
                            setTimeout(() => {
                                window.location.href = '/login';
                            }, 2000);
                        }
                    }
                } else {
                    showError(form, result.message);
                    shakeForm(form);
                }
            } catch (error) {
                showError(form, 'An unexpected error occurred. Please try again.');
                shakeForm(form);
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    });
});

function shakeForm(form) {
    const card = form.closest('.glass-card') || form;
    card.classList.add('shake');
    setTimeout(() => card.classList.remove('shake'), 500);
}

function showError(form, message) {
    let errorDiv = form.querySelector('.error-msg');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-msg';
        form.appendChild(errorDiv);
    }
    errorDiv.innerText = message;
    errorDiv.style.display = 'block';
    errorDiv.style.color = '#ff007a';
    errorDiv.style.marginTop = '15px';
    errorDiv.style.textAlign = 'center';
}

function showSuccess(form, message) {
    let errorDiv = form.querySelector('.error-msg');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-msg';
        form.appendChild(errorDiv);
    }
    errorDiv.innerText = message;
    errorDiv.style.display = 'block';
    errorDiv.style.color = '#00f2fe';
    errorDiv.style.marginTop = '15px';
    errorDiv.style.textAlign = 'center';
}
