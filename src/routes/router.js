const router = require('express').Router();

const usuarioRouter = require('./usuarioRouter');

router.use('/usuario', usuarioRouter);



module.exports = router;