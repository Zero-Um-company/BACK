const router = require('express').Router();

const usuarioRouter = require('./usuarioRouter');
const loginRouter = require('./loginRouter');

router.use('/usuario', usuarioRouter);
router.use('/login', loginRouter);


module.exports = router;