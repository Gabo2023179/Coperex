import { Router } from "express";
import { createCompany, getCompanies, getCompanyById, updateCompany, generateCompaniesReport } from "./company.controller.js";
import { createCompanyValidator, getCompanyByIdValidator, updateCompanyValidator } from "../middlewares/company-validators.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRoles } from "../middlewares/validate-roles.js";

const router = Router();

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Registrar una nueva empresa (Solo Admin)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       201:
 *         description: Empresa creada exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post("/", validateJWT, hasRoles("ADMIN"), createCompanyValidator, createCompany);

/**
 * @swagger
 * /companies/report/excel:
 *   get:
 *     summary: Generar reporte Excel de empresas (Solo Admin)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte generado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.get("/report/excel", validateJWT, hasRoles("ADMIN"), generateCompaniesReport);

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Obtener todas las empresas activas (Solo Admin)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de empresas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 *       400:
 *         description: Error en la solicitud
 */
router.get("/", validateJWT, hasRoles("ADMIN"), getCompanies);

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Obtener una empresa por su ID (Solo Admin)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la empresa
 *     responses:
 *       200:
 *         description: Empresa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Empresa no encontrada
 */
router.get("/:id", validateJWT, hasRoles("ADMIN"), getCompanyByIdValidator, getCompanyById);

/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     summary: Actualizar una empresa por su ID (Solo Admin)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la empresa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: Empresa actualizada
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Empresa no encontrada
 */
router.put("/:id", validateJWT, hasRoles("ADMIN"), updateCompanyValidator, updateCompany);

export default router;