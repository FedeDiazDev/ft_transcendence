FROM nginx:1.27.4

RUN openssl req -newkey rsa:2048 -days 365 -nodes -x509 \
    -keyout /etc/ssl/private/nginx.key \
    -out /etc/ssl/certs/nginx.crt \
    -subj "/C=ES/ST=Madrid/L=Madrid/O=ecole42/OU=student/CN=transcendence.fr"

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

ENTRYPOINT ["nginx", "-g", "daemon off;"]
