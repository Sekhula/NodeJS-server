const { Router } = require("express");
const subjectController = require("../Controller/userController");
const router = Router();

router.post('/upload-docs', subjectController.uploadDocs)

module.exports = router;