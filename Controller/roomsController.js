const { response } = require('express');
const pool = require('../db_config/config') //represents pool pg object required from connection file (is a stream of clients)

module.exports.getRooms = (req, res) => {

    let object = {
        user_id: req.body.user_id,
        learner_id : req.body.learner_id,
        usertype: req.body.usertype,
        teacher_id: req.body.id
    }

    console.log(subject_id)

    let query = {
        text: `SELECT * FROM chat_room
        WHERE ${object.usertype}_id= $1;`,
        value: [object.user_id]
    }

    let query_1 = {
        text: `SELECT id, full_names, cellno FROM users
        WHERE ${object.usertype}_id= $1;`,
        // value: [object.teacher_id,object.learner_id]
    }
    pool.query(query_1.text, query_1.value)
    .then(data => {
        //Getting all 
        const rooms = data.rows;
        console.log(rooms);

        pool.query(query.text, query.value).then(user =>{
            const object = user;
            let id 
            return res.status(201).json(data.rows);
        }).catch(err => console.log(err))
        
    })
    .catch(err => console.log(err))
}