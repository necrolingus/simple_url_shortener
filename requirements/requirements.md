# General Project Requirements
This project will create a simple URL shortener with a front end and a back end.

# Front End Look and Feel
- The front end must be simple yet responsive. It must look modern with an element of "neon" to it. It must have background made up of very slowly moving dark grey dots.
- Use rounded corners on buttons and text boxes with a thin white border on them
- Use a white font color for all text
- Use the roboto font

# Front End Requirements

## Login Page
- The user must be presented with a singular text box. Hitting enter must submit the form. The text box must have the placeholder "Enter your API key". 
- Below the textbox, put a URL to this github repo so users can clone it. This URL must be editable in an environment variable.


## Post Login Main Page
- The user must paste the long URL they want to shorten into a textbox. Cater for VERY long URLs, like 500 characters but keep the textbox normal length.
- A textbox where the user can set the amount of time they want this shortenred URL to be valid for in days.
- The user must be given the option to type in their own custom short URL e.g. "linkToAmazon" else the system must generate one. If they create one that already exists, show them a proper error message.
- The user can then submit this form. The back end must return the short URL (with the domain prepended) to the front end e.g. "https://mysite.com/s/AbHd82". Make sure there is a simple "copy" button the user can click.
- There can be a submit button.
- All errors must be displayed in red below the submit button.


# Back end requirements:

## API Key Checks
- The back end must check if the API key entered is valid. It must enfore rate limiting on the API key. This must be e.g. 5 number of requests per minute but must be editable via an environment variable.
- This page might be behind a reverse proxy (sometimes more than 1 like Cloudflare and NGINX), so use the correct IP address for rate limiting.

## Short URL Generation
- The back end must generate its own short URL if they user does not provide one e.g. "AbHd82". This must be 6 characters long and must be unique. But, the length must be editable via an environment variable. 
- The short URL must be the primary key in the database. 

## Database Storage
- Store the long URL, the short URL, the date the short URL was created, and the number of days it must be valid for. 
- Use an indicator 1 or 0 to indicate if a short URL is expired or not.
- Prepend table names with "tbl_sus_".

## Short URL Routing
- The short URL must live on the path "/s/AbHd82".
- The front part of the URL, i.e. the part before "AbHd82" is the domain name of the website. This must be editable via an environment variable. This domain name must be prepended to the short URL e.g. "https://mysite.com/s/AbHd82" when returning the short URL to the front end.
- When someone lands on a short URL e.g. "https://mysite.com/s/AbHd82" then the backend must check if the short URL is valid and not expired. If it is valid and not expired, then the backend must redirect the user to the long URL. If the short URL is not valid or expired, then the backend must return a good looking 404 error page.

## Cleanup Task
- A simple task must run every hour that checks for all expired URLs and then updates the "is_expired" column. This task must run in the back-end code, it should not be a database job.


# Audit requirements:
- This must be done in the database in an audit table.
- Every time a short URL is expired, put an entry into this audit table.
- Every time someone lands on a valid URL, put an entry into this audit table.
- Every time someone lands on an expired URL, put an entry into this audit table.
- Every time someone lands on a non existent URL, do nothing so we dont fill our audits with junk.
- The user must be able to easily distinguish between the different types of events in the audit table.


# Technical Requirements:
- Put the port number into .env.
- Use nodeJS, express, postgresql, sequelize, handlebars. 
- Use setInterval for the database cleanup task to run.
- The CSS must be well structured.
- Make sure all back end endpoints are proper APIs so that the front end can easily be replaced later on. Don't tightly integrate the front end and back end.
- Use middlware to validate the existence of the api-key header.
- Modularize the express routes in case we add more routes later on.
- Make sure the database IP/host, username, password, etc, are all configurable via environment variables. 