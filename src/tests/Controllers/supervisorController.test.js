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

jest.mock('../../services/usuarioService');

let mongoServer;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const mockUser = {
    nome: "Test", 
    sobrenome: "Test", 
    email: "teste_jest@gmail.com", 
    telefone: "61999818046", 
    senha: "123456", 
    role: "supervisor", 
    supervisores: []
  };
  jest.spyOn(authService, 'get_token').mockImplementation(() => {
    return process.env.TEST_TOKEN;
  });

  UsuarioService.criarUsuario.mockResolvedValue(mockUser); 
  token = authService.get_token(mockUser.email, mockUser.senha);  
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
        .send({ email: 'teste@gmail.com', senha: '123456' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token não fornecido');
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
      }

      const response = await request(app)
        .post('/supervisor/criar')
        .set('Authorization', `Bearer ${token}`)
        .send(user);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Usuário criado com sucesso');
      expect(response.body).toHaveProperty('usuario');
    });

    it('deve falhar ao criar um usuário quando o serviço falha', async () => {
      UsuarioService.criarUsuario.mockRejectedValueOnce(new Error('Erro ao criar usuário'));

      const i = Math.floor(Math.random() * 1000);
      const user = {
        nome: "Test", 
        sobrenome: "Test", 
        email: `teste_jest${i}@gmail.com`, 
        telefone: "61999818046", 
        senha: "123456", 
        role: "supervisor", 
        supervisores: []
      }

      const response = await request(app)
        .post('/supervisor/criar')
        .set('Authorization', `Bearer ${token}`)
        .send(user);

      expect(response.status).toBe(400); 
      expect(response.body).toHaveProperty('message', 'Erro ao criar usuário');
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
      UsuarioService.listarUsuarios.mockResolvedValueOnce([{ id: '1', email: 'teste@gmail.com' }]);

      const response = await request(app)
        .get('/supervisor/listar')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('usuarios');
      expect(response.body.usuarios.length).toBeGreaterThan(0);
    });

    it('deve falhar ao listar usuários quando o serviço falha', async () => {
      UsuarioService.listarUsuarios.mockRejectedValueOnce(new Error('Erro ao listar usuários'));

      const response = await request(app)
        .get('/supervisor/listar')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400); 
      expect(response.body).toHaveProperty('message', 'Erro ao listar usuários');
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
      UsuarioService.editarUsuario.mockResolvedValueOnce({ id: '1', email: 'novoemail@gmail.com' });

      const response = await request(app)
        .put('/supervisor/editar/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'novoemail@gmail.com' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('usuario');
      expect(response.body.usuario.email).toBe('novoemail@gmail.com');
    });

    it('deve falhar ao editar um usuário quando o serviço falha', async () => {
      UsuarioService.editarUsuario.mockRejectedValueOnce(new Error('Erro ao editar usuário'));

      const response = await request(app)
        .put('/supervisor/editar/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'novoemail@gmail.com' });

      expect(response.status).toBe(400); 
      expect(response.body).toHaveProperty('message', 'Erro ao editar usuário');
    });

    it('deve falhar ao editar um usuário com dados inválidos', async () => {
      UsuarioService.editarUsuario.mockRejectedValueOnce(new Error('Email não fornecido'));
      
      const response = await request(app)
        .put('/supervisor/editar/1')
        .set('Authorization', `Bearer ${token}`)
        .send({email: ''});

      expect(response.status).toBe(400); 
      expect(response.body).toHaveProperty('message', 'Email não fornecido');
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
      UsuarioService.deletarUsuario.mockResolvedValueOnce({ id: '1', email: 'teste@gmail.com' });

      const response = await request(app)
        .delete('/supervisor/deletar/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('usuario');
    });

    it('deve falhar ao deletar um usuário quando o serviço falha', async () => {
      UsuarioService.deletarUsuario.mockRejectedValueOnce(new Error('Erro ao deletar usuário'));

      const response = await request(app)
        .delete('/supervisor/deletar/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400); 
      expect(response.body).toHaveProperty('message', 'Erro ao deletar usuário');
    });
  });
});
