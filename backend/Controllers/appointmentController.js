const Appointment = require('../Models/Appointment');
const sendConfirmationEmail = require('../utils/mailer'); // Import the mailer

// Controller to book an appointment
const bookAppointment = async (req, res) => {
  try {
    const { a_name, a_email, a_vehicle, a_outlet, a_specialrequest, local_email } = req.body;

    // Check if there are already 3 appointments for the same date, time slot, outlet, and local email
    const appointmentCount = await Appointment.countDocuments({
      // a_date: new Date(a_date), // Convert date string to Date object if needed
      // a_timeslot: a_timeslot,
      a_outlet: a_outlet,

    });

    // if (appointmentCount >= 3) {
    //   return res.status(400).json({ message: 'Maximum appointment limit reached for this Time slot, Date. Please choose another Time or Date.' });
    // }

    // Create new appointment
    const newAppointment = new Appointment({
      a_name,
      a_email,
      a_vehicle,
      // a_date,
      a_outlet,
      // a_timeslot,
      a_specialrequest,
      local_email // Include local_email in the appointment document
    });

    // Save to database
    await newAppointment.save();

    // Send confirmation email
    sendConfirmationEmail(a_email, newAppointment);

    res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Error booking appointment', error });
  }
};

// Controller to get all appointments (for testing)
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointments', error });
  }
};

const getAppointmentsByEmail = async (req, res) => {
  const { email } = req.query; // Get email from query parameters

  try {
    const appointments = await Appointment.find({ local_email: email }); // Fetch appointments based on email
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointments', error });
  }
};


module.exports = {
  bookAppointment,
  getAllAppointments,
  getAppointmentsByEmail,
};
