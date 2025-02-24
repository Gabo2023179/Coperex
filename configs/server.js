"use strict" // Modo estricto para mejorar la seguridad y evitar errores comunes

import express from "express" // Framework para construir aplicaciones web y APIs en Node.js
import cors from "cors" // Middleware para habilitar CORS (Cross-Origin Resource Sharing)
import helmet from "helmet" // Middleware para mejorar la seguridad HTTP
import morgan from "morgan" // Middleware para registrar solicitudes HTTP en la consola
import { dbConnection } from "./mongo.js" // Importa la función de conexión a la base de datos MongoDB
import authRoutes from "../src/auth/auth.routes.js" // Rutas de autenticación
import userRoutes from "../src/user/user.routes.js" // Rutas de gestión de usuarios
import petRoutes from "../src/pet/pet.routes.js" // Rutas de gestión de mascotas
import appointmentRoutes from "../src/appointment/appointment.routes.js" // Rutas de gestión de citas
import apiLimiter from "../src/middlewares/rate-limit-validator.js" // Middleware para limitar las solicitudes por usuario

/**
 * Configura los middlewares globales de la aplicación.
 * @param {object} app - Instancia de la aplicación Express.
 */
const middlewares = (app) => {
    app.use(express.urlencoded({extended: false})) // Permite el análisis de datos codificados en URL
    app.use(express.json()) // Permite el análisis de datos en formato JSON
    app.use(cors()) // Habilita CORS para permitir solicitudes de diferentes dominios
    app.use(helmet()) // Agrega cabeceras de seguridad HTTP
    app.use(morgan("dev")) // Registra las solicitudes HTTP en la consola en formato "dev"
    app.use(apiLimiter) // Aplica limitación de solicitudes para prevenir abusos
}

/**
 * Define y configura las rutas de la API.
 * @param {object} app - Instancia de la aplicación Express.
 */
const routes = (app) => {
   // app.use("/adoptionSystem/v1/auth", authRoutes) // Rutas de autenticación
    ///app.use("/adoptionSystem/v1/user", userRoutes) // Rutas de gestión de usuarios
   // app.use("/adoptionSystem/v1/pet", petRoutes) // Rutas de gestión de mascotas
    //app.use("/adoptionSystem/v1/appointment", appointmentRoutes) // Rutas de gestión de citas
}

/**
 * Establece la conexión con la base de datos MongoDB.
 * En caso de error, se detiene la ejecución del servidor.
 */
const conectarDB = async () =>{
    try{
        await dbConnection() // Intenta conectar con la base de datos
    }catch(err){
        console.log(`Database connection failed: ${err}`) // Muestra el error en consola
        process.exit(1) // Finaliza el proceso en caso de error
    }
}

/**
 * Inicializa el servidor Express.
 */
export const initServer = () => {
    const app = express() // Crea una instancia de Express
    try{
        middlewares(app) // Configura los middlewares
        conectarDB() // Conecta con la base de datos
        routes(app) // Configura las rutas de la API
        app.listen(process.env.PORT) // Inicia el servidor en el puerto definido en las variables de entorno
        console.log(`Server running on port ${process.env.PORT}`) // Muestra un mensaje en consola confirmando que el servidor está corriendo
    }catch(err){
        console.log(`Server init failed: ${err}`) // Muestra un mensaje de error en caso de falla
    }
}