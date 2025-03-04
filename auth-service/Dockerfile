FROM node:22


WORKDIR /usr/src/app/

RUN apt update && apt install -y openssl

RUN openssl req -newkey rsa:2048 -days 365 -nodes -x509 \
    -keyout /etc/ssl/server.key \
    -out /etc/ssl/server.crt \
    -subj "/C=ES/ST=Madrid/L=Madrid/O=ecole42/OU=student/CN=ft_transcendence.com"

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "src/server"]
