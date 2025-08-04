FROM node:22

WORKDIR /usr/src/app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

RUN npx tsc
RUN npx tailwindcss -i ./src/styles.css -o ./dist/styles.css 
