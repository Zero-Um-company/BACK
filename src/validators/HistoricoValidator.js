const Joi = require('joi');

const HistoricoValidator = Joi.object({
    editor: Joi.string().required(),
    action: Joi.string().required(),
});

module.exports = HistoricoValidator;