const mongoose = require("mongoose");
const { HistoricoSchema } = require("./Historico");

const { Schema } = mongoose;

const produtoSchema = new Schema(
    {
        nome: {
            type: String,
            maxlength: 100,
            required: true,
        },
        descricao: {
            type: String,
            maxlength: 100,
            required: true,
        },
        ativo: {
            type: Boolean,
            required: true,
        },
        criador: {
            type: Schema.Types.ObjectId,
            ref: "Usuario",
        },
        responsaveis: {
            type: [Schema.Types.ObjectId],
            ref: "Usuario",
        },
        historico: {
            type: [HistoricoSchema],
            required: false,
        },
        product_image: {
            type: String, 
            required: false,
        },
    },
    { timestamps: true }
);

const Produto = mongoose.model("Produto", produtoSchema);

module.exports = {
    Produto,
    produtoSchema
};