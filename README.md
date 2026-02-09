# Simple URL Shortener 🔗

A modern, secure, and neon-themed URL shortener built with Node.js and PostgreSQL.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)

## Features ✨

*   **Secure Authentication**: API Key-based login system for authorized access.
*   **Custom Short Codes**: Create your own memorable aliases (e.g., `/s/my-link`) with alphanumeric validation.
*   **Expiry Dates**: Set expiration days for your links to keep your database clean.
*   **Rate Limiting**: Built-in protection against abuse.
*   **Modern UI**: distinctive "Neon" aesthetic with a moving particles background.
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
    API_KEY=your_secure_api_key_here
    RATE_LIMIT=15
    COOKIE_VALID_DAYS=1
    DOMAIN=http://localhost:3000
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

## Contributing 🤝

Contributions, issues, and feature requests are welcome!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License.
