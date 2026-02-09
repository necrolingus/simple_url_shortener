document.addEventListener('DOMContentLoaded', () => {

    // Login Handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const apiKey = document.getElementById('apiKey').value;
            const errorDiv = document.getElementById('loginError');

            errorDiv.textContent = ''; // Clear error

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ apiKey })
                });

                const data = await response.json();

                if (data.success) {
                    window.location.href = data.redirect;
                } else {
                    errorDiv.textContent = data.error || 'Login failed';
                }
            } catch (err) {
                errorDiv.textContent = 'An error occurred. Please try again.';
            }
        });
    }

    // Shorten Handling
    const shortenForm = document.getElementById('shortenForm');
    if (shortenForm) {
        shortenForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const longUrl = document.getElementById('longUrl').value;
            const expiryDays = document.getElementById('expiryDays').value;
            const customShortUrl = document.getElementById('customShortUrl').value;
            const errorDiv = document.getElementById('shortenError');
            const resultContainer = document.getElementById('resultContainer');

            // Basic reset
            errorDiv.textContent = '';
            resultContainer.style.display = 'none';

            try {
                const response = await fetch('/api/shorten', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                        // API Key is handled by cookie in index, but if we need it in header:
                        // 'api-key': getCookie('api_key') ... but httpOnly cookie is better.
                        // The middleware checks cookie.
                    },
                    body: JSON.stringify({ longUrl, expiryDays, customShortUrl })
                });

                const data = await response.json();

                if (response.ok) {
                    resultContainer.style.display = 'block';
                    document.getElementById('shortUrlResult').textContent = data.shortUrl;
                } else {
                    // Check if 401 unauthorized (cookie expired?)
                    if (response.status === 401) {
                        window.location.href = '/login';
                        return;
                    }
                    errorDiv.textContent = data.error || 'Failed to shorten URL';
                }
            } catch (err) {
                errorDiv.textContent = 'Network error. Please try again.';
            }
        });
    }
});

function copyToClipboard() {
    const text = document.getElementById('shortUrlResult').innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy', err);
    });
}
