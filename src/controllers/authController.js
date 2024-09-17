const authService = require("../services/authService");
const UsuarioService = require("../services/usuarioService");

const authController = {
  login: async (req, res) => {
    try {
      const { email, senha } = req.body;
      const token = await authService.get_token(email, senha);
      res.status(200).json({ token });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  },

  get_me: async (req, res) => {
    try {
      const usuario = await UsuarioService.getUserByToken(
        req.headers.authorization
      );
      res.status(200).send({ success: true, usuario });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  },
};

module.exports = authController;
