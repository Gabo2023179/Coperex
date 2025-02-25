import { body, param } from "express-validator";
import { validarCampos } from "../middlewares/validate-fields.js";
import { handleErrors } from "../middlewares/handle-errors.js";
import Company from "./company.model.js";

/**
 * Verifica si una empresa con el ID proporcionado existe en la base de datos.
 */
export const companyExists = async (id = "") => {
  const existe = await Company.findById(id);
  if (!existe) {
    throw new Error("No existe la empresa con el ID proporcionado");
  }
};

/**
 * Validaciones para crear una empresa
 */
export const createCompanyValidator = [
  body("name").notEmpty().withMessage("El nombre de la empresa es obligatorio"),
  body("description").notEmpty().withMessage("La descripción de la empresa es obligatoria"),
  body("levelImpact").isIn(["Bajo", "Medio", "Alto"]).withMessage("El nivel de impacto debe ser 'Bajo', 'Medio' o 'Alto'"),
  body("yearsTrajectory").isNumeric().withMessage("Los años de trayectoria deben ser un número válido").isInt({ min: 0 }).withMessage("Los años de trayectoria no pueden ser negativos"),
  body("category").notEmpty().withMessage("La categoría de la empresa es obligatoria"),
  validarCampos,
  handleErrors,
];

/**
 * Validaciones para actualizar una empresa
 */
export const updateCompanyValidator = [
  param("id").isMongoId().withMessage("El ID proporcionado no es válido"),
  param("id").custom(companyExists),
  validarCampos,
  handleErrors,
];