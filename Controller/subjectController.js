const pool = require('../db_config/config') 
const { rows } = require('pg/lib/defaults');

/**
 * saves subject details into DB subject table
 * @param {Object} req { name, description }
 * @param {*} res 
 */
module.exports.addSubject = (req, res) => {

    object = {
        name: req.body.name,
        description: req.body.description
    }

    let query = {
        text: `INSERT INTO subject ( name, description) 
        VALUES ($1, $2) RETURNING *`,
        values: [object.name, object.description]
    }
    pool.query(query.text, query.values)
        .then(data => {
            if(data.rowCount) {
                console.log(data)
                return res.status(200).json('Successfully added subject')
            } else {
                return res.status(404).json('subject not added')
            }
        })
        .catch(err => {
            console.log(err);
            res.send(err)
        })
}

/**
 * deletes subject
 * @param {Object} req { id }
 * @param {*} res 
 */
 module.exports.deleteSubject = (req, res) => {

    let id = req.params.id;
    id = id.substring(1);
    console.log(id)

    let query = {
        text: `DELETE FROM subject WHERE id = $1`,
        values: [id]
    }

    pool.query(query.text, query.values)
        .then(data => {
            if(data.rowCount) {
                console.log(data)
                return res.status(200).json(`Successfully deleted subject with id: ${req.params.id}`)
            } else {
                return res.status(404).json('subject not found')
            }
        })
        .catch(err => {
            console.log(err);
            res.send(err)
        })
}

/**
 * updates a subject
 * @param {Object} req { id }
 * @param {*} res 
 */
 module.exports.updateSubject = (req, res) => {

    let id = req.params.id;
    id = id.substring(1);
    object ={
        name: req.body.name,
        description: req.body.description
    }

    let query = {
        text: `UPDATE subject SET name = $1, description = $2, updated_at = NOW() 
                WHERE id = $3`,
        values: [object.name, object.description, id]
    }

    pool.query(query.text, query.values)
        .then(data => {
            if(data.rowCount) {
                console.log(data)
                return res.status(200).json(`Successfully updated subject with id: ${req.params.id}`)
            } else {
                return res.status(404).json('subject not found')
            }
        })
        .catch(err => {
            console.log(err)
        })
}

/**
 * gets all the host and guest users from the DB
 * @param {null} req 
 * @param {Object} res status().json() 2 arrays of host and guest users
 */
 module.exports.getAllSubjects = (req, res) => {
    // const userType = req.params.userType;
    // let allUsers = {};
    // console.log(userType);

    pool.query(`SELECT * FROM subject;`)
        .then(data => {
            //Getting all 
            // Users = data.rows
            return res.status(201).json(data.rows);
        })
        .catch(err => console.log(err))
        
    // setTimeout(() => {
    //     return res.status(201).json(allUsers)
    // }, 1000)  
}

/**
 * gets a single subject from the DB
 * @param {null} req params.id
 * @param {Object} res status().json() 2 arrays of host and guest users
 */
module.exports.getOneSubject = (req, res) => {

    let query = {
        text: `SELECT *
               FROM subject WHERE id = $1;`,
        value: [req.params.id]
    }

    pool.query(query.text, query.value)
        .then(data => {
            if(data.rowCount) {
                return res.status(201).json(data.rows[0])
            }
        })
        .catch(err => {
            console.log(err)
        })
}
