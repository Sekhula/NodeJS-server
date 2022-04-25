const { Router } = require("express");
const rooms = require('../Controller/roomsController')
const router = Router();

//Send A Message
router.get('/getRooms', rooms.getRooms);

module.exports = router;