const { Usuario: UsuarioModel } = require("../models/Usuario");
const bcrypt = require('bcrypt');

const UsuarioManager = {
    createUser: async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(user.senha, salt);
        user.senha = hash_password;
        const newUser = new UsuarioModel(user);
        return await newUser.save();
    },

    getUserByToken: async (token) => {
        return await UsuarioModel.findOne({ token });
    }
};

module.exports = UsuarioManager;
