FROM node:22

WORKDIR /usr/src/app/

RUN apt update && apt install -y openssl

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY src/components/pics/defaultAvatar.png /data/pics/

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "src/server"]
