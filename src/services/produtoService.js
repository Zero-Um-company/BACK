const ProdutoManager = require("../managers/produtoManager");

const ProdutoService = {
    criarProduto: async (req) => {
        try {
            const product = await ProdutoManager.createProduct(req.body);
            return product;
        } catch (error) {
            throw new Error(`Erro ao criar produto: ${error.message}`);
        }
    },
    editarProduto: async (req) => {
        try {
            const { id } = req.params;
            const { product, action } = req.body;
            return await ProdutoManager.updateProduct(id, product);
            // return await ProdutoManager.updateHistory(id, action);
        } catch (error) {
            throw new Error(`Erro ao editar produto: ${error.message}.`);
        }
    },
    deletarProduto: async (req) => {
        try {
            const { id } = req.params;
            return await ProdutoManager.deleteProduct(id);
        } catch (error) {
            throw new Error(`Erro ao deletar produto: ${error.message}.`);
        }
    },
    editarResponsaveis: async (req) => {
        try {
            const { id } = req.params;
            const { responsaveis, remove } = req.body;
            return await ProdutoManager.updateResponsible(id,responsaveis,remove);
        } catch (error) {
            throw new Error(`Erro ao editar responsáveis: ${error.message}`);
        }
    },
    getProdutos: async (req) => {
        const { userId } = req.body;
        try {
            return await ProdutoManager.getAllProducts(userId);
        } catch (error) {
            throw new Error(`Erro ao buscar produtos: ${error.message}`);
        }
    }
};

module.exports = ProdutoService;