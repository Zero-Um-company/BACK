const authService = require('../../services/authService');
const authManager = require('../../managers/authManager');
const jwtConfig = require('../../config/JWTconfig');

jest.mock('../../managers/authManager');
jest.mock('../../config/JWTconfig');

describe('Auth Service', () => {
    describe('get_token', () => {
        it('deve retornar um token quando as credenciais forem válidas', async () => {
            const mockUser = { email: 'teste@gmail.com', senha: 'hashedPassword' };
            const mockToken = 'mockToken123';

            authManager.verificaEmail.mockResolvedValue(mockUser);
            authManager.verificaSenha.mockResolvedValue(true);
            jwtConfig.generateToken.mockReturnValue(mockToken);

            const token = await authService.get_token(mockUser.email, 'senha');

            expect(token).toBe(mockToken);
            expect(authManager.verificaEmail).toHaveBeenCalledWith(mockUser.email);
            expect(authManager.verificaSenha).toHaveBeenCalledWith('senha', mockUser.senha);
            expect(jwtConfig.generateToken).toHaveBeenCalledWith(mockUser);
        });

        it('deve lançar um erro quando o email não for encontrado', async () => {
            authManager.verificaEmail.mockRejectedValue(new Error('Email não encontrado'));

            await expect(authService.get_token('inexistente@gmail.com', 'senha')).rejects.toThrow('Email não encontrado');
            expect(authManager.verificaEmail).toHaveBeenCalledWith('inexistente@gmail.com');
        });

        it('deve lançar um erro quando a senha for inválida', async () => {
            const mockUser = { email: 'teste@gmail.com', senha: 'hashedPassword' };
            authManager.verificaEmail.mockResolvedValue(mockUser);
            authManager.verificaSenha.mockRejectedValue(new Error('Senha inválida'));

            await expect(authService.get_token(mockUser.email, 'senhaErrada')).rejects.toThrow('Senha inválida');
            expect(authManager.verificaEmail).toHaveBeenCalledWith(mockUser.email);
            expect(authManager.verificaSenha).toHaveBeenCalledWith('senhaErrada', mockUser.senha);
        });
    });
});
