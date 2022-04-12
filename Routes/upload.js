const { Router } = require("express");
const subjectController = require("../Controller/userController");
const router = Router();

router.post('/upload-docs', subjectController.fileUpload)

module.exports = router;