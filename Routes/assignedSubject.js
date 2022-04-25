const express = require('express');
const subjectCrud = require('../Controller/assignedSubjectController');
const router = express.Router();

router.get('/viewMySubjects/:id', subjectCrud.viewMySubjects);
router.delete('/removeSubject/:id', subjectCrud.removeSubject);
router.post('/addMySubject/', subjectCrud.addSubject);
router.get('/getTeachers/:id', subjectCrud.getTeachers);


module.exports = router;