import { Router } from 'express';
import { getUserById, getUsers, deleteUser, updateUser } from "./user.controller.js"
import { getUserByIdValidator, deleteUserValidator, adminUpdateUserValidator, updateUserValidator } from "../middlewares/user-validators.js"

const router = Router()

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
 * /deleteUser/{uid}:
 *   delete:
 *     summary: Elimina un usuario por ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 */
router.delete("/deleteUser", deleteUserValidator, deleteUser)

/**
 * @swagger
 * /updatePassword/{uid}:
 *   patch:
 *     summary: Actualiza la contraseña de un usuario
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *       400:
 *         description: Error en la solicitud
 */

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
router.put("/updateUser/:uid", adminUpdateUserValidator, updateUser)

router.put("/updateUser", updateUserValidator, updateUser)


router.delete("/deleteUser", deleteUserValidator, deleteUser)
/**
 * @swagger
 * /updateProfilePicture/{uid}:
 *   patch:
 *     summary: Actualiza la foto de perfil de un usuario
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Foto de perfil actualizada
 *       400:
 *         description: Error en la solicitud
 */
export default router