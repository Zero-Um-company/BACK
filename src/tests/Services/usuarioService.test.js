const UsuarioService = require('../../services/usuarioService');
const UsuarioManager = require('../../managers/usuarioManager');

jest.mock('../../managers/usuarioManager');

describe('UsuarioService', () => {
    describe('criarUsuario', () => {
        it('deve criar um usuário com sucesso', async () => {
            const req = {
                body: {
                    email: 'teste@gmail.com',
                    senha: '123456',
                    nome: 'Teste',
                    sobrenome: 'Testes',
                    telefone: '61999818046',
                    role: 'supervisor',
                    supervisores: [],
                },
                headers: {
                    authorization: 'Bearer token',
                },
            };

            UsuarioManager.verifyCreateRole.mockResolvedValueOnce();
            UsuarioManager.createUser.mockResolvedValueOnce(req.body);
            UsuarioManager.updateHistory.mockResolvedValueOnce(req.body);

            const result = await UsuarioService.criarUsuario(req);
            expect(result).toEqual(req.body);
        });

        it('deve falhar ao criar um usuário quando verificar papel falha', async () => {
            const req = {
                body: {
                    email: 'teste@gmail.com',
                    senha: '123456',
                },
                headers: {
                    authorization: 'Bearer token',
                },
            };

            UsuarioManager.verifyCreateRole.mockRejectedValueOnce(new Error('Acesso negado'));

            await expect(UsuarioService.criarUsuario(req)).rejects.toThrow('Erro ao criar usuário: Acesso negado');
        });
    });

    describe('listarUsuarios', () => {
        it('deve listar usuários com sucesso', async () => {
            const users = [{ id: '1', email: 'teste@gmail.com' }];
            UsuarioManager.listUsers.mockResolvedValueOnce(users);

            const result = await UsuarioService.listarUsuarios();
            expect(result).toEqual(users);
        });

        it('deve falhar ao listar usuários quando falha', async () => {
            UsuarioManager.listUsers.mockRejectedValueOnce(new Error('Erro ao listar usuários'));

            await expect(UsuarioService.listarUsuarios()).rejects.toThrow('Erro ao listar usuários: Erro ao listar usuários');
        });
    });

    describe('getUserByToken', () => {
        it('deve retornar um usuário com base no token', async () => {
            const token = 'token';
            const user = { email: 'teste@gmail.com' };
            const foundUser = { id: '1', email: 'teste@gmail.com' };

            UsuarioManager.decodeToken.mockReturnValueOnce(user);
            UsuarioManager.getUserBy.mockResolvedValueOnce(foundUser);

            const result = await UsuarioService.getUserByToken(token);
            expect(result).toEqual(foundUser);
        });

        it('deve falhar ao recuperar usuário com base no token quando falha', async () => {
            const token = 'token';
            UsuarioManager.decodeToken.mockImplementationOnce(() => {
                throw new Error('Token inválido');
            });

            await expect(UsuarioService.getUserByToken(token)).rejects.toThrow('Erro ao recuperar usuário: Token inválido');
        });
    });

    describe('editarUsuario', () => {
        it('deve editar um usuário com sucesso', async () => {
            const req = {
                body: {
                    email: 'teste@gmail.com',
                    nome: 'Novo Nome',
                },
                headers: {
                    authorization: 'Bearer token',
                },
            };

            UsuarioManager.updateUser.mockResolvedValueOnce(req.body);
            UsuarioManager.updateHistory.mockResolvedValueOnce(req.body);

            const result = await UsuarioService.editarUsuario(req);
            expect(result).toEqual(req.body);
        });

        it('deve falhar ao editar um usuário quando falha', async () => {
            const req = {
                body: {
                    email: 'teste@gmail.com',
                },
                headers: {
                    authorization: 'Bearer token',
                },
            };

            UsuarioManager.updateUser.mockRejectedValueOnce(new Error('Erro ao editar usuário'));

            await expect(UsuarioService.editarUsuario(req)).rejects.toThrow('Erro ao editar usuário: Erro ao editar usuário');
        });
    });

    describe('deletarUsuario', () => {
        it('deve deletar um usuário com sucesso', async () => {
            const req = {
                body: {
                    _id: '1',
                },
            };

            UsuarioManager.deleteUser.mockResolvedValueOnce(req.body);

            const result = await UsuarioService.deletarUsuario(req);
            expect(result).toEqual(req.body);
        });

        it('deve falhar ao deletar um usuário quando falha', async () => {
            const req = {
                body: {
                    _id: '1',
                },
            };

            UsuarioManager.deleteUser.mockRejectedValueOnce(new Error('Erro ao deletar usuário'));

            await expect(UsuarioService.deletarUsuario(req)).rejects.toThrow('Erro ao deletar usuário: Erro ao deletar usuário');
        });
    });
});
