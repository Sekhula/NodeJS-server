const { response } = require('express');
const pool = require('../db_config/config') //represents pool pg object required from connection file (is a stream of clients)

//This is a module for a learner to assing a subject on their profile
module.exports.addSubject = (req, res) => {

    let subject = {
        user_id: req.body.user_id, //This is from the front-end
        subject_id: req.body.subject_id, 
    };

    let query = {text: `INSERT INTO assigned_subject (user_id, subject_id)
    VALUES ($1, $2) RETURNING id`,
    value: [subject.user_id, subject.subject_id]}

    let query_1 = {text: `SELECT subject_id, user_id FROM assigned_subject WHERE user_id = $1 AND subject_id = $2`,
    value: [subject.user_id, subject.subject_id]
    };

    pool.query(query_1.text, query_1.value)
    .then(data => {
        if(data.rowCount > 0){
            return res.status(201).json("Subject already added");
        }
        else{
            pool.query(query.text, query.value).then(data =>{
                //Adding a subject 
                return res.status(201).json("Subject added successfully");
            }).catch(err => {
                return res.status(400).json("Couldn't add subject")
            })
        }
        
        
    })
    .catch(err => {
        
        return res.status(400).json("Couldn't add subject")
    })
}

//Learner Removing Subject from their assigned Subjects
module.exports.removeSubject = (req, res) => {
    let id = req.params.id;
    id = id.substring(1);
    let query = {
        text: `DELETE FROM assigned_subject WHERE id = $1`,
        value: [id]
    }

    pool.query(query.text, query.value)
        .then(data => {
            if(data.rowCount) {
                return res.status(201).json(`Successfully deleted subject with id: ${id}`)
            }
        })
        .catch(err => {
            return res.status(400).json("Couldn't delete subject")
        });
}
//Function for the learner when he/she has assigned Subject(s) and
//the subjects will be extracted from the the profile and be listed statically
module.exports.viewMySubjects = (req, res) => {
    let id = req.params.id;
    id = id.substring(1);
    let query = {
        text: `
        SELECT assigned_subject.id, subject.name, subject.description, assigned_subject.subject_id, assigned_subject.user_id
        FROM subject
        INNER JOIN assigned_subject
        ON subject.id = assigned_subject.subject_id
        WHERE assigned_subject.user_id = $1;`,
        value: [id]
    }
    pool.query(query.text, query.value)
    .then(data => {
        //Getting all 
        return res.status(201).json(data.rows);
    })
    .catch(err => {
        
        return res.status(400).json("Couldn't retrieve subjects")
    })
}

//Gets Teachers for a specific subject
module.exports.getTeachers = (req, res) => {
    
    let subject_id = req.params.id;
    subject_id = subject_id.substring(1);
    let query = {
        text: `
        SELECT assigned_subject.id, assigned_subject.subject_id, assigned_subject.user_id, assigned_subject.created_at, users.full_name
        FROM assigned_subject
        INNER JOIN users
        ON users.id = assigned_subject.user_id
        WHERE users.usertype = 'teacher'
        AND assigned_subject.subject_id = $1;`,
        value: [subject_id]
    }
    pool.query(query.text, query.value)
    .then(data => {
        //Getting all 
        return res.status(201).json(data.rows);
    })
    .catch(err => {
        
        return res.status(400).json("Couldn't retrieve teachers")
    })
}