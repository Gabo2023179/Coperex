import { Router } from "express";
import {createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany} from "./company.controller.js";
import {createCompanyValidator, getCompanyByIdValidator, updateCompanyValidator, deleteCompanyValidator,} from "../middlewares/company-validators.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRoles } from "../middlewares/validate-roles.js";


const router = Router();

/**
 * @swagger
 * /api/v1/companies:
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
 * /api/v1/companies:
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
 * /api/v1/companies/{id}:
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
 * /api/v1/companies/{id}:
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

/* PARA LISTAR POR FILTRADO

Ejemplos de uso en la API:
✅ Empresas de A a Z (por defecto)

http
Copiar
Editar
GET /api/companies?limite=10&desde=0&order=asc

✅ Empresas de Z a A

http
Copiar
Editar
GET /api/companies?limite=10&desde=0&order=desc
✅ Empresas con al menos 5 años de experiencia

http
Copiar
Editar
GET /api/companies?minYears=5
✅ Empresas con máximo 10 años de experiencia

http
Copiar
Editar
GET /api/companies?maxYears=10
✅ Empresas entre 5 y 15 años de experiencia, ordenadas de Z a A

http
Copiar
Editar
GET /api/companies?minYears=5&maxYears=15&order=desc
✅ Empresas en la categoría "tecnología"

http
Copiar
Editar
GET /api/companies?category=tecnologia
✅ Empresas de la categoría "salud" con al menos 10 años de experiencia, ordenadas de A a Z

http
Copiar
Editar
GET /api/companies?category=salud&minYears=10&order=asc

*/
