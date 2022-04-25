const { response } = require('express');
const pool = require('../db_config/config') //represents pool pg object required from connection file (is a stream of clients)


//DM Chats with 1 teacher
module.exports.sendToSpecificUser = (req, res) => {

    let message = {
        sender_id: req.body.sender_id, //This is from the front-end
        reciever_id: req.body.reciever_id,
        subject_id: req.body.subject_id,
        message: req.body.message
    };
    console.log(message); //To see if the data is received 

    let query = {text: `INSERT INTO dms (sender_id, reciever_id, subject_id, message)
    VALUES ($1, $2, $3, $4) RETURNING *`,
    value: [message.sender_id, message.reciever_id, message.subject_id, message.message]}

    pool.query(query.text, query.value)
    .then(data => {
      console.log(data)
      return res.status(201).json(data.rows);
        
    }).catch(err => {
        console.log(err);
        return res.status(400).json(err);
    });
}

//Get messages of one user with another user
module.exports.getOneFromOne = (req, res) => {

    let message = {
        sender_id: req.body.sender_id, //This is from the front-end
        reciever_id: req.body.reciever_id
    };
    console.log(message); //To see if the data is received 

    let query = {text: `SELECT * FROM dms
                        WHERE (sender_id = $1
                        AND    reciever_id = $2)`,
    value: [message.sender_id, message.reciever_id]}

    pool.query(query.text, query.value)
    .then(data => {
      console.log(data)
      return res.status(201).json(data.rows);
        
    }).catch(err => {
        console.log(err);
        return res.status(400).json(err);
    });
}
//Creates topics of a specific group chat
module.exports.topic = (req, res) => {

    let topic = {
        sender_id: req.body.sender_id,
        topic: req.body.topic,      //This is from the front-end
        subject_id: req.body.subject_id
    };
    console.log(topic); //To see if the data is received 

    let query = {text: `INSERT INTO  topic (sender_id, subject_id, topic) VALUES ($1, $2, $3) RETURNING *`,
    value: [topic.sender_id, topic.subject_id, topic.topic]}

    pool.query(query.text, query.value)
    .then(data => {
      console.log(data.rows)
      return res.status(201).json(data.rows);
        
    }).catch(err => {
        console.log(err);
        return res.status(400).json(err);
    });
}

//Posts in to a specific group chat
module.exports.postToSpecificDiscussion = (req, res) => {

    let post = {
        sender_id: req.body.sender_id,
        topic_id: req.body.topic_id,      //This is from the front-end
        post: req.body.post
    };
    console.log(post); //To see if the data is received 

    let query = {text: `INSERT INTO  posts (sender_id, topic_id, post) VALUES ($1, $2, $3) RETURNING *`,
    value: [post.sender_id, post.topic_id, post.post]}

    pool.query(query.text, query.value)
    .then(data => {
      console.log(data.rows)
      return res.status(201).json(data);
        
    }).catch(err => {
        console.log(err);
        return res.status(400).json(err);
    });
} 

//Gets all from a specific group chat
module.exports.getPostsFromSpecificDiscussion = (req, res) => {

    console.log(req.params.id)
    let query = {text: `SELECT * FROM posts WHERE topic_id = $1`,
    value: [req.params.id]}

    pool.query(query.text, query.value)
    .then(data => {
        if(data.rowCount > 0){
            // console.log("shiba K")
            // console.log(data.rows)
            return res.status(201).json(data.rows);
        }
        else{
            return res.status(201).json('No posts found, be the first to make a post')
        }
        
    }).catch(err => {
        // console.log(err);
        return res.status(400).json(err);
    });
}

//Gets all from a specific group chat
module.exports.getTopicsForSpecificSubject = (req, res) => {

    console.log(req.params.id)
    let query = {text: `SELECT topic.id, topic.sender_id, topic.subject_id, topic.topic, subject.name FROM topic
                        INNER JOIN subject
                        ON topic.subject_id = subject.id
                        WHERE topic.subject_id = $1`,
    value: [req.params.id]}

    pool.query(query.text, query.value)
    .then(data => {
        if(data.rowCount > 0){
            console.log(data.rows)
            return res.status(201).json(data.rows);
        }
        else{
            return res.status(201).json('No posts found, be the first to make a post')
        }
        
    }).catch(err => {
        console.log(err);
        return res.status(400).json(err);
    });
}

//make a reply to a specific post in a group chat
module.exports.makeReply = (req, res) => {
    
    let reply = {
        question_id: req.body.question_id,
        user_id: req.body.user_id,
        reply: req.body.reply
    }

    let query = {
        text: `INSERT INTO replies (post_id, sender_id, replies) VALUES ($1, $2, $3)`,
        value: [reply.question_id, reply.user_id, reply.reply]
    }

    pool.query(query.text, query.value).then(data => {
        if(data.rowCount > 0){
            return res.status(201).json('reply successful');
        }
        else{
            return res.status(201).json('Reply unsuccessful')
        }
    }).catch(err => {
        console.log(err)
        return res.status(401).json('Reply unsuccessful. Check sql statement')
    })
}

//Gets all replies for a specific question
module.exports.getReplies = (req, res) => {

    console.log(req.params.id)
    let query ={
        text: `select * from replies where post_id = $1`,
        value: [req.params.id]
    }

    pool.query(query.text, query.value).then(data => {
        console.log(data)
        if(data.rowCount > 0){
            
        return res.status(201).json(data.rows)
        }else {
            return res.status(201).json("No replies found")
        }
    }).catch(err => {
        console.log(err)
        return res.status(401).json("Didn't get replies")
    })
}