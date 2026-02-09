# General Project Requirements
This project will create a simple URL shortener with a front end and a back end.

# Front End Look and Feel
The front end must be simple yet responsive. It must look modern with an element of "neon" to it with glowing buttons and such.

# Front End Requirements
The front end must allow the user to:
- Paste the URL they want to shorten into a textbox.
- Set the amount of time they want this shortenred URL to be valid for in days.
- The user must be given the option to choose their own custom short URL e.g. "linkToAmazon" else the system must generate one. If they create own that already exists, show them a proper error message.
- The user must enter a static API key. The API key must be passed through in a header called "api-key".


# Back end requirements:
- The back end must check if the API key entered is valid. It must enfore rate limiting on the API key. This must be e.g. 5 number of requests per minute but must be editable via an environment variable.
- The back end must generate its own short URL e.g. "AbHd82". This must be 6 characters long and must be unique. But, the length must be editable via an environment variable. This must be the primary key in the database. 
- The front part of the URL, i.e. the part before "AbHd82" is the domain name of the website. This must be editable via an environment variable. This domain name must be prepended to the short URL e.g. "https://mysite.com/AbHd82".
- When someone lands on a short URL e.g. "https://mysite.com/AbHd82" , which will be a GET request, then the backend must check if the short URL is valid and not expired. If it is valid and not expired, then the backend must redirect the user to the long URL. If the short URL is not valid or expired, then the backend must return a 404 error.
- A simple task must run every hour that checks for all expired URLs and then deletes them from the database.


# Technical Requirements:
- Use nodeJS, express, postgresql, sequelize, handlebars.
- The CSS must be well structured.
- Make sure all back end endpoints are proper APIs so that the front end can easily be replaced later on. Don't tightly integrate the front end and back end.
- Use middlware to validate the existence of the api-key header.
- Modularize the express routes in case we add more routes later on.
- Make sure the database IP/host, username, password, are all configurable via environment variables. 


# General good practice
- Make sure the code is well documented and easy to understand.
- Make sure the code is well tested.
- Don't commit .env to github. Create a .env.example file instead which can be comitted but contains ONLY variable names and not values.
- Create the appropriate gitignore file to ignore .env and node_modules.
