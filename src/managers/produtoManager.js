const { Produto } = require("../models/Produto");
const ProdutoValidator = require("../validators/ProdutoValidator");
const ProdutoUpdateValidator = require("../validators/ProdutoUpdateValidator");
const mongoose = require("mongoose");

const ProdutoManager = {
    createProduct: async (product) => {
        const { error, value } = ProdutoValidator.validate(product);
        if (error) {
            throw new Error(`Erro de validação: ${error.details.map(e => e.message).join(", ")}`);
        }
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
    updateProduct: async (id, updatedProduct) => {
        const { error, value } = ProdutoUpdateValidator.validate(updatedProduct);
        if (error) {
            throw new Error(`Erro de validação: ${error.details.map(e => e.message).join(", ")}`);
        }
        const product = await Produto.findByIdAndUpdate(id, value, { new: true });
        if (!product) {
            throw new Error('Produto não encontrado');
        }
        return product;
    },
    deleteProduct: async (id) => {
        const deletedProduct = await Produto.findByIdAndDelete(id);
        if (!deletedProduct) {
            throw new Error('Produto não encontrado');
        }
        return deletedProduct;
    },
    updateResponsible: async (id, responsibles, remove) => {
        const product = await Produto.findById(id);
        if (!product) {
            throw new Error('Produto não encontrado');
        }
        const currentIds = product.responsaveis.map(responsible => responsible.toString());
        if(remove) {
            const updatedResponsibles = currentIds.filter(id => !responsibles.includes(id));
            product.responsaveis = updatedResponsibles.map(id => mongoose.Types.ObjectId(id));
        } else {
            const newResponsibles = new Set([...currentIds, ...responsibles]);
            product.responsaveis = Array.from(newResponsibles).map(id => mongoose.Types.ObjectId(id));
        }

        return await product.save();
    },
    getAllProducts: async (userId) => {
        return await Produto.find({ responsaveis: mongoose.Types.ObjectId(userId) });
    }
}

module.exports = ProdutoManager;