const express = require('express');
const jwtConfig = require('../config/JWTconfig');
const uploadController = require('../controllers/uploadController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const uploadRouter = express.Router();

uploadRouter.post("/upload", upload.single("filename"), jwtConfig.jwtMiddleware, (req, res) => uploadController.upload_file(req, res));

module.exports = uploadRouter;