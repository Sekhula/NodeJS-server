const { Router } = require("express");
const authController = require('../Controller/userController');
const authenicate = require('../Authentication/authentication')
const userController = require('../Controller/authContrller');
const router = Router();

//get all user's personal profiles - auth: admin only
router.get('/getAll', userController.getAll);

//delete personal profile by id - auth: admin only
router.delete('/:userType/:id', userController.delete);

//get personal profile by id - auth: host, guest, admi
router.get('/:userType}/:id', userController.getOne);

//update user's profile by id auth: host, guest, admin
router.put('/:userType/:id', userController.updateOne);
//signup new customer user with name, email, password, UserType
router.post('/signup/:userType', authController.signup);

//existing customer user login
router.post('/login', authController.login);

//logout any user
router.get('/logout', authController.logout);

//Upload response saved to the db
router.post('/myDocs', authController.myDocs);

//Upload response saved to the db
router.post('/get-docs', authController.getDocs);

module.exports = router;
