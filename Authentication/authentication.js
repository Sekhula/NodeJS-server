const jwt = require('jsonwebtoken');

/**
 * Authentication for userType 'teacher' and 'admin' for protected routes
 * @param {*} req { body.jwt }
 * @param {*} res { status(), json() }
 * @param {*} next 
 * @returns error message if user is not a teacher user
 */
 module.exports.authTeachertUser = (req, res, next) => {
    let token = '';
    console.log(token);

    if (token) {    //token exists
        let decoded = jwt.verify(token, 'w');

        if (decoded) {  //token verified
            console.log('token decoded: ', decoded);
            //set req{ userType, userId} to be used by controller
            req.userType = decoded.userType;
            req.userId = decoded.id;

            if(decoded.userType === 'teacher' || decoded.userType === 'admin') {    //user is a teacher user
                next();
            } else {return res.status(401).json('please login as a teacher to access this feature')}

        } else {return res.json.status(401).json('token invalid. Please Login')}

    } else { return res.status(401).json('token not found. Please Login.')}
}

/**
 * Authentication for userType 'learner' and 'admin' for protected routes
 * @param {*} req { body.jwt }
 * @param {*} res { status(), json() }
 * @param {*} next 
 * @returns error message if user is not a learner user
 */
 module.exports.authLearnertUser = (req, res, next) => {
    let token = '';
    console.log(token);

    if (token) {    //token exists
        let decoded = jwt.verify(token, 'w');

        if (decoded) {  //token verified
            console.log('token decoded: ', decoded);
            // set req{ userType, userId} to be used by controller
            req.userType = decoded.userType;
            req.userId = decoded.id;

            if(decoded.userType === 'learner' || decoded.userType === 'admin') {    //user is a learner user
                next();
            } else {return res.status(401).json('please login as a learner to access this feature')}

        } else {return res.json.status(401).json('token invalid. Please Login')}

    } else { return res.status(401).json('token not found. Please Login.')}
}

/**
 * Authentication for userType 'admin' for protected routes
 * @param {*} req { body.jwt }
 * @param {*} res { status(), json() }
 * @param {*} next 
 * @returns error message if user is not a admin user
 */
 module.exports.authAdminUser = (req, res, next) => {
    let token = '';
    console.log(token);

    if (token) {    //token exists
        let decoded = jwt.verify(token, 'w');

        if (decoded) {  //token verified
            console.log('token decoded: ', decoded);
            //set req{ userType, userId} to be used by controller
            req.userType = decoded.userType;
            req.userId = decoded.id;

            if(decoded.userType === 'admin') { //user is a Admin user
                next();
            } else {return res.status(401).json('please login as an admin to access this feature')}

        } else {return res.json.status(401).json('token invalid. Please Login')}

    } else { return res.status(401).json('token not found. Please Login.')}
}

/**
 * Authentication for any logged in user for protected routes
 * @param {*} req { body.jwt }
 * @param {*} res { status(), json() }
 * @param {*} next 
 * @returns error message if user is not logged in
 */
 module.exports.authUser = (req, res, next) => {
    let token = '';
    console.log(token);

    if (token) { //token exists
        let decoded = jwt.verify(token, 'w');

        if (decoded) {  //token verified
            console.log('token decoded: ', decoded);
            //set req{ userType, userId} to be used by controller
            req.userType = decoded.userType;
            req.userId = decoded.id;
            next()
        } else {return res.json.status(401).json('token invalid. Please Login')}

    } else { return res.status(401).json('token not found. Please Login.')}
}