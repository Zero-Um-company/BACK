const router = require('express').Router();
const loginController = require('../controllers/LoginController');

router.route('/')
    .post((req, res) => loginController.login(req, res));

module.exports = router;