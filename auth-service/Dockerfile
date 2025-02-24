FROM node:22

WORKDIR /usr/src/app/

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server"]
