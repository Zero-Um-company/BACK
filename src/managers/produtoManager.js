const { Produto } = require("../models/Produto");
const  ProdutoValidator  = require("../validators/ProdutoValidator");
const ProdutoUpdateValidator = require("../validators/ProdutoUpdateValidator");
const { updateHistory } = require("./usuarioManager");

const ProdutoManager = {
    createProduct: async (product) => {
        const { error, value } = ProdutoValidator.validate(product);
        if(error){
            throw new Error(`Erro de validação: ${error.details.map(e => e.message).join(", ")}`);
        }
        const newProduct = new Produto(value);
        return await newProduct.save();
    },
    updateHistory: async () => {

    },
    
    updateProduct: async (id, updatedProduct) => {
        const { error, value } = ProdutoUpdateValidator.validate(updatedProduct);
        if(error) {
            throw new Error(`Erro de validação: ${error.details.map(e => e.message).join(", ")}`);
        }
        const product = await Produto.findByIdAndUpdate(id,value, { new: true });
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
}

module.exports = ProdutoManager;