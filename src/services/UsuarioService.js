const UsuarioManager = require("../managers/UsuarioManager");

const UsuarioService = {
    criarUsuario: async (user) => {
        try {
            return await UsuarioManager.createUser(user);
        } catch (error) {
            throw new Error(`Erro ao criar usuário: ${error.message}`);
        }
    },

    getUserByToken: async (token) => {
        try {
            return await UsuarioManager.getUserByToken(token);
        } catch (error) {
            throw new Error(`Erro ao recuperar usuário: ${error.message}`);
        }
    }
};

module.exports = UsuarioService;
