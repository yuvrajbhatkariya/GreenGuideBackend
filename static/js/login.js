document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `email=${email}&password=${password}`
    });
    const data = await response.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = '/';
    } else {
        alert(data.error);
    }
});