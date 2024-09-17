const express = require('express');
const jwtConfig = require('../config/JWTconfig'); 
const supervisorController = require('../controllers/supervisorController');

const supervisorRouter = express.Router();

supervisorRouter.post('/criar', jwtConfig.jwtSupervisorMiddleware, (req, res) => supervisorController.criar_usuario(req, res));
supervisorRouter.get('/listar', jwtConfig.jwtSupervisorMiddleware, (req, res) => supervisorController.listar_usuarios(req, res));

module.exports = supervisorRouter;
