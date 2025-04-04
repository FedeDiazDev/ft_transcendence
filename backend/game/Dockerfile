# Usa una imagen base de Node.js (puedes elegir otra versión si lo necesitas)
FROM node:22

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de la aplicación al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

# Expone el puerto en el que corre tu aplicación (ajústalo si usas otro)
EXPOSE 4444

# Comando para iniciar la aplicación
CMD ["npm", "run", "start"]
