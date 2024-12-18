const UsuarioService = require("../services/usuarioService");

const supervisorController = {
  criar_usuario: async (req, res) => {
    try {
      const usuario = await UsuarioService.criarUsuario(req);
      res
        .status(201)
        .send({
          success: true,
          message: "Usuário criado com sucesso",
          usuario,
        });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  },

  listar_usuarios: async (req, res) => {
    try {
      const usuarios = await UsuarioService.listarUsuarios(req.query);
      res.status(200).send({ success: true, usuarios });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  },

  editar_usuario: async (req, res) => {
    try {
      const usuario = await UsuarioService.editarUsuario(req);
      res.status(200).send({ success: true, usuario });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  },

  deletar_usuario: async (req, res) => {
    try {
      const usuario = await UsuarioService.deletarUsuario(req);
      res.status(200).send({ success: true, usuario });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  },
   
};

module.exports = supervisorController;
