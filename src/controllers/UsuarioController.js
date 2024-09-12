const UsuarioService = require('../services/UsuarioService');

const UsuarioController = {
    criar_usuario: async (req, res) => {
        try {
            const usuario = await UsuarioService.criarUsuario(req.body);
            res.status(201).send({ success: true, message: 'Usuário criado com sucesso', usuario });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message });
        }
    },

    listar_usuarios: async (req, res) => {
        try {
            const usuarios = await UsuarioService.listarUsuarios();
            res.status(200).send({ success: true, usuarios });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message });
        }
    },

    get_me: async (req, res) => {
        try {
            const usuario = await UsuarioService.getUserByToken(req.headers.authorization);
            res.status(200).send({ success: true, usuario });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message });
        }
    }
};

module.exports = UsuarioController;
