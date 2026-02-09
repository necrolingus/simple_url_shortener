# General Project Requirements
This project will create a simple URL shortener with a front end and a back end.

# Front End Look and Feel
The front end must be simple yet responsive. It must look modern with an element of "neon" to it. It must have a black background.

# Front End Requirements

## Main Page
- The user must paste the long URL they want to shorten into a textbox. Cater for VERY long URLs, like 500 characters.
- Set the amount of time they want this shortenred URL to be valid for in days.
- The user must be given the option to type in their own custom short URL e.g. "linkToAmazon" else the system must generate one. If they create own that already exists, show them a proper error message.
- The user must enter a static API key. The API key must be passed through in a header called "api-key". If the API key is incorrect, display an appropriate error message.
- The user can then submit this form. The back end must return the short URL (with the domain prepended) to the front end e.g. "https://mysite.com/s/AbHd82". Make sure there is a simple "copy" button the user can click.
- This "main" user interface must on the root of the website, i.e. "/".


# Back end requirements:

## API Key Checks
- The back end must check if the API key entered is valid. It must enfore rate limiting on the API key. This must be e.g. 5 number of requests per minute but must be editable via an environment variable.

## Short URL Generation
- The back end must generate its own short URL if they user does not provide one e.g. "AbHd82". This must be 6 characters long and must be unique. But, the length must be editable via an environment variable. This must be the primary key in the database. 

## Database Storage
- Store the long URL, the short URL, the date the short URL was created, and the expiration date in the database. Use an indicator 1 or 0 to indicate if a short URL is expired or not.

## Short URL Routing
- The short URL must live on the path "/s/AbHd82".
- The front part of the URL, i.e. the part before "AbHd82" is the domain name of the website. This must be editable via an environment variable. This domain name must be prepended to the short URL e.g. "https://mysite.com/s/AbHd82".
- When someone lands on a short URL e.g. "https://mysite.com/s/AbHd82" ,which will be a GET request, then the backend must check if the short URL is valid and not expired. 
- If it is valid and not expired, then the backend must redirect the user to the long URL. If the short URL is not valid or expired, then the backend must return a 404 error.
- A simple task must run every hour that checks for all expired URLs and then updates the "is_expired" column. This task must run in the back-end code, it should not be a database job.


# Audit requirements:
- This must be done in the database in an audit table.
- Every time a short URL is expired, put an entry into this audit table.
- Every time someone lands on a valid URL, put an entry into this audit table.
- Every time someone lands on an expired URL, put an entry into this audit table.
- Every time someone lands on a non existent URL, do nothing.
- The user must be able to easily distinguish between the different types of events in the audit table.


# Technical Requirements:
- Use nodeJS, express, postgresql, sequelize, handlebars. 
- Use setInterval for the database cleanup task to run.
- The CSS must be well structured.
- Make sure all back end endpoints are proper APIs so that the front end can easily be replaced later on. Don't tightly integrate the front end and back end.
- Use middlware to validate the existence of the api-key header.
- Modularize the express routes in case we add more routes later on.
- Make sure the database IP/host, username, password, etc, are all configurable via environment variables. 