const { response } = require('express')
const pool = require('../db_config/config')  

/**
 * gets all the host and guest users from the DB
 * @param {null} req 
 * @param {Object} res status().json() 2 arrays of host and guest users
 */
module.exports.getAll = (req, res) => {
    // const userType = req.params.userType;
    // let allUsers = {};
    // console.log(userType);

    pool.query(`SELECT id, full_name, email, cellno, status, userType, created_at, updated_at
                FROM users WHERE userType != 'admin';`)
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
module.exports.getAllTeachers = (req, res) => {
    // const userType = req.params.userType;
    // let allUsers = {};
    // console.log(userType);

    pool.query(`SELECT id, full_name, email, cellno, status, userType, created_at, updated_at
                FROM users WHERE userType != 'admin' AND userType = 'teacher';`)
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

module.exports.getAllLearners = (req, res) => {
    // const userType = req.params.userType;
    // let allUsers = {};
    // console.log(userType);

    pool.query(`SELECT id, full_name, email, cellno, status, userType, created_at, updated_at
                FROM users WHERE userType != 'admin' AND userType = 'learner';`)
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
 * gets a single user from the DB
 * @param {null} req params.id
 * @param {Object} res status().json() 2 arrays of host and guest users
 */
module.exports.getOne = (req, res) => {
    // const userType = req.params.userType;

    let query = {
        text: `SELECT id, full_name, email, cellno, status, userType, created_at, updated_at
               FROM users WHERE id = $1`,
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
 
 /**
 * update a single user's profile from the DB
 * @param {null} req params.id
 * @param {Object} res status().json() updated user data
 */
module.exports.updateOne = (req, res) => {
    const userType = req.params.userType;

    console.log(req.body);
    let user = {
        name: req.body.name, 
        email: req.body.email, 
        phone: req.body.phone
    };

    console.log(user);

    let query = {
        text: `UPDATE users SET full_name = $1, email = $2, cellno = $3, updated_at = NOW() 
                WHERE id = $4`,
        values: [user.name, user.email, user.phone, req.params.id]
    }

    pool.query(query.text, query.values)
        .then(data => {
            if(data.rowCount) {
                console.log(data)
                return res.status(200).json(`Successfully updated user with id: ${req.params.id}`)
            } else {
                return res.status(404).json('user not found')
            }
        })
        .catch(err => {
            console.log(err)
        })
}

/**
 * deletes a single user from the DB
 * @param {null} req params.id
 * @param {Object} res status().json() 
 */
 module.exports.delete = (req, res) => {
    // const userType = req.params.userType;
    // let userId = req.userId;
    
    let query = {
        text: `DELETE FROM users WHERE id = $1`,
        value: [req.params.id]
    }

    pool.query(query.text, query.value)
        .then(data => {
            if(data.rowCount) {
                return res.status(201).json(`Successfully deleted user with id: ${req.params.id}`)
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    module.exports.updateUserStatus = (req, res) => {
        // const userType = req.params.userType;
    
        console.log(req.body);
        let user = {
            user_id: req.body.user_id,
            user_status: req.body.user_status
        
        };
    
        console.log(user);
    
        let query = {
            text: `UPDATE users SET status = $1, updated_at = NOW() 
                    WHERE id = $2`,
            values: [user.user_status, user.user_id]
        }
    
        pool.query(query.text, query.values)
            .then(data => {
                if(data.rowCount) {
                    console.log(data)
                    return res.status(200).json(`Successfully updated staus of user with id: ${user.user_id}`)
                } else {
                    return res.status(404).json('user not found')
                }
            })
            .catch(err => {
                console.log(err)
            })
    
}