const { Schema, default: mongoose } = require('mongoose');


const HistoricoSchema = new Schema({
    editor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
},
{ timestamps: true }
);


const Historico = mongoose.model('Historico', HistoricoSchema);

module.exports = {
    Historico,
    HistoricoSchema,
}