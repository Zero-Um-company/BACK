const loginManager = require('../managers/LoginManager');
const jwtConfig = require('../config/jwtConfig');

const loginService = {
    get_token: async (email, senha) => {
        try {
            const user = await loginManager.verificaEmail(email);
            
            await loginManager.verificaSenha(senha, user.senha);
            
            const token = jwtConfig.generateToken(user);

            return token;

        } catch (error) {
            throw error;
        }
    }
};

module.exports = loginService;
