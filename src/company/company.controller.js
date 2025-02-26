// Importaciones necesarias:
// - Company: modelo de Mongoose que representa a las empresas en la base de datos.
// - ExcelJS: librería para la generación y manipulación de archivos Excel.
// - path: módulo de Node.js para trabajar con rutas de archivos.
// - fs: módulo de Node.js para interactuar con el sistema de archivos.
import Company from "./company.model.js";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

/**
 * Obtiene una empresa específica según su ID.
 *
 * @function getCompanyById
 * @async
 * @description Este controlador busca en la base de datos una empresa utilizando el ID proporcionado en la URL (req.params.id). 
 *              Además, realiza un "populate" en el campo "createdBy" para obtener datos básicos (nombre y email) del usuario que creó la empresa.
 *              Si la empresa no es encontrada, responde con un error 404. Si ocurre algún error en el proceso, responde con un error 500.
 *
 * @param {object} req - Objeto de solicitud Express.
 * @param {object} req.params - Parámetros de la ruta.
 * @param {string} req.params.id - Identificador (MongoDB ObjectId) de la empresa a buscar.
 * @param {object} res - Objeto de respuesta Express.
 *
 * @returns {Promise<object>} Respuesta HTTP en formato JSON con la información de la empresa o un mensaje de error.
 *
 * @example
 * // Solicitud GET a /api/v1/companies/608d1b2f4b1e883f1c2a1234 devolverá:
 * {
 *   success: true,
 *   company: {
 *     _id: "608d1b2f4b1e883f1c2a1234",
 *     name: "Nombre de la Empresa",
 *     description: "Descripción de la empresa",
 *     levelImpact: "Medio",
 *     yearsTrajectory: 10,
 *     category: "Tecnología",
 *     createdBy: {
 *       name: "Admin",
 *       email: "admin@example.com"
 *     }
 *   }
 * }
 */
export const getCompanyById = async (req, res) => {
  try {
    // Extrae el parámetro 'id' de la URL
    const { id } = req.params;

    // Realiza la búsqueda de la empresa por su ID y "popula" el campo "createdBy"
    // para obtener únicamente los campos "name" y "email" del usuario que la creó.
    const company = await Company.findById(id).populate("createdBy", "name email");

    // Si la empresa no existe, se retorna un error 404 con un mensaje informativo.
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Empresa no encontrada",
      });
    }

    // Si la empresa fue encontrada, se retorna con estado 200 y la información de la empresa.
    return res.status(200).json({
      success: true,
      company,
    });
  } catch (err) {
    // Captura cualquier error que se genere durante el proceso y lo retorna con un estado 500.
    return res.status(500).json({
      success: false,
      message: "Error al obtener la empresa",
      error: err.message,
    });
  }
};

/**
 * Obtiene una lista de empresas activas aplicando filtros y ordenación.
 *
 * @function getCompanies
 * @async
 * @description Este controlador obtiene de la base de datos un listado de empresas que se encuentren activas (status: true). 
 *              Permite filtrar los resultados por:
 *                - Años de trayectoria mínimo y máximo (minYears y maxYears)
 *                - Categoría
 *              También permite la paginación y la ordenación alfabética (ascendente o descendente) según el nombre de la empresa.
 *              Se ejecutan dos consultas en paralelo para obtener el total de documentos que coinciden y los documentos filtrados.
 *
 * @param {object} req - Objeto de solicitud Express.
 * @param {object} req.query - Parámetros de consulta.
 * @param {number} [req.query.limite=10] - Límite de empresas a mostrar por página.
 * @param {number} [req.query.desde=0] - Índice desde el cual comenzar la paginación.
 * @param {string} [req.query.order="asc"] - Orden de la lista ("asc" para ascendente, "desc" para descendente).
 * @param {number} [req.query.minYears] - Valor mínimo de años de trayectoria para filtrar.
 * @param {number} [req.query.maxYears] - Valor máximo de años de trayectoria para filtrar.
 * @param {string} [req.query.category] - Categoría por la cual filtrar las empresas.
 * @param {object} res - Objeto de respuesta Express.
 *
 * @returns {Promise<object>} Respuesta HTTP en formato JSON con el total de empresas y el listado de empresas.
 *
 * @example
 * // Solicitud GET a /api/v1/companies?limite=5&desde=0&order=asc&minYears=5 devolverá:
 * {
 *   success: true,
 *   total: 12,
 *   companies: [ { ... }, { ... }, ... ]
 * }
 */
export const getCompanies = async (req, res) => {
  try {
    // Extrae los parámetros de consulta con valores por defecto
    const { limite = 10, desde = 0, order = "asc", minYears, maxYears, category } = req.query;

    // Inicializa el objeto de consulta para MongoDB.
    // Se filtran únicamente las empresas activas (status: true).
    const query = { status: true };

    // Si se especifica un filtro para años de trayectoria, se agrega al query.
    // Se verifica si existen los parámetros minYears o maxYears.
    if (minYears || maxYears) {
      query.yearsTrajectory = {};
      if (minYears) query.yearsTrajectory.$gte = Number(minYears);
      if (maxYears) query.yearsTrajectory.$lte = Number(maxYears);
    }

    // Si se especifica un filtro por categoría, se agrega al query.
    if (category) {
      query.category = category;
    }

    // Determina el orden de la consulta.
    // Si el parámetro "order" es "desc", se usa -1 para orden descendente, de lo contrario, 1 para ascendente.
    const sortOrder = order === "desc" ? -1 : 1;

    // Se ejecutan dos consultas en paralelo:
    // 1. Conteo total de empresas que cumplen el filtro.
    // 2. Consulta que obtiene la lista de empresas filtradas, ordenadas y paginadas.
    const [total, companies] = await Promise.all([
      Company.countDocuments(query),
      Company.find(query)
        .sort({ name: sortOrder })
        .skip(Number(desde))
        .limit(Number(limite))
        // Se realiza el "populate" para obtener los campos "name" y "email" del usuario creador.
        .populate("createdBy", "name email"),
    ]);

    // Se retorna la respuesta exitosa con el total y el listado de empresas.
    return res.status(200).json({
      success: true,
      total,
      companies,
    });
  } catch (err) {
    // Si ocurre un error, se captura y se retorna con un código 500 y un mensaje informativo.
    return res.status(500).json({
      success: false,
      message: "Error al obtener las empresas",
      error: err.message,
    });
  }
};

/**
 * Actualiza la información de una empresa existente.
 *
 * @function updateCompany
 * @async
 * @description Este controlador actualiza los datos de una empresa utilizando su ID. 
 *              Se recibe el ID de la empresa a actualizar a través de los parámetros de la URL (req.params.id) y los nuevos datos a través del cuerpo de la solicitud (req.body).
 *              Se utiliza el método findByIdAndUpdate de Mongoose para actualizar el documento, retornando el documento actualizado.
 *              En caso de que la empresa no se encuentre, se retorna un error 404; si ocurre algún error durante el proceso, se retorna un error 500.
 *
 * @param {object} req - Objeto de solicitud Express.
 * @param {object} req.params - Parámetros de la ruta.
 * @param {string} req.params.id - ID de la empresa que se desea actualizar.
 * @param {object} req.body - Objeto que contiene los nuevos datos de la empresa.
 * @param {object} res - Objeto de respuesta Express.
 *
 * @returns {Promise<object>} Respuesta HTTP en formato JSON que indica si la actualización fue exitosa o si se produjo un error.
 *
 * @example
 * // Solicitud PUT a /api/v1/companies/608d1b2f4b1e883f1c2a1234 con body:
 * {
 *   "description": "Nueva descripción",
 *   "category": "Salud"
 * }
 * // Respuesta:
 * {
 *   success: true,
 *   message: "Empresa actualizada exitosamente",
 *   company: { ...documento actualizado... }
 * }
 */
export const updateCompany = async (req, res) => {
  try {
    // Extrae el ID de la empresa desde los parámetros de la ruta
    const { id } = req.params;
    // Extrae los datos a actualizar desde el cuerpo de la solicitud
    const data = req.body;

    // Se utiliza findByIdAndUpdate para actualizar el documento en la base de datos.
    // La opción "new: true" hace que se retorne el documento actualizado.
    // "runValidators: true" asegura que se ejecuten las validaciones definidas en el esquema.
    const company = await Company.findByIdAndUpdate(id, data, { new: true, runValidators: true });

    // Si no se encuentra la empresa, se retorna un error 404.
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Empresa no encontrada para actualizar",
      });
    }

    // Si la actualización es exitosa, se retorna el documento actualizado junto con un mensaje de éxito.
    return res.status(200).json({
      success: true,
      message: "Empresa actualizada exitosamente",
      company,
    });
  } catch (err) {
    // En caso de error, se retorna un código 500 junto con el mensaje de error.
    return res.status(500).json({
      success: false,
      message: "Error al actualizar la empresa",
      error: err.message,
    });
  }
};

/**
 * Registra una nueva empresa en la base de datos.
 *
 * @function createCompany
 * @async
 * @description Este controlador registra una nueva empresa. El campo "yearsTrajectory" se interpreta como el año de fundación ingresado por el ADMIN.
 *              Se calcula la trayectoria de la empresa como la diferencia entre el año actual y el año de fundación proporcionado.
 *              Se asume que el usuario autenticado (ADMIN) se encuentra en req.usuario.
 *
 * @param {object} req - Objeto de solicitud Express.
 * @param {object} req.body - Objeto que contiene los datos para la nueva empresa.
 * @param {string} req.body.name - Nombre de la empresa.
 * @param {string} req.body.description - Descripción de la empresa.
 * @param {string} req.body.levelImpact - Nivel de impacto de la empresa ("Bajo", "Medio" o "Alto").
 * @param {number} req.body.yearsTrajectory - Año de fundación de la empresa (se interpretará para calcular la trayectoria).
 * @param {string} req.body.category - Categoría a la que pertenece la empresa.
 * @param {object} req.usuario - Objeto que representa al usuario autenticado (se espera que contenga la propiedad _id).
 * @param {object} res - Objeto de respuesta Express.
 *
 * @returns {Promise<object>} Respuesta HTTP en formato JSON indicando el éxito o fallo en el registro de la empresa.
 *
 * @example
 * // Solicitud POST a /api/v1/companies con body:
 * {
 *   "name": "Empresa XYZ",
 *   "description": "Empresa dedicada a...",
 *   "levelImpact": "Alto",
 *   "yearsTrajectory": 2005,  // Año de fundación
 *   "category": "Tecnología"
 * }
 * // Se calculará: currentYear - 2005, por ejemplo, si el año actual es 2023, se almacenará 18.
 */
export const createCompany = async (req, res) => {
  try {
    // Desestructura los campos del cuerpo de la solicitud
    const { name, description, levelImpact, yearsTrajectory, category } = req.body;

    // Se interpreta que el valor recibido en "yearsTrajectory" corresponde al año de fundación.
    // Se convierte a número entero.
    const foundingYear = parseInt(yearsTrajectory, 10);
    // Se obtiene el año actual.
    const currentYear = new Date().getFullYear();
    // Se calcula la diferencia, que representa los años de trayectoria.
    const computedYearsTrajectory = currentYear - foundingYear;

    // Se crea un nuevo documento de Company con la información proporcionada.
    // Se asigna la trayectoria calculada en lugar del año de fundación.
    // Se asume que req.usuario._id es el identificador del usuario ADMIN que registra la empresa.
    const newCompany = new Company({
      name,
      description,
      levelImpact,
      yearsTrajectory: computedYearsTrajectory, // Se almacena el resultado de: (año actual - año de fundación)
      category,
      createdBy: req.usuario._id,
    });

    // Guarda el nuevo documento en la base de datos.
    await newCompany.save();

    // Se retorna una respuesta exitosa con el estado 201 (creado) y la información de la nueva empresa.
    return res.status(201).json({
      success: true,
      message: "Empresa registrada exitosamente",
      company: newCompany,
    });
  } catch (err) {
    // Si ocurre algún error durante el proceso, se captura y se retorna con estado 500.
    return res.status(500).json({
      success: false,
      message: "Error al registrar la empresa",
      error: err.message,
    });
  }
};

/**
 * Genera y descarga un reporte en formato Excel con todas las empresas registradas.
 *
 * @function generateCompaniesReport
 * @async
 * @description Este controlador obtiene todas las empresas activas (status: true) de la base de datos, 
 *              genera un archivo Excel con un reporte que incluye información relevante de cada empresa y luego lo envía al cliente.
 *              El reporte incluye columnas como ID, nombre, descripción, impacto, trayectoria, categoría y datos del creador.
 *              Se utiliza la librería ExcelJS para la creación del archivo y se maneja la descarga del archivo al finalizar.
 *
 * @param {object} req - Objeto de solicitud Express.
 * @param {object} res - Objeto de respuesta Express.
 *
 * @returns {Promise<void>} No retorna un valor directamente, pero envía el archivo Excel al cliente o un error si ocurre.
 *
 * @example
 * // Solicitud GET a /api/v1/companies/report/excel
 * // Se genera y descarga el archivo "Empresas_Reporte.xlsx" con el listado de empresas.
 */
export const generateCompaniesReport = async (req, res) => {
  try {
    // Se obtienen todas las empresas activas y se "popula" el campo "createdBy" para obtener los datos del usuario creador.
    const companies = await Company.find({ status: true }).populate("createdBy", "name email");

    // Si no hay empresas activas, se retorna un error 404 indicando que no se puede generar el reporte.
    if (!companies.length) {
      return res.status(404).json({
        success: false,
        message: "No hay empresas registradas para generar el reporte",
      });
    }

    // Se crea una nueva instancia de Workbook de ExcelJS para generar el reporte.
    const workbook = new ExcelJS.Workbook();
    // Se agrega una hoja de trabajo llamada "Empresas".
    const worksheet = workbook.addWorksheet("Empresas");

    // Se definen las columnas del reporte, estableciendo encabezados, claves para los datos y anchos para cada columna.
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

    // Itera sobre cada empresa para agregar una fila en el reporte.
    // Se utilizan valores predeterminados en caso de que no exista información en el campo "createdBy".
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

    // Define la ruta del directorio "reports" en el directorio raíz del proceso.
    const reportsDir = path.join(process.cwd(), "reports");
    // Verifica si el directorio "reports" existe; si no, lo crea de forma recursiva.
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Define la ruta completa y el nombre del archivo Excel que se generará.
    const filePath = path.join(reportsDir, "Empresas_Reporte.xlsx");
    // Escribe el archivo Excel en la ruta especificada.
    await workbook.xlsx.writeFile(filePath);
    // Envía el archivo generado al cliente para su descarga.
    // Una vez que se descarga el archivo, se elimina del servidor mediante fs.unlinkSync(filePath).
    res.download(filePath, "Empresas_Reporte.xlsx", () => fs.unlinkSync(filePath));
  } catch (err) {
    // Si ocurre un error durante la generación o envío del reporte, se retorna un error 500.
    return res.status(500).json({
      success: false,
      message: "Error al generar el reporte",
      error: err.message,
    });
  }
};
