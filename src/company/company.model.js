import { Schema, model } from "mongoose";

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la empresa es obligatorio"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
    },
    levelImpact: {
      type: String,
      required: [true, "El nivel de impacto es obligatorio"],
      enum: ["Bajo", "Medio", "Alto"],
    },
    yearsTrajectory: {
      type: Number,
      required: [true, "Los años de trayectoria son obligatorios"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "La categoría empresarial es obligatoria"],
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: Boolean,
      default: true, // Indica si la empresa sigue activa (no se elimina físicamente)
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
    versionKey: false,
  }
);

export default model("Company", CompanySchema);