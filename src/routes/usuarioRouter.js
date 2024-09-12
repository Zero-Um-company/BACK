const express = require('express');
const router = express.Router();
const jwtConfig = require('../config/jwtConfig'); 
const usuarioController = require('../controllers/UsuarioController');

const usuarioRouter = express.Router();

usuarioRouter.post('/criar', jwtConfig.jwtMiddleware, (req, res) => usuarioController.criar_usuario(req, res));
usuarioRouter.get('/listar', jwtConfig.jwtMiddleware, (req, res) => usuarioController.listar_usuarios(req, res));
usuarioRouter.get('/me', jwtConfig.jwtMiddleware, (req, res) => usuarioController.get_me(req, res));

module.exports = usuarioRouter;
