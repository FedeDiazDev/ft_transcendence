FROM node:22

WORKDIR /usr/src/app/

RUN apt update && apt install -y openssl

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

EXPOSE 4000

CMD ["node", "src/server"]
