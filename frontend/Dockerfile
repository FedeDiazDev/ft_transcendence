# FROM node:22

# WORKDIR /usr/src/app/

# COPY package.json package.json
# COPY package-lock.json package-lock.json

# RUN npm install
# RUN npx tsc --init

# COPY ./src ./src
# COPY ./tsconfig.json ./tsconfig.json
# COPY ./postcss.config.js ./postcss.config.js
# COPY ./tailwind.config.js ./tailwind.config.js

# RUN npx tsc
# RUN npx tailwindcss -i ./src/styles.css -o ./dist/styles.css 
# RUN npm install -g http-server

# EXPOSE 9000

# ENTRYPOINT ["http-server", "src", "-p", "9000"]


FROM node:22

WORKDIR /usr/src/app/

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

RUN npx tsc
RUN npx tailwindcss -i ./src/styles.css -o ./dist/styles.css 

# RUN npm install -g http-server

# EXPOSE 9000

# CMD ["http-server", ".", "-p", "9000", "--no-cache"]