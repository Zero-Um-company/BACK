const UsuarioManager = require("../managers/UsuarioManager");
const bcrypt = require('bcrypt');

const UsuarioService = {
    criarUsuario: async (req) => {
        try {
            await UsuarioManager.createUser(req.body);
            await UsuarioManager.updateHistory(req, 'Criação de usuário');
        } catch (error) {
            throw new Error(`Erro ao criar usuário: ${error.message}`);
        }
    },

    listarUsuarios: async () => {
        try {
            return await UsuarioManager.listUsers();
        } catch (error) {
            throw new Error(`Erro ao listar usuários: ${error.message}`);
        }
    },

    getUserByToken: async (token) => {
        try {
            const user = UsuarioManager.decodeToken(token);
            return await UsuarioManager.getUserBy('email', user.email);
        } catch (error) {
            throw new Error(`Erro ao recuperar usuário: ${error.message}`);
        }
    }
};

module.exports = UsuarioService;
