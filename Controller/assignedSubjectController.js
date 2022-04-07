const { response } = require('express');
const pool = require('../db_config/config') //represents pool pg object required from connection file (is a stream of clients)


module.exports.addSubject = (req, res) => {

    let subject = {
        user_id: req.body.user_id, //This is from the front-end
        subject_id: req.body.subject_id, 
    };
    console.log(subject); //To see if the data is received 

    let query = {text: `INSERT INTO assigned_subject (user_id, subject_id) 
    VALUES ($1, $2) RETURNING id`,
    value: [subject.user_id, subject.subject_id]}

    pool.query(query.text, query.value)
    .then(data => {
        //Adding a subject 
        return res.status(201).json(data.rows);
    })
    .catch(err => console.log(err))
}

module.exports.removeSubject = (req, res) => {
    
    let query = {
        text: `DELETE FROM assigned_subject WHERE id = $1`,
        value: [req.params.id]
    }

    pool.query(query.text, query.value)
        .then(data => {
            if(data.rowCount) {
                return res.status(201).json(`Successfully deleted subject with id: ${req.params.id}`)
            }
        })
        .catch(err => {
            console.log(err)
        });
}

module.exports.viewMySubjects = (req, res) => {
    console.log('Id: ' +req.params.id)
    let query = {
        text: `
        SELECT subject.name, subject.description, assigned_subject.subject_id, assigned_subject.user_id
        FROM subject
        INNER JOIN assigned_subject
        ON subject.id = assigned_subject.subject_id
        WHERE assigned_subject.user_id = $1;`,
        value: [req.params.id]
    }

    pool.query(query.text, query.value)
    .then(data => {
        //Getting all 
        console.log(data.rows)
        return res.status(201).json(data.rows);
    })
    .catch(err => console.log(err))
}