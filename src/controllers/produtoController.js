const ProdutoService = require('../services/produtoService')

const ProdutoController = {
    criar_produto: async (req, res) => {
        try {
            const product = await ProdutoService.criarProduto(req);
            res.status(201).send({ success: true, message: 'Produto criado com sucesso', product });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message });
        }
    },
    atualizar_produto: async (req, res) => {
        try {
            const product = await ProdutoService.editarProduto(req);
            res.status(200).send({ success: true, message: 'Produto atualizado com sucesso', product });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message });
        }
    },
    deletar_produto: async (req, res) => {
        try {
            await ProdutoService.deletarProduto(req);
            res.status(200).send({ success: true, message: 'Produto deletado com sucesso' });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message });
        }
    },
};

module.exports = ProdutoController;