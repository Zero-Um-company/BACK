const UsuarioManager = require("../managers/UsuarioManager");

const UsuarioController = {
    criar_usuario: async (req, res) => {
        await UsuarioManager.createUser(req.body)
        .then((usuario) => {
            res.status(201).send({ success: true, message: 'Usuário criado com sucesso', usuario });
        })
        .catch((error) => {
            res.status(400).send({ success: false, message: error.message });
        })

    }
}

module.exports = UsuarioController