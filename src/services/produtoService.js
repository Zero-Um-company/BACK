const ProdutoManager = require("../managers/produtoManager");
const mongoose = require("mongoose");

const ProdutoService = {
    criarProduto: async (req) => {
        try {
            const product = await ProdutoManager.createProduct(req.body, req.user.id);
            
            return product;
        } catch (error) {
            throw new Error(`Erro ao criar produto: ${error.message}`);
        }
    },
    editarProduto: async (req) => {
        try {
            const user = req.user;
            const { id } = req.params;
            const { product, action } = req.body;
            await ProdutoManager.updateProduct(user, id, product);
            return await ProdutoManager.updateHistory(id, action, req.user.id);
        } catch (error) {
            throw new Error(`Erro ao editar produto: ${error.message}.`);
        }
    },
    deletarProduto: async (req) => {
        try {
            const user = req.user;
            const { id } = req.params;
            return await ProdutoManager.deleteProduct(user, id);
        } catch (error) {
            throw new Error(`Erro ao deletar produto: ${error.message}.`);
        }
    },
    editarResponsaveis: async (req) => {
        try {
            const { id } = req.params;
            const { responsaveis, remove } = req.body;
            await ProdutoManager.updateResponsible(req.user, id, responsaveis, remove);
            return await ProdutoManager.updateHistory(id, "Atualização de responsáveis.", req.user.id);
        } catch (error) {
            throw new Error(`Erro ao editar responsáveis: ${error.message}`);
        }
    },
    getProdutos: async (req) => {
        const user = req.user;
        try {
            return await ProdutoManager.getAllProducts(user);
        } catch (error) {
            throw new Error(`Erro ao buscar produtos: ${error.message}`);
        }
    },
    alteraStatus: async (req) => {
        try {
            const { id } = req.params;
            const user = req.user
            const product = await ProdutoManager.toggleProductStatus(user, id);
            return await ProdutoManager.updateHistory(id, "Mudança de status.", req.user.id);
        } catch (error) {
            throw new Error(`Erro ao mudar status: ${error.message}`);
        }
    }
};

module.exports = ProdutoService;