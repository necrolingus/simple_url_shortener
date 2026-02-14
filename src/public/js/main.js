/**
 * Client-side logic for login, URL shortening, clipboard copy, and URL deletion.
 */

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
                    },
                    body: JSON.stringify({ longUrl, expiryDays, customShortUrl })
                });

                const data = await response.json();

                if (response.ok) {
                    resultContainer.style.display = 'block';
                    document.getElementById('shortUrlResult').textContent = data.shortUrl;
                    // Reload after a short delay so the table refreshes
                    setTimeout(() => window.location.reload(), 1500);
                } else {
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
        // Copied silently
    }).catch(err => {
        console.error('Failed to copy', err);
    });
}

async function deleteUrl(shortCode) {
    try {
        const response = await fetch(`/api/urls/${shortCode}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Remove the row from the table
            const row = document.getElementById(`row-${shortCode}`);
            if (row) {
                row.style.transition = 'opacity 0.3s ease';
                row.style.opacity = '0';
                setTimeout(() => row.remove(), 300);
            }
        } else {
            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }
            console.error('Delete failed:', data.error);
        }
    } catch (err) {
        console.error('Network error during delete:', err);
    }
}
