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
            console.log(id);
            return await ProdutoManager.deleteProduct(id);
        } catch (error) {
            throw new Error(`Erro ao deletar produto: ${error.message}.`);
        }
    },
};

module.exports = ProdutoService;