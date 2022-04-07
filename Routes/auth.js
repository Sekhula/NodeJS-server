const express = require('express');
// const { user } = require('pg/lib/defaults');
const userController = require('../Controller/authContrller');
// const authAdminUser = require('../Authentication/authentication')
const router = express.Router();

//get all user's personal profiles - auth: admin only
router.get('/getAll/', userController.getAll);

//delete personal profile by id - auth: admin only
router.delete('/delete/:id', userController.delete);

//get personal profile by id - auth: host, guest, admi
router.get('/getOne/:id', userController.getOne);

//update user's profile by id auth: host, guest, admin
router.put('/updateOne/:id', userController.updateOne);

module.exports = router
