const express = require('express');
const ProdutoController = require('../controllers/produtoController');

const produtoRouter = express.Router();

produtoRouter.post('/criar', async (req,res) => await ProdutoController.criar_produto(req,res));
produtoRouter.delete('/deletar/:id', async (req,res) => await ProdutoController.deletar_produto(req,res));
produtoRouter.put('/atualizar/:id', async (req,res) => await ProdutoController.atualizar_produto(req,res));
produtoRouter.put('/responsaveis/editar/:id', async (req,res) => await ProdutoController.editar_responsaveis(req,res));
produtoRouter.get('/buscar', async (req,res) => await ProdutoController.buscar_produtos(req,res));

module.exports = produtoRouter;