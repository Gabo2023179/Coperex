import User from "../user/user.model.js"
import Company from "../company/company.model.js";

/**
 * Verifica si un email ya está registrado en la base de datos.
 * @param {string} email - Dirección de correo electrónico a verificar.
 * @throws {Error} Si el email ya está registrado.
 */
export const emailExists = async (email = "") => {
    const existe = await User.findOne({email})
    if(existe){
        throw new Error(`The email ${email} is already registered`)
    }  
}


/**
 * Verifica si un nombre de usuario ya está registrado en la base de datos.
 * @param {string} username - Nombre de usuario a verificar.
 * @throws {Error} Si el nombre de usuario ya está registrado.
 */

export const usernameExists = async (username = "") => {
    const existe = await User.findOne({username})
    if(existe){
        throw new Error(`The username ${username} is already registered`)
    }
}

/**
 * Verifica si un usuario con un ID específico existe en la base de datos.
 * @param {string} uid - ID del usuario a verificar.
 * @throws {Error} Si el usuario no existe.
 */
export const userExists = async (uid = " ") => {
    const existe = await User.findById(uid)
    if(!existe){
        throw new Error("No existe el usuario con el ID proporcionado")
    }
}

export const validateUserNotDeleted = async (_, { req }) => {
    const uid = req.usuario._id; // Obtiene el ID del usuario desde req.usuario
    
    const user = await User.findById(uid); // Busca el usuario en la base de datos

    if (!user) {
        throw new Error("Usuario no encontrado"); // Si el usuario no existe, lanza un error
    }
    return true; // Si el usuario está activo, la validación pasa
};

export const esAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "ADMIN") {
        return res.status(403).json({
            msg: "No tienes permisos para realizar esta acción"
        });
    }
    next();
};

export const existeAdmin = async() => {
    const exist = await User.findAll({"role": "ADMIN"});
    if(!exist){
        return false
    }
    return true;
}

/**
 * Verifica si una empresa con el ID proporcionado existe en la base de datos.
 */
export const companyExists = async (id = "") => {
    const existe = await Company.findById(id);
    if (!existe) {
      throw new Error("No existe la empresa con el ID proporcionado");
    }
  };

  export const foundingYearValidator = (value) => {
    const currentYear = new Date().getFullYear();
    if (parseInt(value, 10) > currentYear) {
      throw new Error("El año de fundación no puede ser mayor al año actual");
    }
    return true;
  };
  
