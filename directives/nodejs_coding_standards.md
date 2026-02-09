# Node.js Coding Standards Directive

## Scope

This directive defines coding standards, naming conventions, and best practices for all Node.js/JavaScript scripts.

### General Principles
- Readability Over Cleverness: Code should be self-documenting.
- Asynchronous Clarity: Use async/await over raw promises or callbacks for readability.
- Deterministic Over Probabilistic: Prefer explicit checks over "truthy/falsy" assumptions when possible.
- Modular Design: Utilize ES Modules or CommonJS consistently.
- Fail Fast: Validate inputs early and provide clear error messages.
- Explain "Why": Use comments to explain the rationale behind complex logic.

### Naming Conventions
**Files**
- Use lowercase with hyphens: process-user-data.js, validate-input.js.
- Extension: .js

**Functions and Variables**
- Functions: Use camelCase with descriptive verb-noun patterns: validateEmail(), fetchUserData().
- Variables: Use descriptive names (userEmail not ue).
- Constants: Use UPPER_SNAKE_CASE: const MAX_RETRIES = 3;.

**Code Structure**
Every Script Must Include
- Header Comment: Explaining purpose, inputs, and outputs.
- Input Validation: Check arguments and file existence early.

**Logging**
- Use console.error for errors and a structured logger or console.log for info (no PII).

**Exit Codes**
-Use process.exit(0) for success and process.exit(1) for failure.


## Core Libraries & Stack

Task,Library
- API Client,axios
- API Server,express
- Database,"tedious (for SQL Server) or sequelize (for ORM)"
- Authentication,passport
- Documentation,"swagger-jsdoc and swagger-ui-express"
- Logging,winston
- Environment,dotenv

### API Guidelines
- Routes: Always separate routes from the main app logic. Put routes in the routes/ folder.
- Middleware: Use middleware for authentication and error handling.
- Async: Always use async/await pattern for asynchronous operations.

### Project Structure (inside src/)
```
src/
├── app.js               # Entry point
├── routes/              # Route definitions
├── controllers/         # Logic for handling requests
├── middleware/          # Passport, logging, auth
├── models/              # Database schemas
├── services/            # External API calls/DB operations
└── config/              # Environment vars/constants
```

## Node.js Boilerplate

### Example (NodeJS)
```
#!/usr/bin/env node
/**
 * Process user data from CSV and generate summary report.
 * Input: path to CSV file
 * Output: summary JSON written to deliverables/
 */

const fs = require('fs');
const path = require('path');

function validateInput(csvPath) {
    if (!fs.existsSync(csvPath)) {
        throw new Error(`Input file not found: ${csvPath}`);
    }
    return true;
}

async function main() {
    const args = process.argv.slice(2);

    if (args.length !== 1) {
        console.error("Usage: node process-data.js <csv_path>");
        process.exit(1);
    }

    try {
        const csvPath = path.resolve(args[0]);
        validateInput(csvPath);
       
        // ... async processing logic ...
       
        console.info("Processing complete");
        process.exit(0);
    } catch (error) {
        console.error(`Processing failed: ${error.message}`);
        process.exit(1);
    }
}

main();
```

## Error Handling and Testing
- Use try-catch blocks, especially around asynchronous operations.
- Never fail silently: Always catch exceptions and provide context.
- Testing: Include example usage in script header and test with invalid inputs.
- Actionable Errors: Messages should tell the user exactly what went wrong (e.g., "Missing API Key" vs "Error").

## Anti-Patterns
- ❌ Ignoring rejected promises (unhandledRejection)
- ❌ Using var (always use const or let)
- ❌ Deeply nested anonymous callbacks
- ❌ Hardcoded credentials or absolute file paths

## env file
- Never hardcode IPs, Ports, Hostnames, etc. ALWAYS put these in .env