const authManager = require('../../managers/authManager');
const { Usuario } = require('../../models/Usuario');
const bcrypt = require('bcrypt');
const UsuarioService = require('../../services/usuarioService');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const authService = require('../../services/authService');

let mongoServer;
let token;

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

describe('authManager', () => {
    describe('verificaEmail', () => {
        it('deve retornar o usuário se o e-mail estiver cadastrado', async () => {
            const email = 'teste_sup@gmail.com';
            expect(await authManager.verificaEmail(email)).toBeInstanceOf(Usuario);
        });

        it('deve falhar se o e-mail não estiver cadastrado', async () => {
            await expect(authManager.verificaEmail('naoexiste@gmail.com')).rejects.toThrow('E-mail não cadastrado');
        });

        it('deve falhar se o e-mail não for fornecido', async () => {
            await expect(authManager.verificaEmail(null)).rejects.toThrow('E-mail é obrigatório');
        });
    });

    describe('verificaSenha', () => {
        it('deve retornar true se a senha estiver correta', async () => {
            const senha = '123456';
            const hash_senha = await bcrypt.hash(senha, 10);

            const result = await authManager.verificaSenha(senha, hash_senha);
            expect(result).toBe(true);
        });

        it('deve falhar se a senha não for fornecida', async () => {
            await expect(authManager.verificaSenha(null, 'hash')).rejects.toThrow('Senha é obrigatória');
        });

        it('deve falhar se a senha estiver incorreta', async () => {
            const senha = '123456';
            const hash_senha = 'asdsd';

            await expect(authManager.verificaSenha(senha, hash_senha)).rejects.toThrow('Senha incorreta');
        });
    });
});
