const request = require('supertest');
const express = require('express');
const authController = require('../../controllers/authController');
const authService = require('../../services/authService');
const UsuarioService = require('../../services/usuarioService');

const app = express();
app.use(express.json());
app.post('/auth', authController.login);
app.get('/me', authController.get_me);

describe('Auth Controller', () => {
  describe('login', () => {
    it('deve falhar ao realizar login com credenciais inválidas', async () => {
      jest.spyOn(authService, 'get_token').mockRejectedValue(new Error('Credenciais inválidas'));

      const response = await request(app)
        .post('/auth')
        .send({ email: 'teste@erro.com', senha: '3456' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Credenciais inválidas');
    });

    it('deve realizar login com sucesso com credenciais válidas', async () => {
      const mockToken = 'tokenValido123';
      jest.spyOn(authService, 'get_token').mockResolvedValue(mockToken);

      const response = await request(app)
        .post('/auth')
        .send({ email: 'teste@valido.com', senha: '12345' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', mockToken);
    });
  });

  describe('get_me', () => {
    it('deve retornar as informações do usuário com sucesso', async () => {
      const mockUser = { id: '123', email: 'teste@valido.com' };
      jest.spyOn(UsuarioService, 'getUserByToken').mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/me')
        .set('Authorization', 'Bearer tokenValido123');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('usuario', mockUser);
    });

    it('deve falhar ao buscar o usuário com token inválido', async () => {
      jest.spyOn(UsuarioService, 'getUserByToken').mockRejectedValue(new Error('Token inválido'));

      const response = await request(app)
        .get('/me')
        .set('Authorization', 'Bearer tokenInvalido123');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Token inválido');
    });
  });
});