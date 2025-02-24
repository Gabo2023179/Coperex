'use strict';

import mongoose from "mongoose";

/**
 * Establece la conexión con la base de datos MongoDB.
 * Maneja eventos de conexión para detectar errores y reconexiones automáticamente.
 */
export const dbConnection = async () => {
    try {
        // 📌 Evento que se dispara si ocurre un error en la conexión
        mongoose.connection.on("error", () => {
            console.log("MongoDB | could not be connect to MongoDB");
            mongoose.disconnect(); // Desconectar para evitar problemas de conexión persistentes
        });

        // 📌 Evento que indica que se está intentando conectar a la base de datos
        mongoose.connection.on("connecting", () => {
            console.log("MongoDB | trying to connect...");
        });

        // 📌 Evento que confirma que la conexión se ha establecido con éxito
        mongoose.connection.on("connected", () => {
            console.log("MongoDB | connected to MongoDB");
        });

        // 📌 Evento que se dispara cuando la conexión se abre correctamente
        mongoose.connection.on("open", () => {
            console.log("MongoDB | Connected to Database");
        });

        // 📌 Evento que indica que la conexión se ha restablecido después de una caída
        mongoose.connection.on("reconnected", () => {
            console.log("MongoDB | reconnected to MongoDB");
        });

        // 📌 Evento que indica que la conexión se ha cerrado
        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB | disconnected from MongoDB");
        });

        // 📌 Conexión a la base de datos usando la URI definida en las variables de entorno
        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000, // Tiempo de espera para seleccionar un servidor
            maxPoolSize: 50 // Límite máximo de conexiones en el pool
        });

    } catch (err) {
        console.log(`Database connection failed: ${err}`);
    }
};