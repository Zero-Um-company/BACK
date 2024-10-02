const Joi = require('joi');
const HistoricoValidator = require('./HistoricoValidator');

const ProdutoValidator = Joi.object({
    ativo: Joi.boolean().required(),
    nome: Joi.string().max(100).required(),
    descricao: Joi.string().max(200).required(),
    criador: Joi.string().required(),
    responsaveis: Joi.array().items(Joi.string()).optional(),
    historico: Joi.array().items(HistoricoValidator).optional(),
    product_image: Joi.string().optional(),
});

module.exports = ProdutoValidator;