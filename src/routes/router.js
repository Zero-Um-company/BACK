const express = require("express");
const router = express.Router();

const supervisorRouter = require("./supervisorRouter");
const authRouter = require("./authRouter");

router.use("/supervisor", supervisorRouter);
router.use("/auth", authRouter);

module.exports = router;
