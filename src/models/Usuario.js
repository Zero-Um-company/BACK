const mongoose = require("mongoose");
const { RoleEnum } = require("../utils/enums/roleEnum");
const { HistoricoSchema } = require("./Historico");

const { Schema } = mongoose;

const usuarioSchema = new Schema(
  {
    nome: {
      type: String,
      maxlength: 100,
      required: true,
    },
    sobrenome: {
      type: String,
      maxlength: 100,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    telefone: {
      type: String,
      required: true,
    },
    role: {
      type: RoleEnum,
      required: true,
    },
    supervisores: {
      type: [Schema.Types.ObjectId],
      ref: "Usuario",
    },
    administradores: {
      type: [Schema.Types.ObjectId],
      ref: "Usuario",
    },
    senha: {
      type: String,
      required: true,
      maxlength: 100,
    },
    role: {
      type: String,
      required: true,
    },
    historico: {
      type: [HistoricoSchema],
      required: false,
    },
    user_image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
usuarioSchema.index({ email: 1 }, { unique: true });

const Usuario = mongoose.model("Usuario", usuarioSchema);

Usuario.createIndexes();
module.exports = {
  Usuario,
  usuarioSchema,
};
