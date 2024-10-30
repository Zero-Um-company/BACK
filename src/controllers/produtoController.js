const ProdutoService = require('../services/produtoService');
const { message } = require('../validators/HistoricoValidator');

const ProdutoController = {
    criar_produto: async (req, res) => {
        try {
            const product = await ProdutoService.criarProduto(req);
            res.status(201).send({ success: true, message: 'Produto criado com sucesso.', product });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message });
        }
    },
    atualizar_produto: async (req, res) => {
        try {
            const product = await ProdutoService.editarProduto(req);
            res.status(201).send({ success: true, message: 'Produto atualizado com sucesso.', product });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message });
        }
    },
    deletar_produto: async (req, res) => {
        try {
            await ProdutoService.deletarProduto(req);
            res.status(200).send({ success: true, message: 'Produto deletado com sucesso.' });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message });
        }
    },
    editar_responsaveis: async (req, res) => {
        try {
            const product = await ProdutoService.editarResponsaveis(req);
            res.status(201).send({ success: true, message: 'Lista de responsáveis atualizada com sucesso.', product})
        } catch (error) {
            res.status(400).send({success: false, message: error.message});
        }
    },
    buscar_produtos: async (req, res) => {
        try {
            const products = await ProdutoService.getProdutos(req);
            res.status(200).send({ success: true, products });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message });
        }
    }
};

module.exports = ProdutoController;