const { Schema, default: mongoose } = require('mongoose');


const HistoricoSchema = new Schema({
    updated_at: {
        type: String,
        required: true,
    },
    editor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
});

const Historico = mongoose.model('Historico', HistoricoSchema);

module.exports = {
    Historico,
    HistoricoSchema,
}