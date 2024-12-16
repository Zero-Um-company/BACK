const Joi = require('joi');

const formValidator = Joi.object({
    ativo: Joi.boolean().required(),
    nome: Joi.string().max(100).required(),
    descricao: Joi.string().max(200).required(),
    criador: Joi.string().required(),
    leads: Joi.array().items(Joi.string()).optional(),
    perguntas: Joi.array().items(Joi.string()).required(),
    responsaveis: Joi.array().items(Joi.string()).optional(),
});

module.exports = formValidator;