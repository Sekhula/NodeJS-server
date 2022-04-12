const jwt = require('jsonwebtoken');
const res = require('express/lib/response');
const bcrypt = require('bcryptjs');
const { isEmail, isMobilePhone } = require('validator');
const {cloudinary} = require('../Cloudinary/cloudinary');
const fs = require('fs');
// const { v4: uuidv4 } = require('uuid')
const pool = require('../db_config/config');   //represents pool pg object required from connection file
const { log } = require('console');


/**
 * validates user signup/login credentials. returns object with error messages if credentails are not valid
 * @param {string} authtype signup OR login
 * @param {Object} user user credentials and info
 * @returns {Object} { isValid: bool, error: Object }
 */
function userValidation(authType, user) {
    let result = {
        isValid: true,
        errors: { email: '', password: '', name: '', phone: ''}
    }

    //validate only for signup
    if(authType == 'signup' && !user.name) 
    {
        result.isValid = false;
        result.errors.name = 'please enter your name ';
    }

    if(authType == 'signup' && (!user.phone || !isMobilePhone(user.phone))) 
    {
        result.isValid = false;
        result.errors.phone = 'please enter a valid phone number';
    }

    //validate email for signup and login
    if(!user.email || !isEmail(user.email)) 
    {
        result.isValid = false;
        result.errors.email = 'please enter a valid email';
    }

    //validate password for signup and login
    if(!user.password || user.password.length < 6) 
    {
        result.isValid = false;
        result.errors.password = 'password must be atleast 6 characters long';
    }

    return result;
}

/**
 * handles errors caught by pool.query() catch block when making queries to DB based on PostgreSQL Error Codes
 * @param {Object} queryError error object from pool.query() catch block
 * @returns {Object} error object with user credental/info errors
 */
function queryErrorHandler(queryError) {
    let errors = { name: '', email: '', phone: '', password: ''}
    
    //unique_violation error
    if(queryError.code == 23505) {
        errors.email = 'this user is already registered'
    }
    //not_null_violation error
    if(queryError.code == 23502) {
        errors[queryError.column] = 'field cannot be empty'; //ensure that DB table column names are the same as errors{} key names for this to work
    }
    //restrict_violation error
    if(queryError.code == 22001) {
        errors.phone = 'phone number is too long'
    }
    // incorrect email or password
    if(queryError.message.includes('username does not exist')) {
        errors.email = queryError.message
    } else if (queryError.message.includes('password is incorrect')) {
        errors.password = queryError.message
    }

    return errors
}

//hash user's password
function hashPassword(pwd) {
    let salt = bcrypt.genSaltSync();
    let hashedPassword = bcrypt.hashSync(pwd, salt);
    return hashedPassword;
}

//create new jwt token for payload
const generateToken = (payload) => {
    return jwt.sign(payload, 'w', { expiresIn: '1h'})   // *issue: setting secret to .env.JWT_SECRET == undefined
}



/**
 * saves user details into DB guests table or hosts table
 * @param {Object} req { name, email, phone, password, address, userType}
 * @param {*} res 
 */
module.exports.signup = (req, res) => {
    const userType = req.params.userType;
    console.log(userType)
    let newUser = {
        name: req.body.full_name, 
        email: req.body.email, 
        phone: req.body.cellno,
        status: req.body.status,
        password: req.body.password
    };
    console.log(newUser);
    // check :userType paramater. only accept /Learner or /Teacher
    if (!(userType == 'teacher' || userType == 'learner')) {
        res.status(400).send('invalid userType parameter in url.')
        throw Error ('Invalid value in request parameter. /:userType parameter must be equal to "teacher","Admin" or "learner"');
    }

    //validate user credentials
    if(!userValidation('signup', newUser).isValid) {
        let errors = userValidation('signup', newUser).errors
        return res.status(400).json(errors)
    }

    let hashedPassword = hashPassword(newUser.password); //hash user password
    // let newUserId = uuidv4(); //generate user id

    //query object
    let query = {
        text: `INSERT INTO users ( full_name, email, cellno, userType, status, password) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, userType, full_name`,
        value: [newUser.name, newUser.email, newUser.phone,  userType, newUser.status, hashedPassword]
    }
    
    // DB query
    pool.query(query.text, query.value)
        .then(data => {
            return res.status(201).json(data.rows[0])
        })
        .catch(err => {
            console.log(err);
            let error = queryErrorHandler(err)
            return res.status(400).json("User already exists")
        }
    );
}

/**
 * verifies existing customer user against DB credentials
 * @param {Object} req { body.email, body.password , body.userType}
 * @param {*} res 
 */
module.exports.login = (req, res) => {

    var user={
        username:"",
        password:""
    }
    console.log(req.body)
    user = {
        username: req.body.username, 
        password: req.body.password
    }
    console.log("user");
    console.log(user);

    // validate user credentials
    if(userValidation('login', user).isValid) {
        let errors = userValidation('login', user).errors
        return res.status(400).json(errors)
    }

    //Null query object
    let query = {
        text: '',
        value: ''
    }

// Checking if user type
    var usernsme = user.username.includes("@") ? "email" : "cellno";
    console.log(usernsme);

    query = {
        text: `SELECT id, full_name, email, cellno, status, userType, password FROM users WHERE ${usernsme} = $1;`,
        value: [user.username]
    }
 
    // DB query
    pool.query(query.text, query.value)
        .then(data => {
            if (data.rowCount) //username exists
            { 
                console.log(data.rows[0].status)
                if(data.rows[0].status == true){
                            
                    //verify password
                    let decryptPassword = data.rows[0].password
                    // console.log(decryptPassword);
                    let passwordIsCorrect = bcrypt.compareSync(user.password, decryptPassword); //campare user password to hashed password in DB

                    if (passwordIsCorrect) {  //pwd correct
                        let payload = {
                            id: data.rows[0].id
                        }

                        let token = generateToken(payload); //jwt token
                        console.log(data.rows)
                        let object = {
                            id: data.rows[0].id,
                            username: data.rows[0].email,
                            phone: data.rows[0].cellno,
                            full_names: data.rows[0].full_name,
                            usertype : data.rows[0].usertype,
                            status: data.rows[0].status,
                            token: token
                        }
                        //response
                        return res.status(201).json(object);

                    } else {res.status(400).json('password is incorrect')}

                } else {res.status(400).json('Account locked by admin')}

            } else { res.status(400).json('username entered does not exist') }
        })
        .catch(err => {
            console.log(err);
            let error = queryErrorHandler(err);
            return res.status(400).json(error);
        }
    );

}

/**
 * logs out user by setting empty jwt token
 * @param {*} req
 * @param {*} res
 */
module.exports.logout = (req, res) => {
    res.status(200).json({token: ''});
}

module.exports.fileUpload = async (req, res, next) => {
  

    try {
        var  qualification_url;
        if (req.file) {
            console.log("req",req.file);
            if(req.file.size>10485760){
                console.log("size");
                return res.status(400).send({msg:"size too large"});
            }
            if(!req.file.mimetype === 'application/pdf' ){
                console.log("pdf");
                return res.status(400).send({msg:"wrong file formart expected pdf"});
            }

             qualification_url = req.file.path ? req.file.path : "";
            console.log("qurl:",qualification_url);
    
        }
        const uploadResponse = await cloudinary.uploader.upload(qualification_url, {
            folder: 'qualification',
            resource_type: 'raw'
        });

        const path = qualification_url;
         console.log("del",path);
        fs.unlinkSync(path);
         console.log(uploadResponse.url);
        //take cloudinary response and get url set cert_url to cloudinary url
        return res.status(201).json({url: uploadResponse.url});


    } catch (error) {
        console.log(error);
       next(error);
    }
}