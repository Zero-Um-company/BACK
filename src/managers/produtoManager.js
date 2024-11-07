const { Produto } = require("../models/Produto");
const ProdutoValidator = require("../validators/ProdutoValidator");
const ProdutoUpdateValidator = require("../validators/ProdutoUpdateValidator");
const mongoose = require("mongoose");
const { to } = require("mathjs");

const ProdutoManager = {
    createProduct: async (product, editorId) => {
        const { error, value } = ProdutoValidator.validate(product);
        if (error) {
            throw new Error(`Erro de validação: ${error.details.map(e => e.message).join(", ")}`);
        } 
        value.historico = [{ editor: editorId, action: 'Criação de produto' }];
        value.responsaveis.push(editorId);
        const newProduct = new Produto(value);
        return await newProduct.save();
    },
    updateHistory: async (id, action, editor) => {
        const product = await Produto.findById(id);
        if (!product) {
            throw new Error('Produto não encontrado');
        }
        const history = { editor, action };
        product.historico.push(history);
        return await product.save();
    },
    updateProduct: async (user, id, updatedProduct) => {
        const { error, value } = ProdutoUpdateValidator.validate(updatedProduct);
        if (error) {
            throw new Error(`Erro de validação: ${error.details.map(e => e.message).join(", ")}`);
        }
        const product = await Produto.findById(id);
        if (!product) {
            throw new Error('Produto não encontrado');
        }
        if (user.role !== 'admin' && !product.responsaveis.includes(user.id)) {
            throw new Error('Usuário não autorizado', { cause: 403 });
        }
        product.set(value);
        
        return await product.save();
    },
    deleteProduct: async (user, id) => {
        const deletedProduct = await Produto.findById(id);
        if (!deletedProduct) {
            throw new Error('Produto não encontrado');
        }
        if(user.role !== 'admin' && !deletedProduct.responsaveis.includes(user.id)) {
            throw new Error('Usuário não autorizado', { cause: 403 });
        }

        return await Produto.findByIdAndDelete(id);
    },
    updateResponsible: async (user, id, responsibles, remove) => {
        const product = await Produto.findById(id);
        if (!product) {
            throw new Error('Produto não encontrado');
        }
        if (user.role !== 'admin' && !product.responsaveis.includes(user.id)) {
            throw new Error('Usuário não autorizado', { cause: 403 });
        }
        const currentIds = product.responsaveis.map(responsible => responsible.toString());
        if (remove) {
            const updatedResponsibles = currentIds.filter(id => !responsibles.includes(id));
            product.responsaveis = updatedResponsibles.map(id => mongoose.Types.ObjectId(id));
        } else {
            const newResponsibles = new Set([...currentIds, ...responsibles]);
            product.responsaveis = Array.from(newResponsibles).map(id => mongoose.Types.ObjectId(id));
        }

        return await product.save();
    },
    getAllProducts: async (user) => {
        if (user.role === 'admin') {
            return await Produto.find();
        }
        return await Produto.find({ responsaveis: mongoose.Types.ObjectId(user.id) });
    },
    toggleProductStatus: async (user, id) => {
        const product = await Produto.findById(id);
        if (!product) {
            throw new Error('Produto não encontrado');
        }
        if (user.role !== 'admin' && !product.responsaveis.includes(user.id)) {
            throw new Error('Usuário não autorizado', { cause: 403 });
        }
        product.ativo = !product.ativo;
        
        return await product.save();
    }
};

module.exports = ProdutoManager;