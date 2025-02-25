import Company from "./company.model.js";

/**
 * Obtiene una empresa por su ID.
 * Se asume que el validador (getCompanyByIdValidator) ya comprobó que:
 * - El token JWT es válido.
 * - El parámetro "id" es un MongoID válido.
 * - La empresa existe en la BD.
 */
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

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
 * Obtiene una lista de empresas activas (status: true).
 */
export const getCompanies = async (req, res) => {
  try {
    const { limite = 5, desde = 0 } = req.query;
    const query = { status: true };

    const [total, companies] = await Promise.all([
      Company.countDocuments(query),
      Company.find(query)
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
 * Realiza una eliminación lógica de una empresa (cambia su status a false).
 * Se asume que el validador deleteCompanyValidator ya validó:
 * - La validez del token JWT.
 * - Los permisos del usuario.
 * - Que la empresa a eliminar existe y no ha sido eliminada previamente.
 */
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Empresa no encontrada para eliminar",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Empresa eliminada (lógicamente)",
      company,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar la empresa",
      error: err.message,
    });
  }
};

/**
 * Actualiza los datos de una empresa.
 * Se asume que el validador updateCompanyValidator ya validó:
 * - La validez del token JWT.
 * - El ID de la empresa.
 * - Que los datos recibidos son correctos.
 */
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const company = await Company.findByIdAndUpdate(id, data, { new: true });

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
 * Registra una nueva empresa en la base de datos.
 * Se asume que el validador createCompanyValidator ya validó:
 * - La validez del token JWT.
 * - Que el usuario tiene permisos de ADMIN.
 * - Que los datos requeridos son correctos.
 */
export const createCompany = async (req, res) => {
  try {
    const { name, description, levelImpact, yearsTrajectory, category } =
      req.body;

    const newCompany = new Company({
      name,
      description,
      levelImpact,
      yearsTrajectory,
      category,
      createdBy: req.usuario._id, // Se asigna el admin que la creó
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
