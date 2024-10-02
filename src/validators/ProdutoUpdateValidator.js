const Joi = require('joi');
const HistoricoValidator = require('./HistoricoValidator');

const ProdutoUpdateValidator = Joi.object({
    ativo: Joi.boolean().optional(),
    nome: Joi.string().max(100).optional(),
    descricao: Joi.string().max(200).optional(),
    responsaveis: Joi.array().items(Joi.string()).optional(),
    historico: Joi.array().items(HistoricoValidator).optional(),
    product_image: Joi.string().optional(),
})

module.exports = ProdutoUpdateValidator;