const { Usuario: UsuarioModel } = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwtConfig = require("../config/JWTconfig");
const UsuarioValidator = require("../validators/users/UsuarioValidator");
const HistoricoValidator = require("../validators/HistoricoValidator");
const Emailconfig = require("../config/Emailconfig");
const UpdateValidator = require("../validators/users/UpdateValidator");
const { ADMIN, SUPERVISOR, COLABORADOR } = require("../utils/enums/roleEnum");

const UsuarioManager = {
  createUser: async (user) => {
    const validatedUser = await UsuarioValidator.validateAsync(user);

    const salt = await bcrypt.genSalt(10);
    validatedUser.senha = await bcrypt.hash(user.senha, salt);

    const newUser = new UsuarioModel(validatedUser);
    return await newUser.save();
  },

  filterUsers: async (params) => {
    const allowedFields = [
      "_id",
      "nome",
      "sobrenome",
      "email",
      "telefone",
      "role",
      "supervisores",
      "administradores",
    ];
    const filters = {};

    Object.keys(params).forEach((key) => {
      if (allowedFields.includes(key)) {
        filters[key] = params[key];
      }
    });
    
    return await UsuarioModel.find(filters);
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

    return await UsuarioModel.findOneAndUpdate(
      { email: user.email },
      { $push: { historico: validatedHistory } },
      { new: true, useFindAndModify: false }
    );
  },

  updateUser: async (user) => {
    if (!user.email || user.email === "") {
        throw new Error("Email não fornecido");
    }

    const validatedUser = await UpdateValidator.validateAsync(user);
    const userToUpdate = await UsuarioModel.findOne({ email: user.email });

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
    } else if (req.body.role === "supervisor" && user.role !== "admin") {
      throw new Error("Acesso negado");
    } else {
      return;
    }
  },

  sendEmail: async (req) => {
    const user = req.body;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Cadastro de usuário",
      text:
        `Olá ${user.nome}, seu cadastro foi realizado com sucesso!\n` +
        `Seu login é: ${user.email}\n` +
        `Sua senha é: ${user.senha}`,
    };

    return await Emailconfig.sendMail(mailOptions);
  },
};

module.exports = UsuarioManager;
