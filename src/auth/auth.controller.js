// Importa las funciones hash y verify del módulo "argon2".
// "hash" se usa para cifrar contraseñas antes de almacenarlas en la base de datos.
// "verify" se usa para comparar una contraseña ingresada con su versión cifrada.
import { hash, verify } from "argon2";

// Importa el modelo de usuario desde el archivo "user.model.js".
// Este modelo permite interactuar con la colección de usuarios en la base de datos MongoDB.
import User from "../user/user.model.js";
import { generateJWT } from "../helpers/generate-jwt.js";

/**
 * Controlador para el registro de un nuevo usuario en el sistema.
 */
export const register = async (req, res) => {
    try {
        // Extrae los datos enviados en la solicitud HTTP.
        const data = req.body;

        if (!data.role) {
            data.role = "CLIENT";
        }

        // Cifra la contraseña antes de almacenarla en la base de datos.
        // El método "hash" de Argon2 genera una versión encriptada segura de la contraseña del usuario.
        const encryptedPassword = await hash(data.password);

        // Sustituye la contraseña original por su versión cifrada antes de guardarla en la base de datos.
        data.password = encryptedPassword;

        // Crea un nuevo usuario en la base de datos con los datos proporcionados.
        // La función "User.create(data)" inserta el usuario en MongoDB y devuelve el objeto creado.
        const user = await User.create(data);

        // Responde con un código HTTP 201 (Created) y devuelve información del usuario (sin incluir la contraseña por seguridad).
        return res.status(201).json({
            message: "User has been created", // Mensaje de éxito.
            name: user.name, // Nombre del usuario registrado.
            email: user.email // Correo electrónico del usuario registrado.
        });
    } catch (err) {
        // En caso de error, devuelve un código HTTP 500 (Internal Server Error).
        return res.status(500).json({
            message: "User registration failed", // Mensaje de error.
            error: err.message // Detalles del error para depuración.
        });
    }
};

/**
 * Controlador para el inicio de sesión de un usuario.
 */
export const login = async (req, res) => {
    // Extrae el correo electrónico, el nombre de usuario y la contraseña enviados en la solicitud.
    const { email, username, password } = req.body;

    try {
        // Busca en la base de datos un usuario que coincida con el correo electrónico o el nombre de usuario.
        // La consulta usa el operador "$or" de MongoDB para verificar ambas opciones.
        const user = await User.findOne({
            $or: [{ email: email }, { username: username }]
        });

        // Si no se encuentra un usuario con el email o username proporcionado, devuelve un error 400 (Bad Request).
        if (!user) {
            return res.status(400).json({
                message: "Crendenciales inválidas", // Mensaje de error para el usuario.
                error: "No existe el usuario o correo ingresado" // Detalle del error.
            });
        }

        // Verifica si la contraseña ingresada coincide con la contraseña cifrada en la base de datos.
        // La función "verify" de Argon2 compara ambas contraseñas y devuelve "true" si coinciden o "false" si no coinciden.
        const validPassword = await verify(user.password, password);

        // Si la contraseña es incorrecta, responde con un error 400 (Bad Request).
        if (!validPassword) {
            return res.status(400).json({
                message: "Crendenciales inválidas", // Mensaje de error para el usuario.
                error: "Contraseña incorrecta" // Detalle del error.
            });
        }

        const token = await generateJWT(user.id)

        // Si la autenticación es exitosa, responde con un código 200 (OK) y devuelve datos del usuario.
        return res.status(200).json({
            message: "Login successful", // Mensaje de éxito.
            userDetails: {
                token: token, // Token de autenticación generado.
                name: user.name, // Nombre del usuario autenticado.
                email: user.email // Correo electrónico del usuario autenticado.
            }
        });
    } catch (err) {
        // En caso de error, devuelve un código HTTP 500 (Internal Server Error).
        return res.status(500).json({
            message: "Login failed, server error", // Mensaje de error.
            error: err.message // Detalles del error para depuración.
        });
    }
};