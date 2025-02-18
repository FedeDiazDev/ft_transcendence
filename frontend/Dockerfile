FROM node:16

WORKDIR /usr/src/app/

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install
RUN npx tsc --init

COPY ./src .

RUN npx tsc

EXPOSE 80

ENTRYPOINT ["node", "main.js"]
