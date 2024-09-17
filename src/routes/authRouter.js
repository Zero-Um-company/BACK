const express = require('express');
const authController = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post('', (req, res) => authController.login(req, res));
authRouter.get('/me', (req, res) => authController.get_me(req, res));

module.exports = authRouter;
