const authManager = require('../managers/authManager');
const jwtConfig = require('../config/JWTconfig');

const authService = {
    get_token: async (email, senha) => {
        try {
            const user = await authManager.verificaEmail(email);
            
            await authManager.verificaSenha(senha, user.senha);
            
            const token = jwtConfig.generateToken(user);

            return token;

        } catch (error) {
            throw error;
        }
    }
};

module.exports = authService;
