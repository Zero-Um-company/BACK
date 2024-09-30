const Joi = require('joi')
const RoleEnum = require("../../utils/enums/roleEnum");

const UsuarioValidator = Joi.object({
  nome: Joi.string().required(),
  sobrenome: Joi.string().required(),
  email: Joi.string().email().required(),
  telefone: Joi.string().pattern(new RegExp("^[0-9]{10,11}$")).required(),
  supervisores: Joi.array().optional(),
  senha: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  role: Joi.string().valid(RoleEnum.ADMIN, RoleEnum.SUPERVISOR, RoleEnum.COLABORADOR).required(),
  historico: Joi.array().optional(),
  user_image: Joi.string().optional(),
});

module.exports = UsuarioValidator;
