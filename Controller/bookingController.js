const { response } = require('express')
const pool = require('../db_config/config') 

//Get bookings
module.exports.getBooking = (req, res) => {

    let object = {
        user_id: req.body.user_id,
        usertype: req.body.usertype
    }

    console.log(req.body)

    let userType = '';
    let otherType = '';

    if(object.usertype === 'learner'){
        userType = object.usertype;
        otherType = 'teacher';
    } else if(object.usertype === 'teacher'){
        userType = object.usertype
        otherType = 'learner'
    }

    let query = {
        text: `select booking.id, booking.topic, booking.duration, booking.date ,booking.teacher_id,booking.learner_id, booking.status, booking.subject_id, users.full_name, sessions.id as session_id 
        FROM booking 
        INNER JOIN users ON users.id = booking.${otherType}_id 
        INNER JOIN sessions ON booking.id = sessions.booking_id
        WHERE ${userType}_id = $1`,
        value: [object.user_id]
    }

    console.log(userType,"_id")
    pool.query(query.text, query.value).then(data => {
        if(data.rowCount > 0) {
            console.log(data.rows)
            return res.status(201).json(data.rows)
        } else {
            return res.status(201).json('No bookings found')
        }
    })
    .catch(err => {
        console.log(err);
        res.send(err)
        return res.status(400).json("Couldn't find bookings")
    })
}

//Create 1 booking
module.exports.book = (req, res) => {
    let object = {
        topic: req.body.topic,
        date: req.body.date,
        time: req.body.time,
        duration: req.body.duration,
        teacher_id: req.body.teacher_id,
        learner_id: req.body.learner_id,
        subject_id: req.body.subject_id,
        status: req.body.status
    }

    console.log(object)
    let query = {
        text: 'INSERT INTO booking (topic, date, time, duration, teacher_id, learner_id, subject_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', 
        value:[object.topic, object.date, object.time, object.duration, object.teacher_id, object.learner_id, object.subject_id, object.status]
    }

    pool.query(query.text, query.value).then(data => {
        if(data.rowCount > 0)
        {
            return res.status(201).json('Successfully booked')
        }
    }).catch(err => {
        console.log(err);
        res.send(err)
        return res.status(400).json("Couldn't do the booking")
    })
}

//Update Booking Status
module.exports.updateStatus = (req, res) => {
    let object = {
        id: req.body.id,
        teacher_id: req.body.teacher_id,
        status: req.body.status
    }

    console.log(object)
    let query = {
        text: 'UPDATE booking SET status = $1 WHERE id = $2 AND teacher_id = $3', 
        value:[object.status, object.id, object.teacher_id]
    }

    let query_session = {
        text: `INSERT INTO sessions (booking_id) VALUES ($1) RETURNING *`,
        value: [object.id]
    }

    pool.query(query.text, query.value).then(data => {
        if(data.rowCount > 0)
        {
            if(object.status === 'declined') {
                return res.status(201).json('Successfully declined booking')
            } else if(object.status === 'approved') {
                pool.query(query_session.text, query_session.value).then(data => {
                    console.log(data)
            
                }).catch(err => {
                    console.log(err)
                    return res.status(401).json("Couldn't create session")
                })
                return res.status(201).json('Successfully approved booking')
            }else{
                return res.status(201).json('Booking status not found')
            }
        }
    }).catch(err => {
        console.log(err);
        res.send(err)
        return res.status(400).json("Couldn't update booking")
    })
}

//Get all bookings
module.exports.getAllBookings = (req, res) => {

    pool.query(`SELECT booking.id, booking.date, duration, booking.learner_id, 
    booking.status, booking.subject_id, booking.teacher_id, booking.time, booking.topic, users.full_name, subject.name 
    FROM booking
    INNER JOIN users ON booking.learner_id = users.id
    INNER JOIN subject ON booking.subject_id = subject.id`).then(data => {
        return res.status(201).json(data.rows)
    }).catch(err =>{
        return res.status(401).json(err)
    })
}