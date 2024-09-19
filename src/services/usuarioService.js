const UsuarioManager = require("../managers/usuarioManager");

const UsuarioService = {
    criarUsuario: async (req) => {
        try {
            await UsuarioManager.createUser(req.body);
            return await UsuarioManager.updateHistory(req, 'Criação de usuário');
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
    },

    editarUsuario: async (req) => {
        try {
            await UsuarioManager.updateUser(req.body);
            return await UsuarioManager.updateHistory(req, 'Edição de usuário');

        } catch (error) {
            throw new Error(`Erro ao editar usuário: ${error.message}`);
        }
    },

    deletarUsuario: async (req) => {
        try {
            return await UsuarioManager.deleteUser(req.body._id);
        } catch (error) {
            throw new Error(`Erro ao deletar usuário: ${error.message}`);
        }
    }
};

module.exports = UsuarioService;
