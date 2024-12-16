const express = require('express');
const formController = require('../controllers/formController');

const formRouter = express.Router();

formRouter.post('/criar', async (req, res) =>  await formController.criarForm(req, res));
formRouter.get('/:id', async (req, res) => await formController.getFormById(req, res));
formRouter.get('/', async (req, res) => await formController.listAllForms(req,res));
formRouter.put('/editar/:id', async (req, res) => await formController.editarForm(req, res));
formRouter.delete('/deletar/:id', async (req, res) => await formController.deletarForm(req, res));

module.exports = formRouter;