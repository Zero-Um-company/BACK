const loginManager = require('../managers/LoginManager');
const bcrypt = require('bcrypt');

const loginService = {
    get_token: async (email, senha) => {
        try {
            const user = await loginManager.verificaEmail(email);
            
            await loginManager.verificaSenha(senha, user.senha);
            
            const salt = await bcrypt.genSalt(10);
            const token = await bcrypt.hash(user.email, salt);

            return token;

        } catch (error) {
            throw error;
        }
    }
};

module.exports = loginService;
