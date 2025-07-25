FROM node:23.11.0-slim

WORKDIR /app

COPY ./controller /app/controller
COPY ./models /app/models
COPY ./prototype /app/prototype
COPY ./routes /app/routes
COPY ./utils /app/utils
COPY ./environment.yaml /app/environment.yaml
COPY ./package.json /app/package.json
COPY ./app.js /app/app.js
RUN npm install

CMD node app.js