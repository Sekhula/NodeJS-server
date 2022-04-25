const { Router } = require("express");
const booking = require('../Controller/bookingController')
const router = Router();

//Gets all bookings
router.post('/get-booking', booking.getBooking);

//Make a booking
router.post('/book', booking.book)

//Update booking status
router.put('/update-booking', booking.updateStatus)

//Get all bookings
router.get('/get-all-bookings', booking.getAllBookings)


module.exports = router;