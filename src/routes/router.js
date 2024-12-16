const express = require("express");
const router = express.Router();

const supervisorRouter = require("./supervisorRouter");
const authRouter = require("./authRouter");
const formRouter = require("./formRouter");

router.use("/supervisor", supervisorRouter);
router.use("/auth", authRouter);
router.use("/form", formRouter);

module.exports = router;
