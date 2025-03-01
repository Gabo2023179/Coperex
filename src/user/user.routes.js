import { Router } from "express";
import { updateUser, getUserById, getUsers } from "./user.controller.js";
import { adminUpdateUserValidator, updateUserValidator, getUserByIdValidator } from "../middlewares/user-validators.js";

const router = Router();

/**
 * @swagger
 * /findUser/{uid}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/findUser/:uid", getUserByIdValidator, getUserById)

/**
 * @swagger
 * /:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get("/", getUsers)

/**
 * @swagger
 * /updateUser/{uid}:
 *   put:
 *     summary: Actualiza un usuario por ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Error en la solicitud
 */
router.put("/updateUser/:uid", adminUpdateUserValidator, updateUser);

/**
 * @swagger
 * /updateUser:
 *   put:
 *     summary: Actualiza el usuario autenticado
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Error en la solicitud
 */
router.put("/updateUser", updateUserValidator, updateUser);

export default router;