const Joi = require('joi');

const updateFormValidator = Joi.object({
    ativo: Joi.boolean().optional(),
    descricao: Joi.string().max(200).optional(),
    leads: Joi.array().items(Joi.string()).optional(),
    perguntas: Joi.array().items(Joi.string()).optional(),
    responsaveis: Joi.array().items(Joi.string()).optional(),
});

module.exports = updateFormValidator;