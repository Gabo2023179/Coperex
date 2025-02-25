import { Router } from "express";
import {createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany} from "./company.controller.js";
import {createCompanyValidator, getCompanyByIdValidator, updateCompanyValidator, deleteCompanyValidator,} from "../middlewares/company-validators.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRoles } from "../middlewares/validate-roles.js";

const router = Router();

/**
 * @route POST /api/v1/companies
 * @desc Registrar una nueva empresa (Solo Admin)
 */
router.post(
  "/",
  validateJWT,
  hasRoles("ADMIN"),
  createCompanyValidator,
  createCompany
);

/**
 * @route GET /api/v1/companies
 * @desc Obtener todas las empresas activas (Solo Admin)
 */
router.get("/", validateJWT, hasRoles("ADMIN"), getCompanies);

/**
 * @route GET /api/v1/companies/:id
 * @desc Obtener una empresa por su ID (Solo Admin)
 */
router.get("/:id", validateJWT, hasRoles("ADMIN"), getCompanyByIdValidator, getCompanyById);

/**
 * @route PUT /api/v1/companies/:id
 * @desc Actualizar una empresa por su ID (Solo Admin)
 */
router.put("/:id", validateJWT, hasRoles("ADMIN"), updateCompanyValidator, updateCompany);

/**
 * @route DELETE /api/v1/companies/:id
 * @desc Eliminar lógicamente una empresa por su ID (Solo Admin)
 */
router.delete("/:id", validateJWT, hasRoles("ADMIN"), deleteCompanyValidator, deleteCompany);

export default router;
