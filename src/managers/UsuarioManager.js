const { Usuario: UsuarioModel } = require("../models/Usuario");
const bcrypt = require('bcrypt');
const jwtConfig = require("../config/jwtConfig");

const UsuarioManager = {
    createUser: async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(user.senha, salt);
        user.senha = hash_password;
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
        token = token.split(' ')[1];
        return jwtConfig.decodeToken(token);
    }


};

module.exports = UsuarioManager;
