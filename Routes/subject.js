const { Router } = require("express");
const subjectController = require("../Controller/subjectController");
const router = Router();

//Add a subject
router.post('/addSubject', subjectController.addSubject);

//Delete a subject
router.delete('/deleteSubject/:id', subjectController.deleteSubject);

// Updates a subject 
router.put('/updateSubject/:id', subjectController.updateSubject);

// Gets all the subjects
router.get('/getAllSubjects', subjectController.getAllSubjects);

//Gets One subject
router.get('/getOneSubject/:id', subjectController.getOneSubject)

module.exports = router;
