const { Usuario: UsuarioModel } = require("../models/Usuario");

const UsuarioManager = {
    createUser: async (user) => {
        const newUser = new UsuarioModel(user);
        return await newUser.save();
    }
}

module.exports = UsuarioManager;