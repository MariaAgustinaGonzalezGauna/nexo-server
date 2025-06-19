const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.error('Error en la configuración de nodemailer:', error);
  } else {
    console.log('Nodemailer listo para enviar emails');
  }
});

module.exports = transporter;