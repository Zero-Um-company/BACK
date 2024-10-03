const authService = require('../../services/authService');
const authManager = require('../../managers/authManager');
const jwtConfig = require('../../config/JWTconfig');
const UsuarioService = require('../../services/usuarioService');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { response } = require('express');

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
      supervisores: []
    };
  
    const req = {
      headers: {
        authorization: `Bearer ${ process.env.TEST_TOKEN }`,
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
  

describe('Auth Service', () => {
    describe('get_token', () => {
        it('deve retornar um token quando as credenciais forem válidas', async () => {
            const user_test = {
                email: 'teste_sup@gmail.com',
                senha: '123456',
            };
            const response = await authService.get_token(user_test.email, user_test.senha);
            expect(response).toHaveProperty('payload');
        });

        it('deve lançar um erro quando o email não for encontrado', async () => {
            const user_test = {
                email: 'inexisted@gmail.com',
                senha: '123456',
            };
            await expect(authService.get_token(user_test.email, user_test.senha)).rejects.toThrow('E-mail não cadastrado');
        });

        it('deve lançar um erro quando a senha for inválida', async () => {
            const user_test = {
                email: 'teste_sup@gmail.com',
                senha: '123455556',
            };
            await expect(authService.get_token(user_test.email, user_test.senha)).rejects.toThrow('Senha incorreta');
        });
    });
});
