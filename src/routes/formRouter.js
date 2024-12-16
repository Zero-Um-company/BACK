const express = require('express');
const formController = require('../controllers/formController');
const jwtConfig = require('../config/JWTconfig');

const formRouter = express.Router();

formRouter.post('/criar', jwtConfig.jwtMiddleware,  async (req, res) =>  await formController.criarForm(req, res));
formRouter.get('/:id', jwtConfig.jwtMiddleware, async (req, res) => await formController.getFormById(req, res));
formRouter.get('/', jwtConfig.jwtMiddleware, async (req, res) => await formController.listAllForms(req,res));
formRouter.put('/editar/:id', jwtConfig.jwtMiddleware, async (req, res) => await formController.editarForm(req, res));
formRouter.delete('/deletar/:id', jwtConfig.jwtMiddleware, async (req, res) => await formController.deletarForm(req, res));

module.exports = formRouter;