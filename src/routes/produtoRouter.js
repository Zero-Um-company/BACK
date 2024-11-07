const express = require('express');
const jwtConfig = require('../config/JWTconfig');
const ProdutoController = require('../controllers/produtoController');

const produtoRouter = express.Router();

produtoRouter.post('/criar', jwtConfig.jwtMiddleware, async (req,res) => await ProdutoController.criar_produto(req,res));
produtoRouter.delete('/deletar/:id', jwtConfig.jwtSupervisorMiddleware, async (req,res) => await ProdutoController.deletar_produto(req,res));
produtoRouter.put('/atualizar/:id', jwtConfig.jwtMiddleware, async (req,res) => await ProdutoController.atualizar_produto(req,res));
produtoRouter.put('/responsaveis/editar/:id', jwtConfig.jwtSupervisorMiddleware, async (req,res) => await ProdutoController.editar_responsaveis(req,res));
produtoRouter.get('/buscar', jwtConfig.jwtMiddleware , async (req,res) => await ProdutoController.buscar_produtos(req,res));
produtoRouter.patch('/switch/:id', jwtConfig.jwtMiddleware, async (req,res) => await ProdutoController.altera_status(req,res));  

module.exports = produtoRouter;