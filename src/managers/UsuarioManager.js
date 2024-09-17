const { Usuario: UsuarioModel } = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwtConfig = require("../config/JWTconfig");
const UsuarioDTO = require("../dtos/UsuarioDTO");
const { verify } = require("jsonwebtoken");

const UsuarioManager = {
  createUser: async (userDTO) => {
    const user = new UsuarioDTO(userDTO);

    const validationErrors = UsuarioDTO.validate(user);
    if (validationErrors.length > 0) {
      throw new Error(`Erro de validação: ${validationErrors.join(", ")}`);
    }

    const salt = await bcrypt.genSalt(10);
    user.senha = await bcrypt.hash(user.senha, salt);

    const newUser = new UsuarioModel(user);
    return await newUser.save();
  },

  listUsers: async () => {
    return await UsuarioModel.find();
  },

  getUserBy: async (field, value) => {
    return await UsuarioModel.findOne({ [`${field}`]: value });
  },

  decodeToken: (token) => {
    if (!token) {
      throw new Error("Token não fornecido");
    }
    token = token.split(" ")[1];
    return jwtConfig.decodeToken(token);
  },

  updateHistory: async (req, action) => {
    const user = req.body;

    const editor = await UsuarioManager.decodeToken(req.headers.authorization);
    const updated_at = new Date().toISOString();
    const history = { updated_at, editor: editor.id, action };

    return await UsuarioModel.findOneAndUpdate(
      { email: user.email }, 
      { $push: { historico: history } }, 
      { new: true, useFindAndModify: false } 
    );
    
  }
};

module.exports = UsuarioManager;
