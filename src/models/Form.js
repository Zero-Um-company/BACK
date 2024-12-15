const mongoose = require('mongoose')
const { Schema } = mongoose;

const formSchema = new Schema(
    {
        ativo: {
            type: Boolean,
            required: true
        },
        nome: {
            type: String,
            maxlength: 100,
            required: true,
        },
        descricao: {
            type: String,
            maxlength: 100,
            required: true
        },
        perguntas: {
            type: [String],
            required: true
        },
        leads: {
            type: Schema.Types.ObjectId,
            ref: "Usuario"
        },
        criador: {
            type: Schema.Types.ObjectId,
            ref: "Usuario"
        },
        responsaveis: {
            type: [Schema.Types.ObjectId],
            ref: "Usuario"
        },
    }, { timestamps: true }
)

const Form = mongoose.model('Form', formSchema);

module.exports = {
    Form,
    formSchema
}