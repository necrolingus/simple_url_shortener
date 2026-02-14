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

                    // Add a new row to the table via AJAX instead of reloading
                    addUrlToTable({
                        shortURL: data.shortUrl.split('/s/')[1],
                        fullShortURL: data.shortUrl,
                        longURL: longUrl,
                        createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                        expiryDate: new Date(Date.now() + (parseInt(expiryDays || 30) * 86400000)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                        clickCount: 0
                    });

                    // Clear the form
                    document.getElementById('longUrl').value = '';
                    document.getElementById('expiryDays').value = '';
                    document.getElementById('customShortUrl').value = '';
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
        const response = await fetch(`/api/urls/${encodeURIComponent(shortCode)}`, {
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

function addUrlToTable(urlData) {
    let table = document.getElementById('urlTable');

    // If no table exists yet, create it
    if (!table) {
        const heading = document.createElement('h2');
        heading.className = 'table-heading';
        heading.textContent = 'Your URLs';

        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';

        table = document.createElement('table');
        table.className = 'url-table';
        table.id = 'urlTable';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Short URL</th>
                    <th>Long URL</th>
                    <th>Created</th>
                    <th>Expires</th>
                    <th>Clicks</th>
                    <th></th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        wrapper.appendChild(table);
        const container = document.querySelector('.container');
        container.appendChild(heading);
        container.appendChild(wrapper);
    }

    const tbody = table.querySelector('tbody');
    const row = document.createElement('tr');
    row.id = `row-${urlData.shortURL}`;
    row.style.opacity = '0';
    row.style.transition = 'opacity 0.3s ease';

    row.innerHTML = `
        <td><a href="${urlData.fullShortURL}" target="_blank" class="table-link">${urlData.shortURL}</a></td>
        <td class="long-url-cell" title="${urlData.longURL}">${urlData.longURL}</td>
        <td class="date-cell">${urlData.createdDate}</td>
        <td class="date-cell">${urlData.expiryDate}</td>
        <td class="click-cell">${urlData.clickCount}</td>
        <td><button class="delete-btn" onclick="deleteUrl('${urlData.shortURL}')">✕</button></td>
    `;

    // Insert at the top of the table
    tbody.insertBefore(row, tbody.firstChild);

    // Fade in
    requestAnimationFrame(() => {
        row.style.opacity = '1';
    });
}
