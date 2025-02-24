import { body, param } from "express-validator";
import { emailExists, usernameExists, userExists, validateUserNotDeleted } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { hasRoles, validateUpdateRole } from "./validate-roles.js";
import { validateJWT } from "./validate-jwt.js";
import { check } from "express-validator";


export const registerValidator = [
    body("name").notEmpty().withMessage("El nombre es requerido"),
    body("username").notEmpty().withMessage("El username es requerido"),
    body("email").notEmpty().withMessage("El email es requerido"),
    body("email").isEmail().withMessage("No es un email válido"),
    body("email").custom(emailExists),
    body("username").custom(usernameExists),
    body("password").isStrongPassword({
        minLength: 8,
        minLowercase:1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }),  
    body("role").optional().isIn(["ADMIN", "CLIENT"]).withMessage("Rol no válido, debe ser 'ADMIN' o 'CLIENT'"), /* Aqui hacemos que role sea opcional para que por default un usuario sea CLIENT,
     verificamos si los roles son ADMIN O CLIENT .isIN y tiramos mesaje.
    */
    validarCampos,
    handleErrors
]
export const loginValidator = [
    body("email").optional().isEmail().withMessage("No es un email válido"),
    body("username").optional().isString().withMessage("Username es en formáto erróneo"),
    body("password").isLength({min: 4}).withMessage("El password debe contener al menos 8 caracteres"),
    validarCampos,
    handleErrors
]

export const getUserByIdValidator = [
    validateJWT,
    hasRoles("ADMIN"),
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("uid").custom(userExists),
    validarCampos,
    handleErrors
]

export const deleteUserValidator = [
    validateJWT, // Verifica que el usuario tenga un token válido
    hasRoles("ADMIN", "CLIENT"), // Solo ADMIN o CLIENT pueden eliminar usuarios
    check("usuario").custom(validateUserNotDeleted), // Usa el validador importado
    validarCampos, // Revisa si hay errores en la validación antes de continuar
    handleErrors // Maneja errores y los devuelve en formato JSON
];

export const adminUpdateUserValidator = [
    validateJWT, // Verifica que el usuario tenga un token JWT válido.
    hasRoles("ADMIN"), // Solo los administradores pueden actualizar usuarios.
    param("uid", "No es un ID válido").isMongoId(), // Valida que `uid` en los parámetros sea un ID de MongoDB válido.
    param("uid").custom(userExists), // Valida que el usuario con ese `uid` exista en la base de datos.
    validarCampos, // Revisa si hay errores en las validaciones anteriores antes de continuar.
    handleErrors // Maneja errores y los devuelve en formato JSON.
];


export const updateUserValidator = [
    validateJWT, // Verifica que el usuario tenga un token JWT válido.
    hasRoles("ADMIN", "CLIENT"), // Solo ADMIN y CLIENT pueden actualizar usuarios.
    validateUpdateRole, // Valida que los cambios en el rol sean correctos.
    validarCampos, // Revisa si hay errores en las validaciones antes de continuar.
    handleErrors // Maneja errores y los devuelve en formato JSON.
];