const { response } = require('express');
const pool = require('../db_config/config') //represents pool pg object required from connection file (is a stream of clients)


//DM Chats with 1 teacher
module.exports.sendMessage = (req, res) => {

    let message = {
        session_id: req.body.session_id, //This is from the front-end
        message: req.body.message,
        usertype: req.body.usertype,
    };

    console.log(message); //To see if the data is received 

    let query = {
        text: `INSERT INTO chats (session_id, messages, usertype) VALUES ($1, $2, $3) RETURNING *`,
        value: [message.session_id, message.message, message.usertype]
    }

    pool.query(query.text, query.value)
    .then(data => {
      console.log(data);
      return res.status(201).json(data.rows);
    }).catch(err => {
        console.log(err);
        return res.status(400).json(err);
    });
}

//DM Chats with 1 teacher
module.exports.recieveMessage = (req, res) => {

    console.log(req.params.id); //Check id

    let query = {
        text: `SELECT * FROM chats WHERE session_id = $1 ORDER BY id ASC`,
        value: [req.params.id]
    }

    pool.query(query.text, query.value)
    .then(data => {
      console.log(data)
      return res.status(201).json(data.rows);

    }).catch(err => {
        console.log(err);
        return res.status(400).json(err);
    });
}