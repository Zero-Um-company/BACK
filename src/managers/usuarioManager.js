const { Usuario: UsuarioModel } = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwtConfig = require("../config/JWTconfig");
const UsuarioValidator = require("../validators/users/UsuarioValidator");
const HistoricoValidator = require("../validators/HistoricoValidator");
const Emailconfig = require("../config/Emailconfig");

const UsuarioManager = {
  createUser: async (user) => {
    const validatedUser = await UsuarioValidator.validateAsync(user);
    if (!validatedUser) {
      throw new Error(validatedUser.error);
    }

    const salt = await bcrypt.genSalt(10);
    validatedUser.senha = await bcrypt.hash(user.senha, salt);

    const newUser = new UsuarioModel(validatedUser);
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
    const history = { editor: editor.id, action };

    const validatedHistory = await HistoricoValidator.validateAsync(history);
    if (!validatedHistory) {
      throw new Error(validatedHistory.error);
    }

    return await UsuarioModel.findOneAndUpdate(
      { email: user.email },
      { $push: { historico: validatedHistory } },
      { new: true, useFindAndModify: false }
    );
  },

  updateUser: async (user) => {
    const validatedUser = await UsuarioValidator.validateAsync(user);
    if (!validatedUser) {
      throw new Error(validatedUser.error);
    }

    const userToUpdate = await UsuarioManager.getUserBy("email", user.email);
    if (!userToUpdate) {
      throw new Error("Usuário não encontrado");
    }

    if (user.senha) {
      const salt = await bcrypt.genSalt(10);
      validatedUser.senha = await bcrypt.hash(user.senha, salt);
    }

    return await UsuarioModel.findOneAndUpdate(
      { email: user.email },
      validatedUser,
      { new: true, useFindAndModify: false }
    );
  },

  deleteUser: async (_id) => {
    const userDeleted = await UsuarioModel.findOneAndDelete({ _id });
    if (!userDeleted) {
      throw new Error("Usuário não encontrado");
    }
    return userDeleted;
  },

  verifyCreateRole: async (req) => {
    const user = await UsuarioManager.decodeToken(req.headers.authorization);
    if (req.body.role === "admin" && user.role !== "admin") {
      throw new Error("Acesso negado");
    }
    else if (req.body.role === "supervisor" && user.role !== "admin") {
      throw new Error("Acesso negado");
    }
    else {
      return;
    }
  },

  sendEmail: async (req) => {
    const user = req.body;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Cadastro de usuário",
      text: `Olá ${user.nome}, seu cadastro foi realizado com sucesso!
      Seu login é: ${user.email}
      Sua senha é: ${user.senha}
      `
    };

    return await Emailconfig.sendMail(mailOptions);
  }
};

module.exports = UsuarioManager;
