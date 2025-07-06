# Proyecto UpTask Node.js

Aplicación web de backend de un project manager el **cual usa un crud para proyectos y tareas, autenticación y autilización para los usuarios**, ademas de contar con tecnologías como:

- **JSON Web Token**
- **Express**
- **Bcrypt**
- **TypeScript**
- **Docker Compose**
- **MongoDB**
- **Nodemailer**

Para ejecutar la aplicación sigue los siguientes pasos:

1. Ejecuta el comando `npm i` para reconstruir los `node_modules`
2. Configura las variables de entorno que vienen en el archivo `.env.example` y copialo o renombralo a `.env`
3. Genera la base de datos con el comando `docker compose up -d`, se creará el folder `mongo-db`
4. Inicia la aplicación con el comando `npm run dev`
5. Accede a `http://localhost:PORT`

## Notas
- Se debe tener instalado **Node.js** para ejecutar los comandos `npm`
- Se debe tener instalado **Docker** parar ejecutar los comandos `docker`
- El *PORT* en el paso 5 es el puerto configurado en el archivo `.env`
- Ejecuta los comandos dentro de la carpeta del proyecto