const express = require("express");
const router = express.Router();

const supervisorRouter = require("./supervisorRouter");
const authRouter = require("./authRouter");
const uploadRouter = require("./uploadRouter");

router.use("/supervisor", supervisorRouter);
router.use("/auth", authRouter);
router.use("/firebase", uploadRouter);

module.exports = router;
