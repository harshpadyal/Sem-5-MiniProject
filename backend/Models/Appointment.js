const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  a_name: {
    type: String,
    required: true,
  },
  a_email: {
    type: String,
    required: true,
  },
  a_vehicle: {
    type: String,
    required: true,
  },
  a_outlet: {
    type: String,
    required: true,
  },
  a_specialrequest: {
    type: String,
  },
  local_email: {
    type: String,
    required: true, // Marked as required
  }
});

const AppointmentModel = mongoose.model('Appointment', appointmentSchema);

module.exports = AppointmentModel;
