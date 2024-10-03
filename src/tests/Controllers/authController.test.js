const request = require('supertest');
const express = require('express');
const authController = require('../../controllers/authController');
const authService = require('../../services/authService');
const UsuarioService = require('../../services/usuarioService');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
app.use(express.json());
app.post('/auth', authController.login);
app.get('/me', authController.get_me);

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

describe('Auth Controller', () => {
  describe('login', () => {
    it('deve falhar ao realizar login com credenciais inválidas', async () => {

      const response = await request(app)
        .post('/auth')
        .send({ email: 'teste@erro.com', senha: '3456' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'E-mail não cadastrado');
    });

    it('deve realizar login com sucesso com credenciais válidas', async () => {
      const response = await request(app)
        .post('/auth')
        .send({ email: 'teste_sup@gmail.com', senha: '123456' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('get_me', () => {
    it('deve retornar as informações do usuário com sucesso', async () => {
      const response = await request(app)
        .get('/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('deve falhar ao buscar o usuário com token inválido', async () => {

      const response = await request(app)
        .get('/me')
        .set('Authorization', 'Bearer tokenInvalido123');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Erro ao recuperar usuário: Erro ao decodificar token: tokenInvalido123');
    });
  });
});