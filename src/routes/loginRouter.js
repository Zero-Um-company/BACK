const express = require('express');
const router = express.Router();
const loginController = require('../controllers/LoginController');

const loginRouter = express.Router();

loginRouter.post('', (req, res) => loginController.login(req, res));

module.exports = loginRouter;
