import { Router } from "express";
import { register, login } from "./auth.controller.js";
import { registerValidator, loginValidator } from "../middlewares/user-validators.js";

/**
 * Crea un nuevo enrutador de Express.
 * 
 * Este enrutador permite definir rutas para el registro e inicio de sesión de usuarios,
 * manteniendo la modularidad y organización del código.
 */
const router = Router();

/**
 * Ruta para registrar un nuevo usuario.
 *
 * @swagger
 * /register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post(
    "/register",  // Endpoint para el registro de usuario
    registerValidator, // Middleware de validación de datos
    register // Controlador que maneja el registro
);

/**
 * Ruta para iniciar sesión de un usuario.
 *
 * @swagger
 * /login:
 *   post:
 *     summary: Inicia sesión de un usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Error en la solicitud
 */
router.post(
    "/login",  // Endpoint para el inicio de sesión
    loginValidator, // Middleware de validación de datos de inicio de sesión
    login // Controlador que maneja la autenticación
);

export default router; // Exportamos el enrutador para su uso en la aplicación principal