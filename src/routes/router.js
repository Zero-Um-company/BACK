const express = require("express");
const router = express.Router();

const supervisorRouter = require("./supervisorRouter");
const authRouter = require("./authRouter");
const produtoRouter = require("./produtoRouter");


router.use("/supervisor", supervisorRouter);
router.use("/auth", authRouter);
router.use("/produto", produtoRouter);

module.exports = router;
