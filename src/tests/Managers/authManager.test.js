const authManager = require('../../managers/authManager');
const { Usuario } = require('../../models/Usuario');
const bcrypt = require('bcrypt');

jest.mock('../../models/Usuario');
jest.mock('bcrypt');

describe('authManager', () => {
    describe('verificaEmail', () => {
        it('deve retornar o usuário se o e-mail estiver cadastrado', async () => {
            const mockUser = { id: '1', email: 'teste@gmail.com' };
            Usuario.findOne.mockResolvedValueOnce(mockUser);

            const result = await authManager.verificaEmail('teste@gmail.com');
            expect(result).toEqual(mockUser);
        });

        it('deve falhar se o e-mail não estiver cadastrado', async () => {
            Usuario.findOne.mockResolvedValueOnce(null);

            await expect(authManager.verificaEmail('naoexiste@gmail.com')).rejects.toThrow('E-mail não cadastrado');
        });

        it('deve falhar se o e-mail não for fornecido', async () => {
            await expect(authManager.verificaEmail(null)).rejects.toThrow('E-mail é obrigatório');
        });
    });

    describe('verificaSenha', () => {
        it('deve retornar true se a senha estiver correta', async () => {
            const senha = '123456';
            const hash_senha = await bcrypt.hash(senha, 10);
            bcrypt.compare.mockResolvedValueOnce(true);

            const result = await authManager.verificaSenha(senha, hash_senha);
            expect(result).toBe(true);
        });

        it('deve falhar se a senha não for fornecida', async () => {
            await expect(authManager.verificaSenha(null, 'hash')).rejects.toThrow('Senha é obrigatória');
        });

        it('deve falhar se a senha estiver incorreta', async () => {
            const senha = '123456';
            const hash_senha = await bcrypt.hash(senha, 10);
            bcrypt.compare.mockResolvedValueOnce(false);

            await expect(authManager.verificaSenha(senha, hash_senha)).rejects.toThrow('Senha incorreta');
        });
    });
});
