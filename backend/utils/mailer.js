const postmark = require('postmark');

// Create Postmark client
const client = new postmark.ServerClient('b181ae3b-fadc-479b-bd0a-9f621cdb5549');

const sendConfirmationEmail = (recipient, appointmentDetails) => {
  client.sendEmail({
    From: '2022.yash.rahate@ves.ac.in',
    To: recipient,
    Subject: 'Appointment Confirmation',
    HtmlBody: `
      <h1>Appointment Confirmed</h1>
      <p>Dear ${appointmentDetails.a_name},</p>
      <p>Your appointment for <strong>${appointmentDetails.a_service}</strong> on <strong>${appointmentDetails.a_date}</strong> at <strong>${appointmentDetails.a_outlet}</strong> has been confirmed.</p>
      <p>Timeslot: ${appointmentDetails.a_timeslot}</p>
      <p>${appointmentDetails.a_specialrequest ? `Special Request: ${appointmentDetails.a_specialrequest}` : ''}</p>
      <p>Thank you for choosing us!</p>
    `,
  }, (error, result) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', result);
    }
  });
};

module.exports = sendConfirmationEmail;
