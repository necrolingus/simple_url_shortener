# Security
- Don't commit .env to github. Create a .env.example file instead which can be comitted but contains ONLY variable names and not values.
- Create the appropriate gitignore file to ignore .env e.g. node_modules, python cache files, etc.
- Always use middleware to validate the existence of security api-key headers, JWT Auth tokens, etc when possible.