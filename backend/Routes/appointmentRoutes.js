const express = require('express');
const router = express.Router();
const appointmentController = require('../Controllers/appointmentController');
const checkAppointmentLimit = require('../Middlewares/limitMiddleware');

// Route to book an appointment
router.post('/book', checkAppointmentLimit, appointmentController.bookAppointment);
router.get('/', appointmentController.getAppointmentsByEmail);


module.exports = router;
