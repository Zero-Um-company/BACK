const request = require('supertest');
const express = require('express');
const authController = require('../controllers/authController');
const authService = require('../services/authService'); 

const app = express();
app.use(express.json());
app.post('/auth', authController.login);

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
  });
});
