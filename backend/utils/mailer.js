const postmark = require('postmark');

// Create Postmark client
const client = new postmark.ServerClient('ced7fd7f-abb5-4508-8d57-350a7fab3142');

const sendConfirmationEmail = (recipient, appointmentDetails) => {
  client.sendEmail({
    From: '2022.harsh.padyal@ves.ac.in',
    To: recipient,
    Subject: 'Request Confirmation',
    HtmlBody: `
      <h1>Request Confirmed</h1>
      <p>Dear ${appointmentDetails.a_name},</p>
      <p>Your Request for <strong>${appointmentDetails.a_vehicle}</strong><strong></strong> at <strong>${appointmentDetails.a_outlet}</strong> has been confirmed.</p>
      <p>${appointmentDetails.a_specialrequest ? `Description: ${appointmentDetails.a_specialrequest}` : ''}</p>
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

