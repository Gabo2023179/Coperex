import { body, param, query } from "express-validator";
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
  body("name").notEmpty().withMessage("El nombre de la empresa es obligatorio").trim(),
  body("description").notEmpty().withMessage("La descripción de la empresa es obligatoria").trim(),
  body("levelImpact").isIn(["Bajo", "Medio", "Alto"]).withMessage("El nivel de impacto debe ser 'Bajo', 'Medio' o 'Alto'"),
  body("yearsTrajectory").isNumeric().withMessage("Los años de trayectoria deben ser un número válido").isInt({ min: 0 }).withMessage("Los años de trayectoria no pueden ser negativos"),
  body("category").notEmpty().withMessage("La categoría de la empresa es obligatoria").isString().withMessage("La categoría debe ser un texto válido"),
  validarCampos,
  handleErrors,
];

/**
 * Validaciones para actualizar una empresa
 */
export const updateCompanyValidator = [
  param("id").isMongoId().withMessage("El ID proporcionado no es válido"),
  param("id").custom(companyExists),
  body("name").optional().trim(),
  body("description").optional().trim(),
  body("levelImpact").optional().isIn(["Bajo", "Medio", "Alto"]),
  body("yearsTrajectory").optional().isInt({ min: 0 }),
  body("category").optional().isString().withMessage("La categoría debe ser un texto válido"),
  validarCampos,
  handleErrors,
];

/**
 * Validaciones para obtener una empresa por su ID
 */
export const getCompanyByIdValidator = [
  param("id").isMongoId().withMessage("El ID proporcionado no es válido"),
  param("id").custom(companyExists),
  validarCampos,
  handleErrors,
];

/**
 * Validaciones para obtener empresas con filtros y ordenación
 */
export const getCompaniesValidator = [
  query("limite").optional().isInt({ min: 1 }).withMessage("El límite debe ser un número mayor a 0"),
  query("desde").optional().isInt({ min: 0 }).withMessage("El parámetro 'desde' debe ser un número positivo"),
  query("order").optional().isIn(["asc", "desc"]).withMessage("El orden debe ser 'A-Z' o 'Z-A'"),
  query("minYears").optional().isInt({ min: 0 }).withMessage("El valor mínimo de años de trayectoria debe ser un número positivo"),
  query("maxYears").optional().isInt({ min: 0 }).withMessage("El valor máximo de años de trayectoria debe ser un número positivo"),
  query("category").optional().isString().withMessage("La categoría debe ser un texto válido"),
  validarCampos,
  handleErrors,
];

/**
 * Validaciones para la generación del reporte en Excel
 */
export const generateCompaniesReportValidator = [
  validarCampos,
  handleErrors,
];
