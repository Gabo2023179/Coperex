import { Schema, model } from "mongoose";

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la empresa es obligatorio"],
      trim: true,
      unique: true, // Evita nombres duplicados
    },
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
    },
    levelImpact: {
      type: String,
      required: [true, "El nivel de impacto es obligatorio"],
      enum: ["Bajo", "Medio", "Alto"], // Solo permite estos valores
    },
    yearsTrajectory: {
      type: Number,
      required: [true, "Los años de trayectoria son obligatorios"],
      min: [0, "Los años de trayectoria no pueden ser negativos"],
    },
    category: {
      type: String,
      required: [true, "La categoría empresarial es obligatoria"],
      trim: true, // 🚀 Ahora el ADMIN puede ingresar cualquier categoría
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // Solo el ADMIN puede registrar empresas
    },
    status: {
      type: Boolean,
      default: true, // Indica si la empresa está activa
    },
  },
  {
    timestamps: true, // Añade automáticamente "createdAt" y "updatedAt"
    versionKey: false,
  }
);

export default model("Company", CompanySchema);
