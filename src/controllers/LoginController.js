const loginService = require('../services/LoginService');

const LoginController = {
    login: async (req, res) => {
        try {
            const { email, senha } = req.body;
            const token = await loginService.get_token(email, senha);
            res.status(200).json({ token });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
};

module.exports = LoginController;
