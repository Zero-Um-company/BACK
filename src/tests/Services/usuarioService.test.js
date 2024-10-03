const UsuarioService = require('../../services/usuarioService');
const UsuarioManager = require('../../managers/usuarioManager');
const authService = require('../../services/authService');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let token;
let delete_id;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const user_test = {
    nome: "Test",
    sobrenome: "Test",
    email: "teste_sup@gmail.com",
    telefone: "61999818046",
    senha: "123456",
    role: "admin",
    supervisores: [],
  };

  const req = {
    headers: {
      authorization: `Bearer ${process.env.TEST_TOKEN}`,
    },
    body: user_test,
  };

  await UsuarioService.criarUsuario(req);
  token = await authService.get_token(user_test.email, user_test.senha);
  token = token.payload;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('UsuarioService', () => {
    describe('criarUsuario', () => {
        it('deve criar um usuário com sucesso', async () => {
            const req = {
                body: {
                    email: 'testeService@gmail.com',
                    senha: '123456',
                    nome: 'Teste',
                    sobrenome: 'Testes',
                    telefone: '61999818046',
                    role: 'supervisor',
                    supervisores: [],
                },
                headers: {
                    authorization: `Bearer ${token}`,
                },
            };

            const createdUser = await UsuarioService.criarUsuario(req);
            expect(createdUser).toHaveProperty('email', req.body.email);
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

            await expect(UsuarioService.criarUsuario(req)).rejects.toThrow('Erro ao criar usuário: Erro ao decodificar token: token');
        });
    });

    describe('listarUsuarios', () => {
        it('deve listar usuários com sucesso', async () => {

            const result = await UsuarioService.listarUsuarios();
            delete_id = result[1]._id;
            expect(result).toHaveProperty('length');
        });

        it('deve falhar ao listar usuários quando falha', async () => {
            jest.spyOn(UsuarioManager, 'listUsers').mockRejectedValueOnce(new Error('Erro ao listar usuários'));

            await expect(UsuarioService.listarUsuarios()).rejects.toThrow('Erro ao listar usuários: Erro ao listar usuários');
        });
    });

    describe('getUserByToken', () => {
        it('deve retornar um usuário com base no token', async () => {

            const result = await UsuarioService.getUserByToken(`Bearer ${token}`);
            expect(result).toHaveProperty('email');
        });

        it('deve falhar ao recuperar usuário com base no token quando falha', async () => {
            const tokenFail = 'token';

            await expect(UsuarioService.getUserByToken(tokenFail)).rejects.toThrow('Erro ao recuperar usuário: Erro ao decodificar token: Token não fornecido');
        });
    });

    describe('editarUsuario', () => {
        it('deve editar um usuário com sucesso', async () => {
            const req = {
                body: {
                    nome: "TESTE integração EDIT",
                    sobrenome: "Rotas de supervisor",
                    email: "teste_sup@gmail.com",
                    telefone: "61948484848",
                    role: "supervisor",
                    senha: "senhateste1",
                    user_image: "https://example.com/imagens/perfil/teste.jpg"
                },
                headers: {
                    authorization: `Bearer ${token}`,
                },
            };

            const result = await UsuarioService.editarUsuario(req);
            expect(result).toHaveProperty('email', req.body.email);
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
            jest.spyOn(UsuarioManager, 'updateUser').mockRejectedValueOnce(new Error('Erro ao editar usuário'));

            await expect(UsuarioService.editarUsuario(req)).rejects.toThrow('Erro ao editar usuário: Erro ao editar usuário');
        });
    });

    describe('deletarUsuario', () => {
        it('deve deletar um usuário com sucesso', async () => {
            const req = {
                body: {
                    _id: delete_id,
                },
            };

            const result = await UsuarioService.deletarUsuario(req);
            expect(result).toHaveProperty('_id', req.body._id);
        });

        it('deve falhar ao deletar um usuário quando falha', async () => {
            const req = {
                body: {
                    _id: '1',
                },
            };

            await expect(UsuarioService.deletarUsuario(req)).rejects.toThrow("Erro ao deletar usuário: Cast to ObjectId failed for value \"1\" (type string) at path \"_id\" for model \"Usuario\"");
        });
    });
});
