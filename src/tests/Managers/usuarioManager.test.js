const UsuarioManager = require('../../managers/usuarioManager');
const { Usuario: UsuarioModel } = require('../../models/Usuario');
const bcrypt = require('bcrypt');
const jwtConfig = require('../../config/JWTconfig');
const UsuarioValidator = require('../../validators/users/UsuarioValidator');
const HistoricoValidator = require('../../validators/HistoricoValidator');
const Emailconfig = require('../../config/Emailconfig');

jest.mock('../../models/Usuario');
jest.mock('bcrypt');
jest.mock('../../config/JWTconfig');
jest.mock('../../validators/users/UsuarioValidator', () => ({
    validateAsync: jest.fn()
}));
jest.mock('../../validators/HistoricoValidator', () => ({
    validateAsync: jest.fn()
}));
jest.mock('../../config/Emailconfig', () => ({
    sendMail: jest.fn(),
}));

describe('UsuarioManager', () => {
    describe('createUser', () => {
        it('deve criar um usuário com sucesso', async () => {
            const user = { email: 'teste@gmail.com', senha: '123456', nome: 'Teste', sobrenome: 'Sobrenome', telefone: '1234567890', role: 'COLABORADOR' };
            UsuarioValidator.validateAsync.mockResolvedValueOnce(user);
            bcrypt.genSalt.mockResolvedValueOnce('salt');
            bcrypt.hash.mockResolvedValueOnce('hashedPassword');
            UsuarioModel.prototype.save.mockResolvedValueOnce(user);

            const result = await UsuarioManager.createUser(user);
            expect(result).toEqual(user);
        });

        it('deve lançar um erro se a validação do usuário falhar', async () => {
            const invalidUser = { email: '', senha: '123456', nome: 'Teste', sobrenome: 'Sobrenome', telefone: '1234567890', role: 'COLABORADOR' };
            UsuarioValidator.validateAsync.mockRejectedValueOnce(new Error('Email deve ser um endereço de email válido'));

            await expect(UsuarioManager.createUser(invalidUser)).rejects.toThrow('Email deve ser um endereço de email válido');
        });

        it('deve criptografar a senha do usuário', async () => {
            const user = { email: 'teste@gmail.com', senha: 'hashedPassword', nome: 'Teste', sobrenome: 'Sobrenome', telefone: '1234567890', role: 'COLABORADOR' };
            UsuarioValidator.validateAsync.mockResolvedValueOnce(user);
            bcrypt.genSalt.mockResolvedValueOnce('salt');
            bcrypt.hash.mockResolvedValueOnce('hashedPassword');
            UsuarioModel.prototype.save.mockResolvedValueOnce(user);

            await UsuarioManager.createUser(user);
            expect(bcrypt.hash).toHaveBeenCalledWith(user.senha, 'salt');
        });

        it('deve lançar um erro ao tentar criar um usuário se ocorrer um erro na validação ou no salvamento', async () => {
            const user = { email: 'teste@gmail.com', senha: '123456', nome: 'Teste', sobrenome: 'Sobrenome', telefone: '1234567890', role: 'COLABORADOR' };
    
            UsuarioValidator.validateAsync.mockResolvedValueOnce(user);
            bcrypt.genSalt.mockResolvedValueOnce('salt');
            bcrypt.hash.mockResolvedValueOnce('hashedPassword');
            UsuarioModel.prototype.save.mockRejectedValueOnce(new Error('Erro ao salvar no banco de dados'));
    
            await expect(UsuarioManager.createUser(user)).rejects.toThrow('Erro ao salvar no banco de dados');
        });
    });

    describe('listUsers', () => {
        it('deve listar todos os usuários', async () => {
            const mockUsers = [{ email: 'teste@gmail.com' }, { email: 'outro@gmail.com' }];
            UsuarioModel.find.mockResolvedValueOnce(mockUsers);

            const result = await UsuarioManager.listUsers();
            expect(result).toEqual(mockUsers);
        });
    });

    describe('getUserBy', () => {
        it('deve retornar um usuário com base em um campo e valor', async () => {
            const mockUser = { email: 'teste@gmail.com' };
            UsuarioModel.findOne.mockResolvedValueOnce(mockUser);

            const result = await UsuarioManager.getUserBy('email', 'teste@gmail.com');
            expect(result).toEqual(mockUser);
        });
    });

    describe('decodeToken', () => {
        it('deve lançar um erro se o token não for fornecido', () => {
            expect(() => UsuarioManager.decodeToken()).toThrow('Token não fornecido');
        });

        it('deve retornar o resultado da decodificação do token', () => {
            const mockDecoded = { email: 'teste@gmail.com' };
            jwtConfig.decodeToken.mockReturnValueOnce(mockDecoded);
            const result = UsuarioManager.decodeToken('Bearer token');
            expect(result).toEqual(mockDecoded);
        });
    });

    describe('updateHistory', () => {
        it('deve atualizar o histórico do usuário com sucesso', async () => {
            const req = { body: { email: 'teste@gmail.com' }, headers: { authorization: 'Bearer token' } };
            const user = { id: '1' };
            const history = { editor: user.id, action: 'Criação de usuário' };

            jwtConfig.decodeToken.mockReturnValueOnce(user);
            HistoricoValidator.validateAsync.mockResolvedValueOnce(history);
            UsuarioModel.findOneAndUpdate.mockResolvedValueOnce({});

            const result = await UsuarioManager.updateHistory(req, 'Criação de usuário');
            expect(result).toBeDefined();
        });

        it('deve lançar um erro se a validação do histórico falhar', async () => {
            const req = { body: { email: 'teste@gmail.com' }, headers: { authorization: 'Bearer token' } };
            const user = { id: '1' };

            jwtConfig.decodeToken.mockReturnValueOnce(user);
            HistoricoValidator.validateAsync.mockRejectedValueOnce(new Error('Erro de validação'));

            await expect(UsuarioManager.updateHistory(req, 'Criação de usuário')).rejects.toThrow('Erro de validação');
        });

        it('deve lançar um erro se a validação do histórico retornar um valor false', async () => {
            const req = { body: { email: 'teste@gmail.com' }, headers: { authorization: 'Bearer token' } };
            const user = { id: '1' };
    
            jwtConfig.decodeToken.mockReturnValueOnce(user);
            HistoricoValidator.validateAsync.mockResolvedValueOnce(null); // Simula retorno falsy
    
            await expect(UsuarioManager.updateHistory(req, 'Criação de usuário')).rejects.toThrow('Cannot read properties of null (reading \'error\')');
        });

        it('deve lançar um erro ao tentar atualizar o histórico se ocorrer um erro', async () => {
            const req = { body: { email: 'teste@gmail.com' }, headers: { authorization: 'Bearer token' } };
            const user = { id: '1' };
            const action = 'Criação de usuário';
    
            jwtConfig.decodeToken.mockReturnValueOnce(user);
            HistoricoValidator.validateAsync.mockRejectedValueOnce(new Error('Erro de validação'));
    
            await expect(UsuarioManager.updateHistory(req, action)).rejects.toThrow('Erro de validação');
        });       
        
    });

    describe('updateUser', () => {
        it('deve atualizar um usuário com sucesso', async () => {
            const user = { email: 'teste@gmail.com', senha: 'novaSenha' };
            const mockUser = { email: 'teste@gmail.com', senha: 'hashedPassword' };

            UsuarioValidator.validateAsync.mockResolvedValueOnce(user);
            UsuarioModel.findOne.mockResolvedValueOnce(mockUser);
            bcrypt.genSalt.mockResolvedValueOnce('salt');
            bcrypt.hash.mockResolvedValueOnce('hashedPassword');
            UsuarioModel.findOneAndUpdate.mockResolvedValueOnce(mockUser);

            const result = await UsuarioManager.updateUser(user);
            expect(result).toEqual(mockUser);
        });

        it('deve lançar um erro se o usuário não for encontrado', async () => {
            const user = { email: 'teste@gmail.com' };
            UsuarioValidator.validateAsync.mockResolvedValueOnce(user);
            UsuarioModel.findOne.mockResolvedValueOnce(null);

            await expect(UsuarioManager.updateUser(user)).rejects.toThrow('Usuário não encontrado');
        });

        it('deve lançar um erro se a validação do usuário falhar', async () => {
            const invalidUser = { email: '', senha: 'novaSenha' };
            UsuarioValidator.validateAsync.mockRejectedValueOnce(new Error('Email não fornecido'));

            await expect(UsuarioManager.updateUser(invalidUser)).rejects.toThrow('Email não fornecido');
        });         
    
        it('deve lançar um erro ao atualizar o usuário se ocorrer um erro', async () => {
            const user = { email: 'teste@gmail.com', senha: 'novaSenha' };
    
            UsuarioValidator.validateAsync.mockResolvedValueOnce(user);
            UsuarioModel.findOne.mockResolvedValueOnce(null);
    
            await expect(UsuarioManager.updateUser(user)).rejects.toThrow('Email não fornecido');
        });

    });

    describe('deleteUser', () => {
        it('deve deletar um usuário com sucesso', async () => {
            const mockUser = { _id: '1', email: 'teste@gmail.com' };
            UsuarioModel.findOneAndDelete.mockResolvedValueOnce(mockUser);

            const result = await UsuarioManager.deleteUser('1');
            expect(result).toEqual(mockUser);
        });

        it('deve lançar um erro se o usuário não for encontrado', async () => {
            UsuarioModel.findOneAndDelete.mockResolvedValueOnce(null);

            await expect(UsuarioManager.deleteUser('1')).rejects.toThrow('Usuário não encontrado');
        });
    });

    describe('verifyCreateRole', () => {
        it('deve permitir a criação de usuário se o usuário tiver a permissão adequada', async () => {
            const req = {
                body: { role: 'admin' },
                headers: { authorization: 'Bearer token' }
            };
            jwtConfig.decodeToken.mockReturnValueOnce({ role: 'admin' });

            await expect(UsuarioManager.verifyCreateRole(req)).resolves.toBeUndefined();
        });

        it('deve lançar um erro se o usuário não tiver a permissão adequada', async () => {
            const req = {
                body: { role: 'admin' },
                headers: { authorization: 'Bearer token' }
            };
            jwtConfig.decodeToken.mockReturnValueOnce({ role: 'user' });

            await expect(UsuarioManager.verifyCreateRole(req)).rejects.toThrow('Acesso negado');
        });

        it('deve lançar um erro se o usuário não for admin e tentar criar um usuário com o papel de supervisor', async () => {
            const req = {
                body: { role: 'supervisor' },
                headers: { authorization: 'Bearer token' }
            };
            const user = { role: 'user' }; 
    
            jwtConfig.decodeToken.mockReturnValueOnce(user);
    
            await expect(UsuarioManager.verifyCreateRole(req)).rejects.toThrow('Acesso negado');
        });
    });

    describe('sendEmail', () => {
        it('deve enviar um email corretamente', async () => {
            const user = { email: 'teste@gmail.com', nome: 'Teste', senha: '123456' };
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Cadastro de usuário',
                text: `Olá ${user.nome}, seu cadastro foi realizado com sucesso!\n` +
                    `Seu login é: ${user.email}\n` +
                    `Sua senha é: ${user.senha}`
            };

            Emailconfig.sendMail.mockResolvedValueOnce('Email enviado com sucesso');

            await UsuarioManager.sendEmail({ body: user });
            expect(Emailconfig.sendMail).toHaveBeenCalledWith(mailOptions);
        });

        it('deve lançar um erro se o envio do email falhar', async () => {
            const user = { email: 'teste@gmail.com', nome: 'Teste', senha: '123456' };
            Emailconfig.sendMail.mockRejectedValueOnce(new Error('Erro ao enviar email'));

            await expect(UsuarioManager.sendEmail({ body: user })).rejects.toThrow('Erro ao enviar email');
        });
    });
});
