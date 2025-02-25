import Company from "./company.model.js";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

/**
 * @description Obtiene una empresa por su ID.
 * @route GET /api/v1/companies/:id
 * @access Privado (Solo Administradores)
 * @param {string} id - ID de la empresa a buscar (MongoDB ObjectId)
 */
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    // Busca la empresa en la base de datos y obtiene la información del usuario que la creó
    const company = await Company.findById(id).populate("createdBy", "name email");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Empresa no encontrada",
      });
    }

    return res.status(200).json({
      success: true,
      company,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener la empresa",
      error: err.message,
    });
  }
};

/**
 * @description Obtiene una lista de empresas activas con filtros y ordenación.
 * @route GET /api/v1/companies
 * @access Privado (Solo Administradores)
 * @query {number} [limite=10] - Número máximo de empresas a devolver por página.
 * @query {number} [desde=0] - Índice de paginación para saltar empresas previas.
 * @query {string} [order="asc"] - Orden de la lista (ascendente o descendente).
 * @query {number} [minYears] - Filtrar empresas con un mínimo de años de trayectoria.
 * @query {number} [maxYears] - Filtrar empresas con un máximo de años de trayectoria.
 * @query {string} [category] - Filtrar empresas por categoría.
 */
export const getCompanies = async (req, res) => {
  try {
    const { limite = 10, desde = 0, order = "asc", minYears, maxYears, category } = req.query;
    const query = { status: true };

    // Filtro por años de trayectoria
    if (minYears || maxYears) {
      query.yearsTrajectory = {};
      if (minYears) query.yearsTrajectory.$gte = Number(minYears);
      if (maxYears) query.yearsTrajectory.$lte = Number(maxYears);
    }

    // Filtro por categoría
    if (category) {
      query.category = category;
    }

    // Ordenación alfabética (ascendente por defecto, descendente si se indica)
    const sortOrder = order === "desc" ? -1 : 1;

    // Realiza la consulta en paralelo para mejorar eficiencia
    const [total, companies] = await Promise.all([
      Company.countDocuments(query),
      Company.find(query)
        .sort({ name: sortOrder })
        .skip(Number(desde))
        .limit(Number(limite))
        .populate("createdBy", "name email"),
    ]);

    return res.status(200).json({
      success: true,
      total,
      companies,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener las empresas",
      error: err.message,
    });
  }
};

/**
 * @description Actualiza los datos de una empresa existente.
 * @route PUT /api/v1/companies/:id
 * @access Privado (Solo Administradores)
 * @param {string} id - ID de la empresa a actualizar.
 * @body {object} data - Datos de la empresa a modificar.
 */
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Busca y actualiza la empresa asegurando que se validen los datos
    const company = await Company.findByIdAndUpdate(id, data, { new: true, runValidators: true });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Empresa no encontrada para actualizar",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Empresa actualizada exitosamente",
      company,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar la empresa",
      error: err.message,
    });
  }
};

/**
 * @description Registra una nueva empresa en la base de datos.
 * @route POST /api/v1/companies
 * @access Privado (Solo Administradores)
 * @body {string} name - Nombre de la empresa.
 * @body {string} description - Descripción de la empresa.
 * @body {string} levelImpact - Nivel de impacto (Bajo, Medio, Alto).
 * @body {number} yearsTrajectory - Años de trayectoria.
 * @body {string} category - Categoría de la empresa.
 */
export const createCompany = async (req, res) => {
  try {
    const { name, description, levelImpact, yearsTrajectory, category } = req.body;

    const newCompany = new Company({
      name,
      description,
      levelImpact,
      yearsTrajectory,
      category,
      createdBy: req.usuario._id, // Asigna el ID del usuario ADMIN que la creó
    });

    await newCompany.save();

    return res.status(201).json({
      success: true,
      message: "Empresa registrada exitosamente",
      company: newCompany,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al registrar la empresa",
      error: err.message,
    });
  }
};

/**
 * @description Genera un reporte en formato Excel con todas las empresas registradas.
 * @route GET /api/v1/companies/report/excel
 * @access Privado (Solo Administradores)
 */
export const generateCompaniesReport = async (req, res) => {
  try {
    // Obtener todas las empresas activas
    const companies = await Company.find({ status: true }).populate("createdBy", "name email");

    if (!companies.length) {
      return res.status(404).json({
        success: false,
        message: "No hay empresas registradas para generar el reporte",
      });
    }

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Empresas");

    // Definir los encabezados del reporte
    worksheet.columns = [
      { header: "ID", key: "_id", width: 25 },
      { header: "Nombre", key: "name", width: 30 },
      { header: "Descripción", key: "description", width: 40 },
      { header: "Impacto", key: "levelImpact", width: 15 },
      { header: "Años de Trayectoria", key: "yearsTrajectory", width: 20 },
      { header: "Categoría", key: "category", width: 20 },
      { header: "Creado por", key: "createdBy", width: 25 },
      { header: "Email del Creador", key: "createdByEmail", width: 30 },
    ];

    // Agregar filas con la información de cada empresa
    companies.forEach((company) => {
      worksheet.addRow({
        _id: company._id,
        name: company.name,
        description: company.description,
        levelImpact: company.levelImpact,
        yearsTrajectory: company.yearsTrajectory,
        category: company.category,
        createdBy: company.createdBy?.name || "Desconocido",
        createdByEmail: company.createdBy?.email || "Sin email",
      });
    });

    // Guardar archivo y enviarlo
    const filePath = path.join(process.cwd(), "reports", "Empresas_Reporte.xlsx");
    await workbook.xlsx.writeFile(filePath);
    res.download(filePath, "Empresas_Reporte.xlsx", () => fs.unlinkSync(filePath));
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al generar el reporte",
      error: err.message,
    });
  }
};
