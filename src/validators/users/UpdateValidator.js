const Joi = require('joi')
const RoleEnum = require("../../utils/enums/roleEnum");

const UpdateValidator = Joi.object({
  nome: Joi.string().optional(),
  sobrenome: Joi.string().optional(),
  email: Joi.string().email().optional(),
  telefone: Joi.string().pattern(new RegExp("^[0-9]{10,11}$")).optional(),
  supervisores: Joi.array().optional(),
  senha: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).optional(),
  role: Joi.string().valid(RoleEnum.ADMIN, RoleEnum.SUPERVISOR, RoleEnum.COLABORADOR).optional(),
  historico: Joi.array().optional(),
  user_image: Joi.string().optional(),
});

module.exports = UpdateValidator;
