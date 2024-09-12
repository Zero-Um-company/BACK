const { Usuario } = require("../models/Usuario");
const bcrypt = require('bcrypt');

const loginManager = {
    verificaEmail: async (email) => {
        if (!email) {
            throw new Error('E-mail é obrigatório');
        }

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            throw new Error('E-mail não cadastrado');
        }

        return usuario;
    },

    verificaSenha: async (senha, hash_senha) => {
        if (!senha) {
            throw new Error('Senha é obrigatória');
        }

        const isMatch = await bcrypt.compare(senha, hash_senha);
        if (!isMatch) {
            throw new Error('Senha incorreta');
        }

        return true;
    }
};

module.exports = loginManager;
