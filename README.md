# Simple URL Shortener 🔗

A modern, secure, and neon-themed URL shortener built with Node.js and PostgreSQL.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)

## Features ✨

*   **Cookie-Based Authentication**: Instant login with a secure cookie — no email or password needed. Recovery tokens let you get back in if your cookie expires.
*   **Per-User Privacy**: Each user can only see and manage their own shortened URLs.
*   **Custom Short Codes**: Create your own memorable aliases (e.g., `/s/my-link`) with alphanumeric validation.
*   **Expiry Dates**: Set expiration days for your links to keep your database clean.
*   **Rate Limiting**: Configurable global and per-endpoint rate limiting for abuse protection.
*   **Modern UI**: Distinctive "Neon" aesthetic with a moving particles background.
*   **Audit Logging**: Tracks simple metrics on link creation and access.

## Tech Stack 🛠️

*   **Backend**: Node.js, Express
*   **Database**: PostgreSQL, Sequelize ORM
*   **Frontend**: Handlebars (hbs), Vanilla CSS, Client-side JS

## Getting Started 🚀

### Prerequisites

*   Node.js (v14 or higher)
*   PostgreSQL database

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/necrolingus/simple_url_shortener.git
    cd simple_url_shortener
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory (copy from `.env.example`):
    ```ini
    PORT=3000
    DB_CONFIG=postgres://user:password@localhost:5432/simple_url_shortener
GITHUB_REPO=https://github.com/necrolingus/simple_url_shortener
    COOKIE_VALID_DAYS=30
    RATE_LIMIT=15
    RATE_LIMIT_WINDOW=60
    COOKIE_SECRET=your_long_random_cookie_signing_secret
    RECOVERY_RATE_LIMIT=5
    RECOVERY_RATE_LIMIT_WINDOW=900
    NUMBER_OF_PROXIES=2
    ```

4.  **Run the Server**
    ```bash
    npm start
    # or
    node src/app.js
    ```

5.  **Access the App**
    Open your browser to `http://localhost:3000`.

## Project Structure 📂

```
.
├── src/
│   ├── app.js            # Entry point
│   ├── config/           # Database config
│   ├── middleware/       # Auth & Rate limiting
│   ├── models/           # Sequelize definitions
│   ├── public/           # Static assets (CSS, JS)
│   ├── routes/           # API & View routes
│   └── views/            # Handlebars templates
├── tests/                # Verification scripts
├── .env.example
└── README.md
```

## License

Distributed under the MIT License.
