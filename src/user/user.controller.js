import { hash } from "argon2"
import User from "./user.model.js"
import fs from "fs/promises"

export const getUserById = async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await User.findById(uid);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener el usuario",
        error: err.message,
      });
    }
  };
  
  /**
   * Obtiene una lista de usuarios activos (status: true) con paginación.
   */
  export const getUsers = async (req, res) => {
    try {
      const { limite = 5, desde = 0 } = req.query;
      const query = { status: true };
  
      const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
          .skip(Number(desde))
          .limit(Number(limite)),
      ]);
  
      return res.status(200).json({
        success: true,
        total,
        users,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener los usuarios",
        error: err.message,
      });
    }
  };
  
  /**
   * Realiza una eliminación lógica de un usuario (cambia su status a false).
   * Se asume que el validador deleteUserValidator ya verificó:
   * - La validez del token JWT.
   * - Los permisos del usuario.
   * - Que el usuario a eliminar no haya sido eliminado previamente.
   */
  export const deleteUser = async (req, res) => {
    try {
      // El middleware de validación coloca en req.usuario la información del usuario autenticado
      const { usuario } = req;
      if (!usuario || !usuario._id) {
        return res.status(400).json({
          success: false,
          message: "ID de usuario no proporcionado",
        });
      }
  
      const user = await User.findByIdAndUpdate(
        usuario._id,
        { status: false },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado para eliminar",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Usuario eliminado (lógicamente)",
        user: user.username,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error al eliminar el usuario",
        error: err.message,
      });
    }
  };
  
  /**
   * Actualiza los datos de un usuario.
   * Se asume que el validador adminUpdateUserValidator o updateUserValidator ya validó:
   * - La validez del token JWT.
   * - El ID del usuario.
   * - Que los datos recibidos son correctos.
   */
  export const updateUser = async (req, res) => {
    try {
      const { uid } = req.params;
      const data = req.body;
      const user = await User.findByIdAndUpdate(uid, data, { new: true });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado para actualizar",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Usuario actualizado",
        user,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error al actualizar el usuario",
        error: err.message,
      });
    }
  };

