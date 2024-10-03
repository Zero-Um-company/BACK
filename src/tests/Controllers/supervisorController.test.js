require('dotenv').config();
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const supervisorController = require('../../controllers/supervisorController');
const { jwtSupervisorMiddleware } = require('../../config/JWTconfig');
const UsuarioService = require('../../services/usuarioService');
const authService = require('../../services/authService');
const Math = require('mathjs');

const app = express();
app.use(express.json());
app.use(jwtSupervisorMiddleware);
app.post('/supervisor/criar', supervisorController.criar_usuario);
app.get('/supervisor/listar', supervisorController.listar_usuarios);
app.put('/supervisor/editar/:id', supervisorController.editar_usuario);
app.delete('/supervisor/deletar/:id', supervisorController.deletar_usuario);

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
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Supervisor Controller', () => {
  describe('criar_usuario', () => {
    it('deve falhar ao criar um usuário sem um token', async () => {
      const response = await request(app)
        .post('/supervisor/criar')
        .send({ 
          body: { 
            email: 'teste create', 
            senha: '123456', 
            nome: 'Teste', 
            sobrenome: 'Sobrenome', 
            telefone: '1234567890', 
            role: 'COLABORADOR' }, 
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token não fornecido');
    });

    it('deve falhar ao criar um usuário com dados inválidos', async () => {
      const invalidUser = { 
        email: '', 
        senha: '123456', 
        nome: 'Teste', 
        sobrenome: 'Sobrenome', 
        telefone: '1234567890', 
        role: 'COLABORADOR' 
      };

      const response = await request(app)
        .post('/supervisor/criar')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Erro ao criar usuário: \"email\" is not allowed to be empty');
    });

    it('deve criar um usuário com sucesso', async () => {
      const i = Math.floor(Math.random() * 1000);
      const user = {
        nome: "Test", 
        sobrenome: "Test", 
        email: `teste_jest${i}@gmail.com`, 
        telefone: "61999818046", 
        senha: "123456", 
        role: "supervisor", 
        supervisores: []
      };

      const response = await request(app)
        .post('/supervisor/criar')
        .set('Authorization', `Bearer ${token}`)
        .send(user);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Usuário criado com sucesso');
      expect(response.body).toHaveProperty('usuario');
    });
  });

  describe('listar_usuarios', () => {
    it('deve falhar ao listar usuários sem um token', async () => {
      const response = await request(app)
        .get('/supervisor/listar');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token não fornecido');
    });

    it('deve listar os usuários com sucesso', async () => {

      const response = await request(app)
        .get('/supervisor/listar')
        .set('Authorization', `Bearer ${token}`);

      delete_id = response.body.usuarios[1]._id;

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('usuarios');
      expect(response.body.usuarios.length).toBeGreaterThan(0);
    });

    it('deve falhar ao listar usuários quando o serviço falha', async () => {
      jest.spyOn(UsuarioService, 'listarUsuarios').mockImplementationOnce(() => {
        throw new Error('Erro ao listar usuários: Usuários não encontrados');
      });
      const response = await request(app)
        .get('/supervisor/listar')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Erro ao listar usuários: Usuários não encontrados');
    });
  });

  describe('editar_usuario', () => {
    it('deve falhar ao editar um usuário sem um token', async () => {
      const response = await request(app)
        .put('/supervisor/editar/1')
        .send({ email: 'novoemail@gmail.com' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token não fornecido');
    });

    it('deve editar um usuário com sucesso', async () => {
      const response = await request(app)
        .put('/supervisor/editar/1')
        .set('Authorization', `Bearer ${token}`)
        .send( body = {
          nome: "TESTE integração EDIT",
          sobrenome: "Rotas de supervisor",
          email: "teste_sup@gmail.com",
          telefone: "61948484848",
          role: "supervisor",
          senha: "senhateste1",
          user_image: "https://example.com/imagens/perfil/teste.jpg"
        }
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('usuario');
    });

    it('deve falhar ao editar um usuário com dados inválidos', async () => {
      const response = await request(app)
        .put('/supervisor/editar/1')
        .set('Authorization', `Bearer ${token}`)
        .send({email: ''});

      expect(response.status).toBe(400); 
      expect(response.body).toHaveProperty('message', 'Erro ao editar usuário: Email não fornecido');
    });
  });

  describe('deletar_usuario', () => {
    it('deve falhar ao deletar um usuário sem um token', async () => {
      const response = await request(app)
        .delete('/supervisor/deletar/1');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token não fornecido');
    });

    it('deve deletar um usuário com sucesso', async () => {
      const response = await request(app)
        .delete(`/supervisor/deletar/1`)
        .set('Authorization', `Bearer ${token}`)
        .send({ _id: delete_id });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('usuario');
    });

    it('deve falhar ao deletar um usuário com ID inválido', async () => {
      const response = await request(app)
        .delete('/supervisor/deletar/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Erro ao deletar usuário: Usuário não encontrado');
    });
  });
});
