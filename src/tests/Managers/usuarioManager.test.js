const UsuarioManager = require('../../managers/usuarioManager');
const authService = require('../../services/authService');
const UsuarioService = require('../../services/usuarioService');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let ADMINtoken;
let admin_user_test;
let SUPtoken;
let sup_user_test;
let delete_id;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  
    admin_user_test = {
      nome: "Test", 
      sobrenome: "Test", 
      email: "teste_admin@gmail.com", 
      telefone: "61999818046", 
      senha: "123456", 
      role: "admin", 
      supervisores: []
    };

    sup_user_test = {
        nome: "Test",
        sobrenome: "Test",
        email: "teste_sup@gmail.com",
        telefone: "61999818046",
        senha: "123456",
        role: "supervisor",
        supervisores: [],
    };
  
    const req = {
      headers: {
        authorization: `Bearer ${ process.env.TEST_TOKEN }`,
      },
      body: admin_user_test,
    };
    await UsuarioService.criarUsuario(req);

    ADMINtoken = await authService.get_token(admin_user_test.email, admin_user_test.senha);
    ADMINtoken = ADMINtoken.payload;

    const req2 = {
        headers: {
            authorization: `Bearer ${ process.env.TEST_TOKEN }`,
        },
        body: sup_user_test,
    };
    await UsuarioService.criarUsuario(req2);

    SUPtoken = await authService.get_token(sup_user_test.email, sup_user_test.senha);
    SUPtoken = SUPtoken.payload;
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

describe('UsuarioManager', () => {
    describe('createUser', () => {
        it('deve criar um usuário com sucesso', async () => {
            const user = { ...admin_user_test };
            user.email = 'testedelete@test.com';

            const result = await UsuarioManager.createUser(user);
            expect(result).toHaveProperty('email', user.email);
        });

        it('deve lançar um erro se a validação do usuário falhar', async () => {
            const invalidUser = { email: '', senha: '123456', nome: 'Teste', sobrenome: 'Sobrenome', telefone: '1234567890', role: 'COLABORADOR' };

            await expect(UsuarioManager.createUser(invalidUser)).rejects.toThrow('\"email\" is not allowed to be empty');
        });
    });

    describe('listUsers', () => {
        it('deve retornar uma lista de usuários', async () => {
            const result = await UsuarioManager.listUsers();
            delete_id = result[1]._id;
            expect(result).toBeDefined();
        });
    });

    describe('getUserBy', () => {
        it('deve retornar um usuário com base em um campo e valor', async () => {
            const result = await UsuarioManager.getUserBy('email', admin_user_test.email);
            expect(result).toHaveProperty('email', admin_user_test.email);
        });
    });

    describe('decodeToken', () => {
        it('deve lançar um erro se o token não for fornecido', () => {
            expect(() => UsuarioManager.decodeToken()).toThrow('Token não fornecido');
        });

        it('deve retornar o resultado da decodificação do token', () => {
            const result = UsuarioManager.decodeToken(`Bearer ${ADMINtoken}`);
            expect(result).toHaveProperty('email', admin_user_test.email);
        });
    });

    describe('updateHistory', () => {
        it('deve atualizar o histórico do usuário com sucesso', async () => {
            const req = { body: { email: 'teste_sup@gmail.com' }, headers: { authorization: `Bearer ${ADMINtoken}` } };

            const result = await UsuarioManager.updateHistory(req, 'Teste update historico');
            expect(result).toHaveProperty('historico');
        });

        it('deve lançar um erro se a validação do histórico falhar', async () => {
            const req = { body: { email: 'teste@gmail.com' }, headers: { authorization: 'Bearer token' } };
            const user = { id: '1' };

            await expect(UsuarioManager.updateHistory(req, 'Criação de usuário')).rejects.toThrow('Erro ao decodificar token: token');
        });
    });

    describe('updateUser', () => {
        it('deve atualizar um usuário com sucesso', async () => {
            const updateUser = admin_user_test;
            updateUser.nome = 'newName';
            delete updateUser.senha;

            const result = await UsuarioManager.updateUser(updateUser);
            expect(result).toHaveProperty('nome', 'newName');
        });

        it('deve lançar um erro se o usuário não for encontrado', async () => {
            const failUser = admin_user_test;
            failUser.email = 'noemail@asssda.com';

            await expect(UsuarioManager.updateUser(failUser)).rejects.toThrow('Usuário não encontrado');
        });

        it('deve lançar um erro se a validação do usuário falhar', async () => {
            const invalidUser = { email: '', senha: 'novaSenha' };

            await expect(UsuarioManager.updateUser(invalidUser)).rejects.toThrow('Email não fornecido');
        });
    });

    describe('deleteUser', () => {
        it('deve deletar um usuário com sucesso', async () => {
            const result = await UsuarioManager.deleteUser(delete_id);
            expect(result).toHaveProperty('_id', delete_id);
        });

        it('deve lançar um erro se o usuário não for encontrado', async () => {

            await expect(UsuarioManager.deleteUser('1')).rejects.toThrow('Cast to ObjectId failed for value \"1\" (type string) at path \"_id\" for model \"Usuario\"');
        });
    });

    describe('verifyCreateRole', () => {
        it('deve permitir a criação de usuário se o usuário tiver a permissão adequada', async () => {
            const req = {
                body: { role: 'admin' },
                headers: { authorization: `Bearer ${ADMINtoken}` }
            };

            await expect(UsuarioManager.verifyCreateRole(req)).resolves.toBeUndefined();
        });

        it('deve lançar um erro se o usuário não tiver a permissão adequada', async () => {
            const req = {
                body: { role: 'admin' },
                headers: { authorization: `Bearer ${SUPtoken}` }
            };

            await expect(UsuarioManager.verifyCreateRole(req)).rejects.toThrow('Acesso negado');
        });

        it('deve lançar um erro se o usuário não for admin e tentar criar um usuário com o papel de supervisor', async () => {
            const req = {
                body: { role: 'supervisor' },
                headers: { authorization: `Bearer ${SUPtoken}` }
            };
    
            await expect(UsuarioManager.verifyCreateRole(req)).rejects.toThrow('Acesso negado');
        });
    });

    describe('sendEmail', () => {
        it('deve lançar um erro se o envio do email falhar', async () => {
            const user = { email: 'teste@emailinvalido.com', nome: 'Teste', senha: '123456' };
    
            await expect(UsuarioManager.sendEmail({ body: user }))
                .rejects
                .toThrow('Emailconfig.sendMail is not a function');
        });
    });
});
