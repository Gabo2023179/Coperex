import { body, param } from "express-validator";
import { emailExists, usernameExists, userExists, validateUserNotDeleted, esAdmin } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { hasRoles, validateUpdateRole } from "./validate-roles.js";
import { validateJWT } from "./validate-jwt.js";
import { check } from "express-validator";
import { existeAdmin } from "../helpers/db-validators.js"


export const registerValidator = [
    esAdmin,
    body("name").notEmpty().withMessage("El nombre es requerido"),
    body("username").notEmpty().withMessage("El username es requerido"),
    body("email").notEmpty().withMessage("El email es requerido").isEmail().withMessage("No es un email válido").custom(emailExists),
    body("username").custom(usernameExists),
    body("password").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage("La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo"),
    body("role").notEmpty().withMessage("El rol es requerido").isIn(["ADMIN"]).withMessage("Solo se permiten roles ADMIN"),
    validarCampos,
    handleErrors
];



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
    hasRoles("ADMIN"), // Solo ADMIN o CLIENT pueden eliminar usuarios
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
    hasRoles("ADMIN"), // Solo ADMIN y CLIENT pueden actualizar usuarios.
    validateUpdateRole, // Valida que los cambios en el rol sean correctos.
    validarCampos, // Revisa si hay errores en las validaciones antes de continuar.
    handleErrors // Maneja errores y los devuelve en formato JSON.
];


export const createDefaultAdmin = async () => {
    try {
      const adminExists = await User.findOne({ role: "ADMIN" });
      if (!adminExists) {
        const defaultAdmin = {
          name: "admin",
          surname: "123",
          username: "admin123",
          email: "admin123@example.com",
          password: await hash("SecureP@ssword123"),
          phone: "12345678",
          role: "ADMIN",
          status: true,
        };
        await User.create(defaultAdmin);
        console.log("Default admin created");
      } else {
        console.log("Admin already exists");
      }
    } catch (error) {
      console.error(`"Error creating default admin:", ${error}`);
    }
  };