document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorBox = document.getElementById('error-box');
    const submitBtn = document.getElementById('submit-btn');

    // Check if already logged in
    if (localStorage.getItem('admin_token')) {
        // Simple check - in a real app we'd verify the token
        window.location.href = 'index.html';
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Reset states
        errorBox.style.display = 'none';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Authenticating...';

        try {
            const data = await api.post('/auth/admin/login', { email, password });
            
            // Success
            localStorage.setItem('admin_token', data.token);
            localStorage.setItem('admin_user', JSON.stringify(data.user));
            localStorage.setItem('adminName', data.user.name);
            
            // Redirect to dashboard
            window.location.href = 'index.html';
        } catch (err) {
            console.error('Login error:', err);
            errorBox.textContent = err.message || 'Login failed. Please check your credentials.';
            errorBox.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In to Dashboard';
        }
    });
});
