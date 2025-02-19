FROM node:22

WORKDIR /usr/src/app/

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install
RUN npx tsc --init

COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json
COPY ./postcss.config.js ./postcss.config.js
COPY ./tailwind.config.js ./tailwind.config.js

RUN npx tsc

EXPOSE 9000

ENTRYPOINT ["node", "dist/main.js"]