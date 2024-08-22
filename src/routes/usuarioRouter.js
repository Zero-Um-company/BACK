const router = require('express').Router();
const UsuarioController = require('../controllers/UsuarioController');

router.route('/criar')
    .post((req, res) => UsuarioController.criar_usuario(req, res));

module.exports = router;