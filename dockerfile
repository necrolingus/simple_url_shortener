FROM node:24-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

# Functions as documentation, application defaults to 3000, or update env file
EXPOSE 3022
CMD [ "node", "src/app.js" ]